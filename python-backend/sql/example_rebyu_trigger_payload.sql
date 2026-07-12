-- Example query for constructing the source_event_id sent to POST /api/v1/bkt/mastery/events.
-- The event identifier must remain stable so retries are idempotent.

SELECT
    CONCAT(
        'learner-exam-detail:',
        learner_id, ':', exam_id, ':', exam_question_id, ':', attempt_no
    ) AS source_event_id,
    learner_id,
    lesson_id,
    exam_question_id,
    result,
    answered_at
FROM learner_exam_details
ORDER BY answered_at DESC;
