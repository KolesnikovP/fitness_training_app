-- +goose Up
CREATE TABLE IF NOT EXISTS session_exercises (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    sets        INT NOT NULL,
    reps        INT NOT NULL,
    weight_kg   NUMERIC(6,2),
    rpe         NUMERIC(3,1),
    notes       TEXT
);

CREATE INDEX IF NOT EXISTS idx_session_exercises_session_id ON session_exercises(session_id);

-- +goose Down
DROP INDEX IF EXISTS idx_session_exercises_session_id;
DROP TABLE IF EXISTS session_exercises;
