-- Canonical assessment types for the unified curriculum/assessment model.
-- Existing types (DIAGNOSTIC, QUIZ, MODULE_EXAM, MOCK_EXAM) are preserved for
-- backward compatibility; these add explicit major/middle/lesson scopes.
INSERT INTO public.exam_types (exam_type_text)
VALUES
    ('MAJOR_EXAM'),
    ('MIDDLE_EXAM'),
    ('LESSON_QUIZ')
ON CONFLICT (exam_type_text) DO NOTHING;
