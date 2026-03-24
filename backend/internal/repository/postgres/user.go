package postgres

import (
	"database/sql"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user domain.User) (*domain.User, error) {
	return nil, nil
}

func (r *UserRepository) FindByEmail(email string) (*domain.User, error){
	return nil, nil
} 
