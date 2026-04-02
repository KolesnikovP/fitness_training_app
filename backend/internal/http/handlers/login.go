
package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type LoginForm struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type LoginUser struct {
	UserService *service.UserService
}


func (h *LoginUser) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var form LoginForm	
	err := json.NewDecoder(r.Body).Decode(&form)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	user, err := h.UserService.LoginUser(form.Email, form.Password)

  if err != nil {
      if err.Error() == "invalid credentials" {
          http.Error(w, "invalid credentials", http.StatusUnauthorized)
			} else {
          http.Error(w, "internal server error", http.StatusInternalServerError)
      }
      return
  }

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)

}
