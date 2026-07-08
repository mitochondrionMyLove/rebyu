CREATE TABLE IF NOT EXISTS public.exam_types (
    exam_type_id BIGSERIAL PRIMARY KEY,
    exam_type_text VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO public.exam_types (exam_type_text)
VALUES
    ('DIAGNOSTIC'),
    ('QUIZ'),
    ('MODULE_EXAM'),
    ('MOCK_EXAM')
ON CONFLICT (exam_type_text) DO NOTHING;
