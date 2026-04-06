package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type LoginForm struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type LoginUser struct {
	UserService *service.UserService
	Logger *slog.Logger
}

type LoginResponse struct { 
	Token string `json:"token"`
}


var ErrInvalidCredentials = errors.New("invalid credentials")

  func (h *LoginUser) LoginHandler(w http.ResponseWriter, r *http.Request) {
      var form LoginForm
      if err := json.NewDecoder(r.Body).Decode(&form); err != nil {
          http.Error(w, "invalid request body", http.StatusBadRequest)
          return
      }

      token, err := h.UserService.LoginUser(form.Email, form.Password)
      if errors.Is(err, ErrInvalidCredentials) {
          http.Error(w, "invalid credentials", http.StatusUnauthorized)
          return
      }
      if err != nil {
          h.Logger.Error("login failed", "error", err)
          http.Error(w, "internal server error", http.StatusInternalServerError)
          return
      }
			
			h.Logger.Info("Success!", "user_email", form.Email)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(LoginResponse{Token: token})
  }

