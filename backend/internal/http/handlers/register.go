package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type RegisterForm struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type RegisterUser struct {
	UserService *service.UserService
}

func (h *RegisterUser) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var form RegisterForm
	if err := json.NewDecoder(r.Body).Decode(&form); err != nil {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body.")
		return
	}

	if form.Email == "" || form.Password == "" {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Email and password are required.")
		return
	}

	role := form.Role
	if role == "" {
		role = "athlete"
	}
	if role != "athlete" && role != "advisor" {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Role must be 'athlete' or 'advisor'.")
		return
	}

	user, err := h.UserService.RegisterUser(form.Email, form.Password, role)
	if errors.Is(err, service.ErrEmailExists) {
		writeError(w, http.StatusConflict, "EMAIL_EXISTS", "An account with this email already exists.")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Registration failed.")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"id": user.ID.String()})
}
