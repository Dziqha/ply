// Package oauth2 implements the OAuth 2.0 authorization code flow with PKCE.
package oauth2

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type AuthStyle int

const (
	AuthStylePost AuthStyle = iota
	AuthStyleBasic
)

type Endpoint struct {
	AuthURL  string
	TokenURL string
}

type Config struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
	Scopes       []string
	Endpoint     Endpoint
	AuthStyle    AuthStyle
	HTTPClient   *http.Client
}

type Token struct {
	AccessToken  string         `json:"access_token"`
	TokenType    string         `json:"token_type"`
	RefreshToken string         `json:"refresh_token,omitempty"`
	ExpiresIn    int64          `json:"expires_in,omitempty"`
	Scope        string         `json:"scope,omitempty"`
	IDToken      string         `json:"id_token,omitempty"`
	ExpiresAt    time.Time      `json:"-"`
	Raw          map[string]any `json:"-"`
}

type Error struct {
	StatusCode  int
	Code        string
	Description string
	URI         string
	Body        string
}

func (e *Error) Error() string {
	if e == nil {
		return "oauth2: error"
	}
	if e.Code != "" {
		if e.Description != "" {
			return fmt.Sprintf("oauth2: %s: %s", e.Code, e.Description)
		}
		return "oauth2: " + e.Code
	}
	if e.Description != "" {
		return "oauth2: " + e.Description
	}
	if e.StatusCode != 0 {
		return fmt.Sprintf("oauth2: token endpoint returned %d", e.StatusCode)
	}
	return "oauth2: error"
}

func (c *Config) Validate() error {
	if err := c.validateClient(); err != nil {
		return err
	}
	if c.Endpoint.AuthURL == "" {
		return errors.New("oauth2: authorization endpoint is required")
	}
	if c.RedirectURL == "" {
		return errors.New("oauth2: redirect url is required")
	}
	return nil
}

func (c *Config) validateClient() error {
	if c.ClientID == "" {
		return errors.New("oauth2: client id is required")
	}
	if c.Endpoint.TokenURL == "" {
		return errors.New("oauth2: token endpoint is required")
	}
	return nil
}

func (c *Config) AuthCodeURL(state, verifier string) string {
	return c.AuthCodeURLWithParams(state, verifier, nil)
}

func (c *Config) AuthCodeURLWithParams(state, verifier string, extra url.Values) string {
	u, err := url.Parse(c.Endpoint.AuthURL)
	if err != nil {
		return ""
	}
	q := u.Query()
	for key, values := range extra {
		for _, value := range values {
			q.Add(key, value)
		}
	}
	q.Set("response_type", "code")
	q.Set("client_id", c.ClientID)
	q.Set("redirect_uri", c.RedirectURL)
	if len(c.Scopes) > 0 {
		q.Set("scope", strings.Join(c.Scopes, " "))
	}
	if state != "" {
		q.Set("state", state)
	}
	if verifier != "" {
		q.Set("code_challenge", ChallengeS256(verifier))
		q.Set("code_challenge_method", "S256")
	}
	u.RawQuery = q.Encode()
	return u.String()
}

func (c *Config) Exchange(ctx context.Context, code, verifier string) (*Token, error) {
	if err := c.Validate(); err != nil {
		return nil, err
	}
	if code == "" {
		return nil, errors.New("oauth2: authorization code is required")
	}
	form := url.Values{
		"grant_type":   {"authorization_code"},
		"code":         {code},
		"redirect_uri": {c.RedirectURL},
	}
	if verifier != "" {
		form.Set("code_verifier", verifier)
	}
	return c.tokenRequest(ctx, form)
}

func (c *Config) Refresh(ctx context.Context, refreshToken string) (*Token, error) {
	if err := c.validateClient(); err != nil {
		return nil, err
	}
	if refreshToken == "" {
		return nil, errors.New("oauth2: refresh token is required")
	}
	return c.tokenRequest(ctx, url.Values{
		"grant_type":    {"refresh_token"},
		"refresh_token": {refreshToken},
	})
}

func (c *Config) UserInfo(ctx context.Context, token *Token, endpoint string, dest any) error {
	if token == nil || token.AccessToken == "" {
		return errors.New("oauth2: access token is required")
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)
	req.Header.Set("Accept", "application/json")
	resp, err := c.httpClient().Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
		return fmt.Errorf("oauth2: userinfo returned %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}
	return json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(dest)
}

func (c *Config) tokenRequest(ctx context.Context, form url.Values) (*Token, error) {
	switch c.AuthStyle {
	case AuthStyleBasic:
	default:
		form.Set("client_id", c.ClientID)
		if c.ClientSecret != "" {
			form.Set("client_secret", c.ClientSecret)
		}
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.Endpoint.TokenURL,
		strings.NewReader(form.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	if c.AuthStyle == AuthStyleBasic {
		req.SetBasicAuth(url.QueryEscape(c.ClientID), url.QueryEscape(c.ClientSecret))
	}

	resp, err := c.httpClient().Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return nil, err
	}
	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		return nil, parseError(resp.StatusCode, body)
	}

	var token Token
	if err := json.Unmarshal(body, &token); err != nil {
		return nil, fmt.Errorf("oauth2: decode token response: %w", err)
	}
	if token.AccessToken == "" {
		return nil, errors.New("oauth2: token response has no access_token")
	}
	_ = json.Unmarshal(body, &token.Raw)
	if token.ExpiresIn > 0 {
		token.ExpiresAt = time.Now().Add(time.Duration(token.ExpiresIn) * time.Second)
	}
	return &token, nil
}

func (c *Config) httpClient() *http.Client {
	if c.HTTPClient != nil {
		return c.HTTPClient
	}
	return &http.Client{Timeout: 10 * time.Second}
}

func (t *Token) Valid() bool {
	if t == nil || t.AccessToken == "" {
		return false
	}
	return t.ExpiresAt.IsZero() || time.Now().Before(t.ExpiresAt)
}

func NewState() (string, error) {
	return randomString(32)
}

func NewVerifier() (string, error) {
	return randomString(32)
}

func NewNonce() (string, error) {
	return randomString(32)
}

func ChallengeS256(verifier string) string {
	sum := sha256.Sum256([]byte(verifier))
	return base64.RawURLEncoding.EncodeToString(sum[:])
}

func ValidateState(expected, actual string) bool {
	if expected == "" || actual == "" {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(expected), []byte(actual)) == 1
}

func randomString(size int) (string, error) {
	b := make([]byte, size)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func parseError(status int, body []byte) error {
	var payload struct {
		Code        string `json:"error"`
		Description string `json:"error_description"`
		URI         string `json:"error_uri"`
	}
	_ = json.Unmarshal(body, &payload)
	return &Error{
		StatusCode:  status,
		Code:        payload.Code,
		Description: payload.Description,
		URI:         payload.URI,
		Body:        strings.TrimSpace(string(body)),
	}
}
