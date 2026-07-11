-- Per-assessment points: the same question can be worth different points in
-- different assessments, so points live on the exam-question relationship.
-- NULL means "use the question's own total_points" when scoring.
ALTER TABLE public.exam_questions
    ADD COLUMN IF NOT EXISTS points NUMERIC(5, 2);
