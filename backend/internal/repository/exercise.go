package repository

import "github.com/KolesnikovP/fitness_training_app/backend/internal/domain"

type ExerciseRepository interface {
	FindAll(category, muscleGroup string) ([]domain.Exercise, error)
	FindByID(id string) (*domain.Exercise, error)
}
