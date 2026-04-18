package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/middleware"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type AuthHandler struct {
	UserService *service.UserService
}

type refreshRequest struct {
	RefreshToken string `json:"refresh_token"`
	UserID       string `json:"user_id"`
}

type logoutRequest struct {
	RefreshToken string `json:"refresh_token"`
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req refreshRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body.")
		return
	}

	if req.RefreshToken == "" || req.UserID == "" {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "refresh_token and user_id are required.")
		return
	}

	pair, err := h.UserService.RefreshTokens(req.RefreshToken, req.UserID)
	if errors.Is(err, service.ErrInvalidCredentials) {
		writeError(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Refresh token is invalid or expired.")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Token refresh failed.")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"access_token":  pair.AccessToken,
		"refresh_token": pair.RefreshToken,
	})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.ClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated.")
		return
	}

	var req logoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body.")
		return
	}

	userID, _ := claims["sub"].(string)
	if err := h.UserService.Logout(req.RefreshToken, userID); err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Logout failed.")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
