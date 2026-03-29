package postgres

import (
	"context"
	"database/sql"
	"log"
	"os"
	"testing"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/joho/godotenv"
)

func TestCreateUser(t *testing.T) {
	if err := godotenv.Load("../../../.env"); err != nil {
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

	mockedUser := domain.User{
		Email: "test2@example.com",
		PasswordHash: "password1234",
	}

	userRepository := NewUserRepository(db)
	createdUser, err := userRepository.Create(mockedUser)
	if err != nil {
		t.Fatal("Create failed: ", err)
	}

	log.Println("created user: ", createdUser)
}
