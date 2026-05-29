-- ============================================================
-- WINDY CUP 2026 — Supabase Setup
-- Run this entire script in: Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id         BIGSERIAL PRIMARY KEY,
  match_id   TEXT    NOT NULL,
  hole       INTEGER NOT NULL,   -- 0-indexed hole number
  team       TEXT    NOT NULL CHECK (team IN ('j', 'o')),
  score      INTEGER,            -- NULL = not entered yet
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (match_id, hole, team)  -- one row per match/hole/team
);

-- 2. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_scores_match ON scores(match_id);

-- 3. Row Level Security — open read/write (fine for a one-day event)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read"   ON scores FOR SELECT USING (true);
CREATE POLICY "Public insert" ON scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON scores FOR UPDATE USING (true);

-- 4. Enable real-time (scores update instantly on all phones)
ALTER PUBLICATION supabase_realtime ADD TABLE scores;

-- ✅ Done! Your database is ready.
-- Now go back to the deployment guide (DEPLOY.txt) for next steps.
