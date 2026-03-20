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

