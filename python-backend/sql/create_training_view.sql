-- Rebyu BKT training view for PostgreSQL.
-- Run this after the main Rebyu assessment tables have been created.
--
-- Assumptions from the Rebyu data dictionary:
--   learner_exam_details.result is 0/1
--   questions.difficulty_level is easy/average/hard
--   exam_types.code contains DIAGNOSTIC, LESSON_QUIZ, MIDDLE_EXAM, MOCK_EXAM
--
-- If your exam_types column is named `name` or `type_name`, replace et.code.

CREATE OR REPLACE VIEW rebyu_bkt_training_data_v AS
SELECT
    ROW_NUMBER() OVER (
        ORDER BY
            led.answered_at,
            led.learner_id,
            led.exam_id,
            led.attempt_no,
            led.exam_question_id
    )::BIGINT AS attempt_order,
    led.learner_id::BIGINT AS learner_id,
    COALESCE(led.lesson_id, q.lesson_id)::TEXT AS skill_name,
    eq.question_id::TEXT AS question_id,
    led.result::INTEGER AS is_correct,
    UPPER(q.difficulty_level)::TEXT AS difficulty_level,
    UPPER(et.code)::TEXT AS assessment_type,
    led.answered_at,
    e.certification_id::BIGINT AS certification_id,
    COALESCE(led.lesson_id, q.lesson_id)::BIGINT AS lesson_id,
    led.exam_id::BIGINT AS exam_id,
    led.attempt_no::INTEGER AS attempt_no
FROM learner_exam_details led
JOIN exam_questions eq
    ON eq.exam_question_id = led.exam_question_id
JOIN questions q
    ON q.question_id = eq.question_id
JOIN exams e
    ON e.exam_id = led.exam_id
JOIN exam_types et
    ON et.exam_type_id = e.exam_type_id
WHERE led.result IN (0, 1)
  AND COALESCE(led.lesson_id, q.lesson_id) IS NOT NULL
  AND led.answered_at IS NOT NULL;

COMMENT ON VIEW rebyu_bkt_training_data_v IS
'Chronological learner response data consumed by the Rebyu FastAPI BKT service.';
