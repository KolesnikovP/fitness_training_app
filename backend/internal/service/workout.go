package service

import (
	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/repository"
)

type WorkoutService struct {
	repo repository.WorkoutRepository
}

func NewWorkoutService(repo repository.WorkoutRepository) *WorkoutService {
	return &WorkoutService{repo: repo}
}

func (s *WorkoutService) CreateWorkout(session domain.WorkoutSession) (*domain.WorkoutSession, error) {
	return s.repo.Create(session)
}

func (s *WorkoutService) ListWorkouts(userID string) ([]domain.WorkoutSession, error) {
	return s.repo.FindByUserID(userID)
}

func (s *WorkoutService) GetWorkout(id, userID string) (*domain.WorkoutSession, error) {
	return s.repo.FindByID(id, userID)
}
