-- Backend-driven rubric criteria for subjectively-evaluated questions
-- (diagram, descriptive). The learner attempt panel renders these instead of
-- hardcoding categories in the frontend. Awarded points are filled in later by
-- manual/AI evaluation; they are never sent to the learner before evaluation.
CREATE TABLE IF NOT EXISTS public.question_rubric_criteria (
    rubric_criterion_id BIGSERIAL    PRIMARY KEY,
    question_id         BIGINT       NOT NULL REFERENCES public.questions(question_id) ON DELETE CASCADE,
    name                VARCHAR(150) NOT NULL,
    max_points          NUMERIC(5, 2) NOT NULL DEFAULT 1,
    display_order       INTEGER      NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_rubric_criteria_question
    ON public.question_rubric_criteria(question_id, display_order);
