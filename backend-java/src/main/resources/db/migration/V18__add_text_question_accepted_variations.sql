-- Optional accepted answer variations for exact-match short-answer questions,
-- e.g. correctAnswer "SQL" with variations "Structured Query Language".
-- Stored newline-separated; each line is an alternative that scores as correct.
ALTER TABLE text_question_configs
    ADD COLUMN IF NOT EXISTS accepted_variations TEXT;
