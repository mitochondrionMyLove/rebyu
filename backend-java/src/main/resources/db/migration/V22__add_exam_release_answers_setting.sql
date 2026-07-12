-- Per-assessment admin toggle: whether correct answers/explanations are
-- shown to learners in their attempt review/history. Nullable (like
-- `status`) so ddl-auto=update can migrate the existing non-empty table;
-- a null value is treated as true (current behavior) in code.
ALTER TABLE public.exams
    ADD COLUMN IF NOT EXISTS release_answers_after_submit BOOLEAN;
