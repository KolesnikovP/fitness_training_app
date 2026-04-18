package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/middleware"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type MeHandler struct {
	UserService *service.UserService
}

func (h *MeHandler) Me(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.ClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated.")
		return
	}

	userID, _ := claims["sub"].(string)
	user, err := h.UserService.GetUserByID(userID)
	if err != nil || user == nil {
		writeError(w, http.StatusNotFound, "NOT_FOUND", "User not found.")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"id":    user.ID.String(),
		"email": user.Email,
		"role":  user.Role,
	})
}
