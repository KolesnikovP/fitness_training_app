package repository

import "github.com/KolesnikovP/fitness_training_app/backend/internal/domain"

type TokenRepository interface {
	Create(token domain.RefreshToken) (*domain.RefreshToken, error)
	FindActiveByUserID(userID string) ([]domain.RefreshToken, error)
	Revoke(id string) error
	DeleteExpiredAndRevoked() (int64, error)
}
