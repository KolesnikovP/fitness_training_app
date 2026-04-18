package main

import (
	"context"
	"database/sql"
	"log"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/router"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/repository/postgres"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("warning: .env file not loaded, relying on environment variables")
	}

	dbURL := requireEnv("DATABASE_URL")
	requireEnv("JWT_KEY")

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatal("error opening database: ", err)
	}
	defer db.Close()

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Fatal("database ping failed: ", err)
	}

	userRepo := postgres.NewUserRepository(db)
	tokenRepo := postgres.NewTokenRepository(db)
	exerciseRepo := postgres.NewExerciseRepository(db)
	workoutRepo := postgres.NewWorkoutRepository(db)

	userService := service.NewUserService(userRepo, tokenRepo)
	exerciseService := service.NewExerciseService(exerciseRepo)
	workoutService := service.NewWorkoutService(workoutRepo)

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	port := os.Getenv("API_PORT")
	if port == "" {
		port = "4100"
	}

	logger.Info("starting server", "port", port)
	if err := http.ListenAndServe(":"+port, router.NewRouter(db, userService, exerciseService, workoutService, logger)); err != nil {
		log.Fatal("HTTP server failed: ", err)
	}
}

func requireEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("required environment variable %q is not set", key)
	}
	return val
}
