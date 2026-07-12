-- Per-element (node/edge) breakdown from DiagramGradingService, stored as
-- JSON: [{"kind":"NODE|EDGE","matched":true,"matchQuality":"STRONG|PARTIAL|
-- WEAK|NONE","earnedPoints":1.50,"maxPoints":2.00}, ...]. Never echoes
-- reference diagram label text, so it is safe to store even before a
-- release-settings-gated review surface decides whether to expose it.
ALTER TABLE public.assessment_attempt_answers
    ADD COLUMN IF NOT EXISTS diagram_grading_result TEXT;
