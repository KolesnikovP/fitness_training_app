-- +goose Up
CREATE TABLE IF NOT EXISTS maintenance_log (
    id           SERIAL PRIMARY KEY,
    job_name     TEXT NOT NULL,
    ran_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rows_deleted INT
);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY workout_sessions_user_policy ON workout_sessions
    USING (user_id = current_setting('app.current_user_id', true)::UUID);

ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY session_exercises_user_policy ON session_exercises
    USING (session_id IN (
        SELECT id FROM workout_sessions
        WHERE user_id = current_setting('app.current_user_id', true)::UUID
    ));

-- +goose Down
DROP POLICY IF EXISTS session_exercises_user_policy ON session_exercises;
ALTER TABLE session_exercises DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS workout_sessions_user_policy ON workout_sessions;
ALTER TABLE workout_sessions DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS maintenance_log;
