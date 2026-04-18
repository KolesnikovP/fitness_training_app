package router

import (
	"database/sql"
	"log/slog"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/handlers"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/middleware"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
	"github.com/go-chi/chi/v5"
)

func NewRouter(
	db *sql.DB,
	userService *service.UserService,
	exerciseService *service.ExerciseService,
	workoutService *service.WorkoutService,
	logger *slog.Logger,
) *chi.Mux {
	r := chi.NewRouter()

	rateLimiter := middleware.NewRateLimiter()
	r.Use(rateLimiter.Middleware)

	authMiddleware := middleware.NewAuthMiddleware()

	healthH := &handlers.HealthHandler{DB: db}
	r.Get("/health", healthH.Health)

	registerH := &handlers.RegisterUser{UserService: userService}
	loginH := &handlers.LoginUser{UserService: userService, Logger: logger}
	authH := &handlers.AuthHandler{UserService: userService}

	r.Post("/api/v1/auth/register", registerH.RegisterHandler)
	r.Post("/api/v1/auth/login", loginH.LoginHandler)
	r.Post("/api/v1/auth/refresh", authH.Refresh)

	exerciseH := &handlers.ExerciseHandler{ExerciseService: exerciseService}
	workoutH := &handlers.WorkoutHandler{WorkoutService: workoutService}
	meH := &handlers.MeHandler{UserService: userService}

	r.Group(func(r chi.Router) {
		r.Use(authMiddleware.CheckJWTAuthMiddleware)

		r.Post("/api/v1/auth/logout", authH.Logout)
		r.Get("/api/v1/me", meH.Me)

		r.Get("/api/v1/exercises", exerciseH.List)
		r.Get("/api/v1/exercises/{id}", exerciseH.Get)

		r.Post("/api/v1/workouts", workoutH.Create)
		r.Get("/api/v1/workouts", workoutH.List)
		r.Get("/api/v1/workouts/{id}", workoutH.Get)
	})

	return r
}
