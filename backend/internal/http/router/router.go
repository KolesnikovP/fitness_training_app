package router

import (

	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/handlers"
	"github.com/go-chi/chi/v5"
)

func NewRouter() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/health", handlers.HealthHandler) 

	return router
}
