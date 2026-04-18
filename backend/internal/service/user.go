package service

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"os"
	"time"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrEmailExists       = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type TokenPair struct {
	AccessToken  string
	RefreshToken string
}

type UserService struct {
	userRepository  repository.UserRepository
	tokenRepository repository.TokenRepository
}

func NewUserService(userRepository repository.UserRepository, tokenRepository repository.TokenRepository) *UserService {
	return &UserService{
		userRepository:  userRepository,
		tokenRepository: tokenRepository,
	}
}

func (s *UserService) RegisterUser(email, password, role string) (*domain.User, error) {
	existing, err := s.userRepository.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, ErrEmailExists
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return nil, err
	}

	return s.userRepository.Create(domain.User{
		Email:        email,
		PasswordHash: string(hash),
		Role:         role,
	})
}

func (s *UserService) LoginUser(email, password string) (*TokenPair, error) {
	user, err := s.userRepository.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	accessToken, err := s.issueAccessToken(user)
	if err != nil {
		return nil, err
	}

	rawRefresh, err := generateRandomToken()
	if err != nil {
		return nil, err
	}

	refreshHash, err := bcrypt.GenerateFromPassword([]byte(rawRefresh), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	_, err = s.tokenRepository.Create(domain.RefreshToken{
		UserID:    user.ID,
		TokenHash: string(refreshHash),
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	if err != nil {
		return nil, err
	}

	return &TokenPair{AccessToken: accessToken, RefreshToken: rawRefresh}, nil
}

func (s *UserService) RefreshTokens(rawRefreshToken string, userID string) (*TokenPair, error) {
	tokens, err := s.tokenRepository.FindActiveByUserID(userID)
	if err != nil {
		return nil, err
	}

	var matched *domain.RefreshToken
	for _, t := range tokens {
		if bcrypt.CompareHashAndPassword([]byte(t.TokenHash), []byte(rawRefreshToken)) == nil {
			matched = &t
			break
		}
	}
	if matched == nil {
		return nil, ErrInvalidCredentials
	}

	if err := s.tokenRepository.Revoke(matched.ID.String()); err != nil {
		return nil, err
	}

	user, err := s.userRepository.FindByID(userID)
	if err != nil || user == nil {
		return nil, ErrInvalidCredentials
	}

	accessToken, err := s.issueAccessToken(user)
	if err != nil {
		return nil, err
	}

	rawRefresh, err := generateRandomToken()
	if err != nil {
		return nil, err
	}

	refreshHash, err := bcrypt.GenerateFromPassword([]byte(rawRefresh), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	_, err = s.tokenRepository.Create(domain.RefreshToken{
		UserID:    user.ID,
		TokenHash: string(refreshHash),
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	if err != nil {
		return nil, err
	}

	return &TokenPair{AccessToken: accessToken, RefreshToken: rawRefresh}, nil
}

func (s *UserService) Logout(rawRefreshToken, userID string) error {
	tokens, err := s.tokenRepository.FindActiveByUserID(userID)
	if err != nil {
		return err
	}
	for _, t := range tokens {
		if bcrypt.CompareHashAndPassword([]byte(t.TokenHash), []byte(rawRefreshToken)) == nil {
			return s.tokenRepository.Revoke(t.ID.String())
		}
	}
	return nil
}

func (s *UserService) GetUserByID(id string) (*domain.User, error) {
	return s.userRepository.FindByID(id)
}

func (s *UserService) issueAccessToken(user *domain.User) (string, error) {
	jwtKey := os.Getenv("JWT_KEY")
	claims := jwt.MapClaims{
		"sub":   user.ID.String(),
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().Add(15 * time.Minute).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtKey))
}

func generateRandomToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
