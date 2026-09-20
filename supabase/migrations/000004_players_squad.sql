-- Ekhaya App: Senior Team squad numbers.
-- The Senior Team squad list adds a jersey number to each player.
-- Players without an assigned number stay NULL (no invented data).

ALTER TABLE players ADD COLUMN number INTEGER;