-- AI grading feedback for descriptive / critical-thinking answers. Populated
-- only by AiAnswerGradingService alongside earned_points; never learner-writable.
ALTER TABLE public.assessment_attempt_answers
    ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Per-sub-question AI score breakdown for critical-thinking answers, stored
-- as a JSON array [{"subQuestionId":1,"questionText":"...","learnerAnswer":"...",
-- "earnedPoints":3.5,"maxPoints":5,"feedback":"..."}]. Null for question types
-- that are not sub-question based (plain descriptive, MCQ, etc.).
ALTER TABLE public.assessment_attempt_answers
    ADD COLUMN IF NOT EXISTS sub_answer_scores TEXT;
