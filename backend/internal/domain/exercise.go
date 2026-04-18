package domain

import "github.com/google/uuid"

type Exercise struct {
	ID          uuid.UUID
	Name        string
	Category    string
	MuscleGroup string
	Equipment   *string
	Description *string
}
