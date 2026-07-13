-- ============================================================================
-- MANUAL, IDEMPOTENT UNBLOCK SCRIPT — run this directly against your database
-- (psql / Neon SQL editor) if Flyway is not applying V24-V26 for you.
--
-- This lives OUTSIDE src/main/resources/db/migration on purpose so Flyway
-- never scans or picks it up automatically. It safely creates only what's
-- missing using IF NOT EXISTS everywhere, so it is safe to run even if some
-- of these tables already exist. Content mirrors V24, V25, V26 exactly.
-- ============================================================================

-- ---- from V24__add_community.sql -----------------------------------------
CREATE TABLE IF NOT EXISTS community_circles (
    circle_id BIGSERIAL PRIMARY KEY,
    owner_learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    topic VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_circle_members (
    circle_id BIGINT NOT NULL REFERENCES community_circles(circle_id) ON DELETE CASCADE,
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (circle_id, learner_id)
);

CREATE TABLE IF NOT EXISTS community_posts (
    post_id BIGSERIAL PRIMARY KEY,
    author_learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    circle_id BIGINT REFERENCES community_circles(circle_id) ON DELETE SET NULL,
    post_type VARCHAR(24) NOT NULL CHECK (post_type IN ('discussion','quizzes','notes','docx','circle')),
    title VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    attachment_name VARCHAR(255),
    attachment_type VARCHAR(16),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_post_likes (
    post_id BIGINT NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, learner_id)
);

CREATE TABLE IF NOT EXISTS community_saved_posts (
    post_id BIGINT NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, learner_id)
);

CREATE TABLE IF NOT EXISTS community_comments (
    comment_id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
    author_learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    parent_comment_id BIGINT REFERENCES community_comments(comment_id) ON DELETE CASCADE,
    body VARCHAR(2000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_circle ON community_posts(circle_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id, created_at);

-- ---- from V25__add_learner_library_and_mistake_reviews.sql ----------------
CREATE TABLE IF NOT EXISTS learner_library_items (
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

CREATE INDEX IF NOT EXISTS idx_library_learner_created ON learner_library_items(learner_id, created_at DESC);

CREATE TABLE IF NOT EXISTS learner_mistake_reviews (
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    source_question_id BIGINT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (learner_id, source_question_id)
);

-- ---- from V26__add_text_question_accepted_variations.sql ------------------
ALTER TABLE text_question_configs
    ADD COLUMN IF NOT EXISTS accepted_variations TEXT;

-- ---- from V27__add_community_post_attachment_key.sql ----------------------
ALTER TABLE community_posts
    ADD COLUMN IF NOT EXISTS attachment_key VARCHAR(500);

-- ============================================================================
-- OPTIONAL — only if your backend logs a Flyway error on next startup after
-- running the above. This tells Flyway "V24-V27 are already applied" so it
-- stops trying (and failing) to re-run them:
--
--   INSERT INTO flyway_schema_history
--     (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success)
--   SELECT
--     (SELECT COALESCE(MAX(installed_rank), 0) FROM flyway_schema_history) + 1,
--     v.version, v.description, 'SQL', v.script, NULL, current_user, now(), 0, true
--   FROM (VALUES
--     ('24', 'add community', 'V24__add_community.sql'),
--     ('25', 'add learner library and mistake reviews', 'V25__add_learner_library_and_mistake_reviews.sql'),
--     ('26', 'add text question accepted variations', 'V26__add_text_question_accepted_variations.sql'),
--     ('27', 'add community post attachment key', 'V27__add_community_post_attachment_key.sql')
--   ) AS v(version, description, script)
--   WHERE NOT EXISTS (
--     SELECT 1 FROM flyway_schema_history h WHERE h.version = v.version
--   );
-- ============================================================================
