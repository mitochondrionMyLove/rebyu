ALTER TABLE public.knowledge_documents
    ADD COLUMN IF NOT EXISTS certification_id BIGINT;
