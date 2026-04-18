package repository

import "github.com/KolesnikovP/fitness_training_app/backend/internal/domain"

type WorkoutRepository interface {
	Create(session domain.WorkoutSession) (*domain.WorkoutSession, error)
	FindByUserID(userID string) ([]domain.WorkoutSession, error)
	FindByID(id, userID string) (*domain.WorkoutSession, error)
}
