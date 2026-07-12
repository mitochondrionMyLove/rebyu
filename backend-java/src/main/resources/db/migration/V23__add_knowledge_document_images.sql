-- Images extracted from ingested PDF/DOCX knowledge documents, stored
-- separately from the text embeddings (never inside the embedding vector).
-- The owning text chunk(s) reference an image's image_key via an
-- "imageKeys" entry in that chunk's pgvector metadata JSON, linking the
-- image to the relevant chunk without storing image data in the embedding.
CREATE TABLE IF NOT EXISTS public.knowledge_document_images (
    knowledge_document_image_id BIGSERIAL     PRIMARY KEY,
    knowledge_document_id       BIGINT        NOT NULL REFERENCES public.knowledge_documents(knowledge_document_id) ON DELETE CASCADE,
    image_key                   VARCHAR(255)  NOT NULL UNIQUE,
    content_type                VARCHAR(100),
    page_number                 INTEGER,
    order_in_page                INTEGER,
    nearby_text                  TEXT,
    created_at                  TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_document_images_document
    ON public.knowledge_document_images(knowledge_document_id);
