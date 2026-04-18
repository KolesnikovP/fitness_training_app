package domain

import (
	"time"

	"github.com/google/uuid"
)

type WorkoutSession struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	LoggedAt  time.Time
	Notes     *string
	Exercises []SessionExercise
}

type SessionExercise struct {
	ID         uuid.UUID
	SessionID  uuid.UUID
	ExerciseID uuid.UUID
	Sets       int
	Reps       int
	WeightKg   *float64
	RPE        *float64
	Notes      *string
}
