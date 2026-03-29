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
	query := `
	INSERT INTO users (email, password_hash)
	VALUES ($1, $2)
	RETURNING *;
	`
	row := r.db.QueryRow(query, user.Email, user.PasswordHash)

	err := row.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) FindByEmail(email string) (*domain.User, error){
	var user domain.User
	query:=`SELECT * FROM users WHERE email = $1`

	row := r.db.QueryRow(query, email)
	err := row.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)


	if err != nil {
		return nil, err
	}

	return &user, nil
} 
