package postgres

import (
	"database/sql"
	"fmt"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/google/uuid"
)

type WorkoutRepository struct {
	db *sql.DB
}

func NewWorkoutRepository(db *sql.DB) *WorkoutRepository {
	return &WorkoutRepository{db: db}
}

func (r *WorkoutRepository) Create(session domain.WorkoutSession) (*domain.WorkoutSession, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// Set RLS session variable
	if _, err := tx.Exec(fmt.Sprintf("SET LOCAL app.current_user_id = '%s'", session.UserID.String())); err != nil {
		return nil, err
	}

	var created domain.WorkoutSession
	row := tx.QueryRow(
		`INSERT INTO workout_sessions (user_id, notes) VALUES ($1, $2) RETURNING id, user_id, logged_at, notes`,
		session.UserID, session.Notes,
	)
	if err := row.Scan(&created.ID, &created.UserID, &created.LoggedAt, &created.Notes); err != nil {
		return nil, err
	}

	for _, ex := range session.Exercises {
		var se domain.SessionExercise
		row := tx.QueryRow(
			`INSERT INTO session_exercises (session_id, exercise_id, sets, reps, weight_kg, rpe, notes)
			 VALUES ($1, $2, $3, $4, $5, $6, $7)
			 RETURNING id, session_id, exercise_id, sets, reps, weight_kg, rpe, notes`,
			created.ID, ex.ExerciseID, ex.Sets, ex.Reps, ex.WeightKg, ex.RPE, ex.Notes,
		)
		if err := row.Scan(&se.ID, &se.SessionID, &se.ExerciseID, &se.Sets, &se.Reps, &se.WeightKg, &se.RPE, &se.Notes); err != nil {
			return nil, err
		}
		created.Exercises = append(created.Exercises, se)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &created, nil
}

func (r *WorkoutRepository) FindByUserID(userID string) ([]domain.WorkoutSession, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, err
	}

	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	if _, err := tx.Exec(fmt.Sprintf("SET LOCAL app.current_user_id = '%s'", uid.String())); err != nil {
		return nil, err
	}

	rows, err := tx.Query(
		`SELECT id, user_id, logged_at, notes FROM workout_sessions WHERE user_id = $1 ORDER BY logged_at DESC`,
		uid,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []domain.WorkoutSession
	for rows.Next() {
		var s domain.WorkoutSession
		if err := rows.Scan(&s.ID, &s.UserID, &s.LoggedAt, &s.Notes); err != nil {
			return nil, err
		}
		sessions = append(sessions, s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	for i, s := range sessions {
		exercises, err := r.fetchExercisesForSession(tx, s.ID.String())
		if err != nil {
			return nil, err
		}
		sessions[i].Exercises = exercises
	}

	tx.Commit()
	return sessions, nil
}

func (r *WorkoutRepository) FindByID(id, userID string) (*domain.WorkoutSession, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	if _, err := tx.Exec(fmt.Sprintf("SET LOCAL app.current_user_id = '%s'", userID)); err != nil {
		return nil, err
	}

	var s domain.WorkoutSession
	row := tx.QueryRow(
		`SELECT id, user_id, logged_at, notes FROM workout_sessions WHERE id = $1 AND user_id = $2`,
		id, userID,
	)
	if err := row.Scan(&s.ID, &s.UserID, &s.LoggedAt, &s.Notes); err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	exercises, err := r.fetchExercisesForSession(tx, s.ID.String())
	if err != nil {
		return nil, err
	}
	s.Exercises = exercises

	tx.Commit()
	return &s, nil
}

func (r *WorkoutRepository) fetchExercisesForSession(tx *sql.Tx, sessionID string) ([]domain.SessionExercise, error) {
	rows, err := tx.Query(
		`SELECT id, session_id, exercise_id, sets, reps, weight_kg, rpe, notes FROM session_exercises WHERE session_id = $1`,
		sessionID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var exercises []domain.SessionExercise
	for rows.Next() {
		var se domain.SessionExercise
		if err := rows.Scan(&se.ID, &se.SessionID, &se.ExerciseID, &se.Sets, &se.Reps, &se.WeightKg, &se.RPE, &se.Notes); err != nil {
			return nil, err
		}
		exercises = append(exercises, se)
	}
	return exercises, rows.Err()
}
