package oauth2

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
	"time"
)

func TestAuthCodeURL(t *testing.T) {
	cfg := Config{
		ClientID:    "client",
		RedirectURL: "https://app.example/callback",
		Scopes:      []string{"openid", "profile"},
		Endpoint:    Endpoint{AuthURL: "https://issuer.example/authorize"},
	}

	verifier, err := NewVerifier()
	if err != nil {
		t.Fatal(err)
	}
	raw := cfg.AuthCodeURL("state", verifier)
	u, err := url.Parse(raw)
	if err != nil {
		t.Fatal(err)
	}
	q := u.Query()
	if q.Get("response_type") != "code" || q.Get("client_id") != "client" {
		t.Fatalf("query = %v", q)
	}
	if q.Get("scope") != "openid profile" {
		t.Fatalf("scope = %q", q.Get("scope"))
	}
	if q.Get("code_challenge") != ChallengeS256(verifier) {
		t.Fatalf("challenge = %q", q.Get("code_challenge"))
	}
	if q.Get("code_challenge_method") != "S256" {
		t.Fatalf("method = %q", q.Get("code_challenge_method"))
	}
}

func TestExchange(t *testing.T) {
	var got url.Values
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil {
			t.Fatal(err)
		}
		got = r.PostForm
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"access_token":  "access",
			"refresh_token": "refresh",
			"token_type":    "Bearer",
			"expires_in":    3600,
		})
	}))
	defer server.Close()

	cfg := Config{
		ClientID:     "client",
		ClientSecret: "secret",
		RedirectURL:  "https://app.example/callback",
		Endpoint:     Endpoint{AuthURL: server.URL, TokenURL: server.URL},
	}
	token, err := cfg.Exchange(context.Background(), "code", "verifier")
	if err != nil {
		t.Fatal(err)
	}
	if token.AccessToken != "access" || token.RefreshToken != "refresh" {
		t.Fatalf("token = %+v", token)
	}
	if token.ExpiresAt.IsZero() || !token.Valid() {
		t.Fatalf("expiry = %v, valid = %v", token.ExpiresAt, token.Valid())
	}
	if got.Get("grant_type") != "authorization_code" || got.Get("code") != "code" {
		t.Fatalf("form = %v", got)
	}
	if got.Get("code_verifier") != "verifier" {
		t.Fatalf("verifier = %q", got.Get("code_verifier"))
	}
	if got.Get("client_secret") != "secret" {
		t.Fatalf("secret = %q", got.Get("client_secret"))
	}
}

func TestExchange_Error(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{
			"error":             "invalid_grant",
			"error_description": "code expired",
		})
	}))
	defer server.Close()

	cfg := Config{
		ClientID:    "client",
		RedirectURL: "https://app.example/callback",
		Endpoint:    Endpoint{AuthURL: server.URL, TokenURL: server.URL},
	}
	_, err := cfg.Exchange(context.Background(), "code", "")
	var oauthErr *Error
	if !errors.As(err, &oauthErr) {
		t.Fatalf("err = %v", err)
	}
	if oauthErr.StatusCode != 400 || oauthErr.Code != "invalid_grant" {
		t.Fatalf("error = %+v", oauthErr)
	}
}

func TestExchange_RequiresCode(t *testing.T) {
	cfg := Config{
		ClientID:    "client",
		RedirectURL: "https://app.example/callback",
		Endpoint:    Endpoint{AuthURL: "https://issuer.example/authorize", TokenURL: "https://issuer.example/token"},
	}
	if _, err := cfg.Exchange(context.Background(), "", ""); err == nil {
		t.Fatal("expected code error")
	}
}

func TestRefresh_MinimalConfig(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewEncoder(w).Encode(map[string]any{"access_token": "new"})
	}))
	defer server.Close()

	cfg := Config{ClientID: "client", Endpoint: Endpoint{TokenURL: server.URL}}
	if _, err := cfg.Refresh(context.Background(), "refresh"); err != nil {
		t.Fatal(err)
	}
}

func TestExchange_BasicAuth(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, pass, ok := r.BasicAuth()
		if !ok || user != "client" || pass != "secret" {
			t.Fatalf("basic auth = %q %q %v", user, pass, ok)
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"access_token": "access"})
	}))
	defer server.Close()

	cfg := Config{
		ClientID:     "client",
		ClientSecret: "secret",
		RedirectURL:  "https://app.example/callback",
		Endpoint:     Endpoint{AuthURL: server.URL, TokenURL: server.URL},
		AuthStyle:    AuthStyleBasic,
	}
	if _, err := cfg.Exchange(context.Background(), "code", ""); err != nil {
		t.Fatal(err)
	}
}

func TestRefresh(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil {
			t.Fatal(err)
		}
		if r.PostForm.Get("grant_type") != "refresh_token" || r.PostForm.Get("refresh_token") != "refresh" {
			t.Fatalf("form = %v", r.PostForm)
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"access_token": "new"})
	}))
	defer server.Close()

	cfg := Config{
		ClientID:    "client",
		RedirectURL: "https://app.example/callback",
		Endpoint:    Endpoint{AuthURL: server.URL, TokenURL: server.URL},
	}
	token, err := cfg.Refresh(context.Background(), "refresh")
	if err != nil {
		t.Fatal(err)
	}
	if token.AccessToken != "new" {
		t.Fatalf("token = %+v", token)
	}
}

func TestValidateState(t *testing.T) {
	if !ValidateState("abc", "abc") {
		t.Fatal("expected match")
	}
	if ValidateState("abc", "abd") || ValidateState("", "") {
		t.Fatal("expected mismatch")
	}
}

func TestTokenValid(t *testing.T) {
	if (&Token{AccessToken: "x"}).Valid() != true {
		t.Fatal("token without expiry should be valid")
	}
	if (&Token{AccessToken: "x", ExpiresAt: time.Now().Add(-time.Minute)}).Valid() != false {
		t.Fatal("expired token should be invalid")
	}
	if !strings.Contains((&Error{StatusCode: 500}).Error(), "500") {
		t.Fatal("unexpected error text")
	}
}
