package postgres

import (
	"database/sql"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
)

type TokenRepository struct {
	db *sql.DB
}

func NewTokenRepository(db *sql.DB) *TokenRepository {
	return &TokenRepository{db: db}
}

func (r *TokenRepository) Create(token domain.RefreshToken) (*domain.RefreshToken, error) {
	query := `
		INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)
		RETURNING id, user_id, token_hash, expires_at, revoked, created_at
	`
	row := r.db.QueryRow(query, token.UserID, token.TokenHash, token.ExpiresAt)
	err := row.Scan(&token.ID, &token.UserID, &token.TokenHash, &token.ExpiresAt, &token.Revoked, &token.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (r *TokenRepository) FindActiveByUserID(userID string) ([]domain.RefreshToken, error) {
	query := `
		SELECT id, user_id, token_hash, expires_at, revoked, created_at
		FROM refresh_tokens
		WHERE user_id = $1 AND revoked = FALSE AND expires_at > NOW()
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tokens []domain.RefreshToken
	for rows.Next() {
		var t domain.RefreshToken
		if err := rows.Scan(&t.ID, &t.UserID, &t.TokenHash, &t.ExpiresAt, &t.Revoked, &t.CreatedAt); err != nil {
			return nil, err
		}
		tokens = append(tokens, t)
	}
	return tokens, rows.Err()
}

func (r *TokenRepository) Revoke(id string) error {
	_, err := r.db.Exec(`UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1`, id)
	return err
}

func (r *TokenRepository) DeleteExpiredAndRevoked() (int64, error) {
	result, err := r.db.Exec(`DELETE FROM refresh_tokens WHERE expires_at < NOW() OR revoked = TRUE`)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}
