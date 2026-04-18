package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const claimsKey contextKey = "claims"

type AuthMiddleware struct {
	JWTKey string
}

func NewAuthMiddleware() *AuthMiddleware {
	return &AuthMiddleware{JWTKey: os.Getenv("JWT_KEY")}
}

func (m *AuthMiddleware) CheckJWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			writeUnauthorized(w, "TOKEN_MISSING", "Authorization header is required.")
			return
		}

		rawToken := strings.TrimPrefix(authHeader, "Bearer ")
		if rawToken == authHeader {
			writeUnauthorized(w, "TOKEN_MISSING", "Bearer token is required.")
			return
		}

		claims := jwt.MapClaims{}
		parsedToken, err := jwt.ParseWithClaims(rawToken, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(m.JWTKey), nil
		})
		if err != nil || !parsedToken.Valid {
			writeUnauthorized(w, "TOKEN_INVALID", "Token is invalid or expired.")
			return
		}

		ctx := context.WithValue(r.Context(), claimsKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func ClaimsFromContext(ctx context.Context) (jwt.MapClaims, bool) {
	claims, ok := ctx.Value(claimsKey).(jwt.MapClaims)
	return claims, ok
}

func writeUnauthorized(w http.ResponseWriter, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	w.Write([]byte(`{"error":{"code":"` + code + `","message":"` + message + `"}}`))
}
