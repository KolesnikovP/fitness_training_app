package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type ExerciseHandler struct {
	ExerciseService *service.ExerciseService
}

func (h *ExerciseHandler) List(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	muscleGroup := r.URL.Query().Get("muscle_group")

	exercises, err := h.ExerciseService.ListExercises(category, muscleGroup)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch exercises.")
		return
	}

	if exercises == nil {
		exercises = []domain.Exercise{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(exercises)
}

func (h *ExerciseHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	exercise, err := h.ExerciseService.GetExercise(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch exercise.")
		return
	}
	if exercise == nil {
		writeError(w, http.StatusNotFound, "NOT_FOUND", "Exercise not found.")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(exercise)
}
