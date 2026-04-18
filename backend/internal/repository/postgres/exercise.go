package postgres

import (
	"database/sql"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
)

type ExerciseRepository struct {
	db *sql.DB
}

func NewExerciseRepository(db *sql.DB) *ExerciseRepository {
	return &ExerciseRepository{db: db}
}

func (r *ExerciseRepository) FindAll(category, muscleGroup string) ([]domain.Exercise, error) {
	query := `
		SELECT id, name, category, muscle_group, equipment, description
		FROM exercises
		WHERE ($1 = '' OR category = $1)
		  AND ($2 = '' OR muscle_group = $2)
		ORDER BY category, name
	`
	rows, err := r.db.Query(query, category, muscleGroup)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var exercises []domain.Exercise
	for rows.Next() {
		var e domain.Exercise
		if err := rows.Scan(&e.ID, &e.Name, &e.Category, &e.MuscleGroup, &e.Equipment, &e.Description); err != nil {
			return nil, err
		}
		exercises = append(exercises, e)
	}
	return exercises, rows.Err()
}

func (r *ExerciseRepository) FindByID(id string) (*domain.Exercise, error) {
	var e domain.Exercise
	query := `SELECT id, name, category, muscle_group, equipment, description FROM exercises WHERE id = $1`
	row := r.db.QueryRow(query, id)
	err := row.Scan(&e.ID, &e.Name, &e.Category, &e.MuscleGroup, &e.Equipment, &e.Description)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &e, nil
}
