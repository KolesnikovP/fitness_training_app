package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/domain"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/middleware"
	"github.com/KolesnikovP/fitness_training_app/backend/internal/service"
)

type WorkoutHandler struct {
	WorkoutService *service.WorkoutService
}

type sessionExerciseInput struct {
	ExerciseID string   `json:"exercise_id"`
	Sets       int      `json:"sets"`
	Reps       int      `json:"reps"`
	WeightKg   *float64 `json:"weight_kg"`
	RPE        *float64 `json:"rpe"`
	Notes      *string  `json:"notes"`
}

type createWorkoutRequest struct {
	Notes     *string                `json:"notes"`
	Exercises []sessionExerciseInput `json:"exercises"`
}

func (h *WorkoutHandler) Create(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.ClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated.")
		return
	}

	userIDStr, _ := claims["sub"].(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid user ID in token.")
		return
	}

	var req createWorkoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body.")
		return
	}

	session := domain.WorkoutSession{
		UserID: userID,
		Notes:  req.Notes,
	}

	for _, ex := range req.Exercises {
		exID, err := uuid.Parse(ex.ExerciseID)
		if err != nil {
			writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid exercise_id.")
			return
		}
		session.Exercises = append(session.Exercises, domain.SessionExercise{
			ExerciseID: exID,
			Sets:       ex.Sets,
			Reps:       ex.Reps,
			WeightKg:   ex.WeightKg,
			RPE:        ex.RPE,
			Notes:      ex.Notes,
		})
	}

	created, err := h.WorkoutService.CreateWorkout(session)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to create workout.")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func (h *WorkoutHandler) List(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.ClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated.")
		return
	}

	userID, _ := claims["sub"].(string)
	sessions, err := h.WorkoutService.ListWorkouts(userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch workouts.")
		return
	}

	if sessions == nil {
		sessions = []domain.WorkoutSession{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sessions)
}

func (h *WorkoutHandler) Get(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.ClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated.")
		return
	}

	userID, _ := claims["sub"].(string)
	id := chi.URLParam(r, "id")

	session, err := h.WorkoutService.GetWorkout(id, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch workout.")
		return
	}
	if session == nil {
		writeError(w, http.StatusNotFound, "NOT_FOUND", "Workout not found.")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(session)
}
