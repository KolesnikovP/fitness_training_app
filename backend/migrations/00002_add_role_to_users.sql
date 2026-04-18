-- +goose Up
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'advisor'));

-- +goose Down
ALTER TABLE users DROP COLUMN IF EXISTS role;
