-- +goose Up
CREATE TABLE IF NOT EXISTS workout_sessions (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes     TEXT
);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);

-- +goose Down
DROP INDEX IF EXISTS idx_workout_sessions_user_id;
DROP TABLE IF EXISTS workout_sessions;
