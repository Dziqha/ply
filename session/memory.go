package session

import (
	"sync"
	"time"
)

type memoryEntry struct {
	values  map[string]any
	expires time.Time
}

type MemoryStore struct {
	mu        sync.Mutex
	values    map[string]memoryEntry
	lastClean time.Time
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		values:    make(map[string]memoryEntry),
		lastClean: time.Now(),
	}
}

func (s *MemoryStore) Load(id string) (map[string]any, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	entry, ok := s.values[id]
	if !ok {
		return nil, ErrNotFound
	}
	if !entry.expires.IsZero() && time.Now().After(entry.expires) {
		delete(s.values, id)
		return nil, ErrNotFound
	}
	return copyValues(entry.values), nil
}

func (s *MemoryStore) Save(id string, values map[string]any, ttl time.Duration) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now()
	s.cleanup(now)

	var expires time.Time
	if ttl > 0 {
		expires = now.Add(ttl)
	}
	s.values[id] = memoryEntry{
		values:  copyValues(values),
		expires: expires,
	}
	return nil
}

func (s *MemoryStore) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.values, id)
	return nil
}

func (s *MemoryStore) cleanup(now time.Time) {
	if now.Sub(s.lastClean) < time.Minute {
		return
	}
	for id, entry := range s.values {
		if !entry.expires.IsZero() && now.After(entry.expires) {
			delete(s.values, id)
		}
	}
	s.lastClean = now
}

func copyValues(values map[string]any) map[string]any {
	out := make(map[string]any, len(values))
	for key, value := range values {
		out[key] = value
	}
	return out
}
