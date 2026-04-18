package middleware

import (
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"
)

const (
	bucketCapacity = 60
	refillRate     = time.Second
)

type rateBucket struct {
	tokens   int
	lastSeen time.Time
	mu       sync.Mutex
}

type RateLimiter struct {
	buckets sync.Map
}

func NewRateLimiter() *RateLimiter {
	rl := &RateLimiter{}
	go rl.cleanup()
	return rl
}

func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := clientIP(r)
		bucket := rl.getBucket(ip)

		bucket.mu.Lock()
		now := time.Now()
		elapsed := now.Sub(bucket.lastSeen)
		refill := int(elapsed / refillRate)
		if refill > 0 {
			bucket.tokens += refill
			if bucket.tokens > bucketCapacity {
				bucket.tokens = bucketCapacity
			}
			bucket.lastSeen = now
		}

		if bucket.tokens <= 0 {
			bucket.mu.Unlock()
			retryAfter := int(refillRate.Seconds())
			w.Header().Set("Retry-After", strconv.Itoa(retryAfter))
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			w.Write([]byte(`{"error":{"code":"RATE_LIMITED","message":"Too many requests. Please try again later."}}`))
			return
		}

		bucket.tokens--
		bucket.mu.Unlock()

		next.ServeHTTP(w, r)
	})
}

func (rl *RateLimiter) getBucket(ip string) *rateBucket {
	val, _ := rl.buckets.LoadOrStore(ip, &rateBucket{
		tokens:   bucketCapacity,
		lastSeen: time.Now(),
	})
	return val.(*rateBucket)
}

func (rl *RateLimiter) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()
	for range ticker.C {
		rl.buckets.Range(func(key, val interface{}) bool {
			b := val.(*rateBucket)
			b.mu.Lock()
			idle := time.Since(b.lastSeen) > 10*time.Minute
			b.mu.Unlock()
			if idle {
				rl.buckets.Delete(key)
			}
			return true
		})
	}
}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		if ip, _, err := net.SplitHostPort(xff); err == nil {
			return ip
		}
		return xff
	}
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}
