package service

import (
	"errors"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/repository"
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


func (r *UserService) LoginUser(email string, password string) (*domain.User, error) {
	responseFromDB, err := r.userRepository.FindByEmail(email)

	if err != nil {
		return nil, err
	}

	if responseFromDB == nil {
		return nil, errors.New("invalid credentials")
	}

	result := bcrypt.CompareHashAndPassword([]byte(responseFromDB.PasswordHash), []byte(password))

	if result != nil {
		return nil, errors.New("wrong password")
	}

	
	return responseFromDB, nil
}
