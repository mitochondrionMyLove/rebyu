-- Enterprise learner groups: an enterprise carves a certification allocation
-- (organization_certificate) into groups, assigns a teacher/authority/co-admin
-- to each group, and that authority adds the enterprise's learners to the group.

CREATE TABLE IF NOT EXISTS public.enterprise_groups (
    enterprise_group_id BIGSERIAL    PRIMARY KEY,
    enterprise_id       BIGINT       NOT NULL REFERENCES public.enterprises(enterprise_id),
    org_cert_id         BIGINT       NOT NULL REFERENCES public.organization_certificates(org_cert_id),
    group_name          VARCHAR(150) NOT NULL,
    group_description   VARCHAR(500),
    created_by          BIGINT       NOT NULL REFERENCES public.users(user_id),
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status              VARCHAR(20)  NOT NULL DEFAULT 'active',
    CONSTRAINT chk_enterprise_groups_status CHECK (status IN ('active', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_enterprise_groups_enterprise ON public.enterprise_groups(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_groups_org_cert ON public.enterprise_groups(org_cert_id);

-- The teacher/authority/co-admin responsible for a group. The enterprise assigns
-- this authority; the authority (not the enterprise) manages the group learners.
CREATE TABLE IF NOT EXISTS public.enterprise_group_authorities (
    enterprise_group_authority_id BIGSERIAL   PRIMARY KEY,
    enterprise_group_id           BIGINT      NOT NULL REFERENCES public.enterprise_groups(enterprise_group_id),
    user_id                       BIGINT      NOT NULL REFERENCES public.users(user_id),
    assigned_by                   BIGINT      NOT NULL REFERENCES public.users(user_id),
    assigned_at                   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status                        VARCHAR(20) NOT NULL DEFAULT 'active',
    removed_at                    TIMESTAMP,
    CONSTRAINT uq_enterprise_group_authority UNIQUE (enterprise_group_id, user_id),
    CONSTRAINT chk_enterprise_group_authority_status CHECK (status IN ('active', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_egr_authorities_group ON public.enterprise_group_authorities(enterprise_group_id);
CREATE INDEX IF NOT EXISTS idx_egr_authorities_user ON public.enterprise_group_authorities(user_id);

-- Learners placed into a group. Each row must reference an existing
-- organization_certification_learner belonging to the same org_cert as the group.
CREATE TABLE IF NOT EXISTS public.enterprise_group_assignees (
    enterprise_group_assignee_id BIGSERIAL   PRIMARY KEY,
    enterprise_group_id          BIGINT      NOT NULL REFERENCES public.enterprise_groups(enterprise_group_id),
    org_cert_learner_id          BIGINT      NOT NULL REFERENCES public.organization_certification_learners(org_cert_learner_id),
    assigned_by                  BIGINT      NOT NULL REFERENCES public.users(user_id),
    assigned_at                  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status                       VARCHAR(20) NOT NULL DEFAULT 'active',
    removed_at                   TIMESTAMP,
    CONSTRAINT uq_enterprise_group_assignee UNIQUE (enterprise_group_id, org_cert_learner_id),
    CONSTRAINT chk_enterprise_group_assignee_status CHECK (status IN ('active', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_egr_assignees_group ON public.enterprise_group_assignees(enterprise_group_id);
CREATE INDEX IF NOT EXISTS idx_egr_assignees_learner ON public.enterprise_group_assignees(org_cert_learner_id);
