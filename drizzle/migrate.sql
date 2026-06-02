-- Run this once to create tables in your Turso database
-- Either via: turso db shell <db-name> < drizzle/migrate.sql
-- Or paste into Turso dashboard shell

CREATE TABLE IF NOT EXISTS progress (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id      TEXT    NOT NULL UNIQUE,
  is_done     INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id      TEXT    NOT NULL UNIQUE,
  content     TEXT    NOT NULL DEFAULT '',
  updated_at  TEXT    NOT NULL
);
