CREATE TABLE learner_library_items (
    library_item_id BIGSERIAL PRIMARY KEY,
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    certification_id BIGINT REFERENCES certifications(certification_id) ON DELETE SET NULL,
    lesson_id BIGINT REFERENCES lessons(lesson_id) ON DELETE SET NULL,
    item_type VARCHAR(24) NOT NULL CHECK (item_type IN ('quiz','flashcard','file','link','note')),
    title VARCHAR(180) NOT NULL,
    description VARCHAR(1000),
    resource_url VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_library_learner_created ON learner_library_items(learner_id, created_at DESC);

CREATE TABLE learner_mistake_reviews (
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    source_question_id BIGINT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (learner_id, source_question_id)
);

