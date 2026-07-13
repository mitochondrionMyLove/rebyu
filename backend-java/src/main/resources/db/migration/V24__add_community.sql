CREATE TABLE community_circles (
    circle_id BIGSERIAL PRIMARY KEY,
    owner_learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    topic VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE community_circle_members (
    circle_id BIGINT NOT NULL REFERENCES community_circles(circle_id) ON DELETE CASCADE,
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (circle_id, learner_id)
);

CREATE TABLE community_posts (
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

CREATE TABLE community_post_likes (
    post_id BIGINT NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, learner_id)
);

CREATE TABLE community_saved_posts (
    post_id BIGINT NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, learner_id)
);

CREATE TABLE community_comments (
    comment_id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
    author_learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    parent_comment_id BIGINT REFERENCES community_comments(comment_id) ON DELETE CASCADE,
    body VARCHAR(2000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_circle ON community_posts(circle_id, created_at DESC);
CREATE INDEX idx_community_comments_post ON community_comments(post_id, created_at);

