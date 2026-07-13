-- The community composer previously fabricated attachment_name/attachment_type
-- with no real file behind them. This column stores the actual S3 key of an
-- uploaded PDF/DOCX so learners can view/download what was shared.
ALTER TABLE community_posts
    ADD COLUMN IF NOT EXISTS attachment_key VARCHAR(500);
