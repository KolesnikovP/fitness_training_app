package repository

import "github.com/KolesnikovP/fitness_training_app/backend/internal/domain"

type UserRepository interface {
	FindByEmail(email string) (*domain.User, error)
	Create(user domain.User) (*domain.User, error)
}
