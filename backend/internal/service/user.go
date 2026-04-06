package service

import (
	"errors"
	"os"
	"time"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/repository"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)
type UserService struct {
	userRepository repository.UserRepository
}


func NewUserService(userRepository repository.UserRepository) *UserService {
	
	return &UserService{userRepository: userRepository} 
}

func (r *UserService) RegisterUser(email string, password string) (*domain.User, error) {
	responseFromDB, err := r.userRepository.FindByEmail(email)

	if err != nil {
		return nil, err
	}

	if responseFromDB != nil {
		return nil, errors.New("email already exists")
	}

	var registeredUser domain.User

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return nil, err
	}

	registeredUser.PasswordHash = string(passwordHash)
	registeredUser.Email = email

	return r.userRepository.Create(registeredUser)
} 


func (r *UserService) LoginUser(email string, password string) (string, error) {
	responseFromDB, err := r.userRepository.FindByEmail(email)

	if err != nil {
		return "", err
	}

	if responseFromDB == nil {
		return "", errors.New("invalid credentials")
	}

	result := bcrypt.CompareHashAndPassword([]byte(responseFromDB.PasswordHash), []byte(password))

	if result != nil {
		return "", errors.New("wrong password")
	}

	jwt_key := os.Getenv("JWT_KEY")

	claims := jwt.MapClaims{
		"user_id": responseFromDB.ID,
		"email": responseFromDB.Email,
		"exp": time.Now().Add(15 * time.Minute).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedString, err := token.SignedString([]byte(jwt_key))

	if err != nil {
		return "", err
	}

	return signedString, nil
}
