package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type LoginForm struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginUser struct {
	UserService *service.UserService
	Logger      *slog.Logger
}

type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func (h *LoginUser) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var form LoginForm
	if err := json.NewDecoder(r.Body).Decode(&form); err != nil {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body.")
		return
	}

	pair, err := h.UserService.LoginUser(form.Email, form.Password)
	if errors.Is(err, service.ErrInvalidCredentials) {
		writeError(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Email or password is incorrect.")
		return
	}
	if err != nil {
		h.Logger.Error("login failed", "error", err)
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Login failed.")
		return
	}

	h.Logger.Info("user logged in", "email", form.Email)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{
		AccessToken:  pair.AccessToken,
		RefreshToken: pair.RefreshToken,
	})
}
