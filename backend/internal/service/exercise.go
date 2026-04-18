package service

import (
	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/repository"
)

type ExerciseService struct {
	repo repository.ExerciseRepository
}

func NewExerciseService(repo repository.ExerciseRepository) *ExerciseService {
	return &ExerciseService{repo: repo}
}

func (s *ExerciseService) ListExercises(category, muscleGroup string) ([]domain.Exercise, error) {
	return s.repo.FindAll(category, muscleGroup)
}

func (s *ExerciseService) GetExercise(id string) (*domain.Exercise, error) {
	return s.repo.FindByID(id)
}
