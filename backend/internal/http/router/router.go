package router

import (
	"log/slog"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/handlers"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
	"github.com/go-chi/chi/v5"
)

func NewRouter(userService *service.UserService, logger *slog.Logger) *chi.Mux {
	router := chi.NewRouter()
	router.Get("/health", handlers.HealthHandler) 
	
	registerUser := handlers.RegisterUser{UserService: userService}
	router.Post("/auth/register", registerUser.RegisterHandler)
	
	loginUser := handlers.LoginUser{UserService: userService, Logger: logger}
	router.Post("/auth/login", loginUser.LoginHandler)

	return router
}
