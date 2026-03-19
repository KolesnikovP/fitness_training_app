package main

import (
	"context"
	"database/sql"
	"log"
	"os"
	"time"

	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/router"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("warning: .env file not loaded, relying on environment variables")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatal("Error opening database: ", err)
	}

	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		log.Fatal("Database ping failed:", err)
	}

	if err := http.ListenAndServe("localhost:4100", router.NewRouter()); err != nil {
		log.Fatal("HTTP server failed:", err)
	}
}
