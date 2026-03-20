# Commands Used and What They Do

  - `tree -L 3`
    Show project structure up to 3 levels to verify
  key files and folders.

  - `docker compose up -d`
    Start services from `docker-compose.yml` in
  background mode.

  - `docker compose ps`
    Show running compose services, their status, and
  exposed ports.

  - `docker compose logs postgres --tail=30`
    Show latest PostgreSQL logs for debugging
  startup/auth issues.

  - `docker exec -it fitness-postgres psql -U
  "$POSTGRES_USER" -d "$POSTGRES_DB"`
    Open `psql` in container using shell env vars
  (failed when vars were empty).

  - `docker exec -it fitness-postgres psql -U
  fitness_user -d fitness_db`
    Open `psql` with explicit user/database to verify
  access.

  - `docker compose down -v`
    Stop services and remove volumes (used to fully
  reinitialize Postgres).
    Warning: this deletes local DB data in that
  volume.

  - `docker compose stop postgres`
    Stop only the PostgreSQL service (used to test
  app fail-fast behavior).

  - `docker compose up -d postgres`
    Start only the PostgreSQL service again.

  - `set -a`
    Turn on auto-export so variables from `.env`
  become environment variables.

  - `source .env`
    Load variables from `.env` into current shell.

  - `set +a`
    Turn off auto-export mode.

  - `go install github.com/pressly/goose/v3/cmd/goose@latest`
    Install Goose CLI binary.

  - `goose -version`
    Verify Goose is installed and available in PATH.

  - `mkdir -p migrations`
    Create migrations directory if it doesn't exist.

  - `goose -dir migrations -s create create_users_table sql`
    Create a new sequential SQL migration file
  template (`Up`/`Down` sections).

  - `goose -dir migrations postgres "$DATABASE_URL" up`
    Apply pending migrations to the database.

  - `goose -dir migrations postgres "$DATABASE_URL" down`
    Roll back the most recent applied migration.

  - `goose -dir migrations postgres "$DATABASE_URL" status`
    Show migration state (applied vs pending).

  - ## 🧾 Commands

```bash
# Turn on auto-export → every variable becomes an environment variable
set -a
# Load variables from file into current shell
source .env
# Turn off auto-export (back to normal)
set +a
# example of usage:
goose -dir migrations postgres "$DATABASE_URL" up
goose -dir migrations postgres "$DATABASE_URL" down
```
