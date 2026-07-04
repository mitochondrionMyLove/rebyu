-- Enable pgvector extension (requires superuser on first run; run manually on Neon if needed)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.knowledge_documents (
    knowledge_document_id BIGSERIAL PRIMARY KEY,
    filename              VARCHAR(512)  NOT NULL,
    original_filename     VARCHAR(512)  NOT NULL,
    content_type          VARCHAR(100)  NOT NULL,
    file_size             BIGINT,
    s3_key                VARCHAR(1024),
    chunk_count           INTEGER,
    status                VARCHAR(20)   NOT NULL DEFAULT 'PROCESSING',
    uploaded_at           TIMESTAMP     NOT NULL,
    processed_at          TIMESTAMP
);
