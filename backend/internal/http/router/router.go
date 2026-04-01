package router

import (
	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/handlers"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
	"github.com/go-chi/chi/v5"
)

func NewRouter(userService *service.UserService) *chi.Mux {
	router := chi.NewRouter()
	router.Get("/health", handlers.HealthHandler) 
	
	registerUser := handlers.RegisterUser{UserService: userService}
	router.Post("/auth/register", registerUser.RegisterHandler)

	return router
}
