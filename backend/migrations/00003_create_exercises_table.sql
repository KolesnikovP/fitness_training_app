-- +goose Up
CREATE TABLE IF NOT EXISTS exercises (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,
    category     TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    equipment    TEXT,
    description  TEXT
);

-- +goose Down
DROP TABLE IF EXISTS exercises;
