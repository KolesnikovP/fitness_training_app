package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type RegisterForm struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type RegisterUser struct {
	UserService *service.UserService
}


func (h *RegisterUser) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var form RegisterForm	
	err := json.NewDecoder(r.Body).Decode(&form)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	user, err := h.UserService.RegisterUser(form.Email, form.Password)

  if err != nil {
      if err.Error() == "email already exists" {
          http.Error(w, "email already exists", http.StatusConflict)
      } else {
          http.Error(w, "internal server error", http.StatusInternalServerError)
      }
      return
  }


	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)

}
