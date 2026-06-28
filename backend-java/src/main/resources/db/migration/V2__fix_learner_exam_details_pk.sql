-- Migrate learner_exam_details from composite PK to identity PK.
-- ddl-auto=update cannot drop/recreate PKs, so Flyway handles it here
-- before Hibernate attempts to create FK constraints from the answer tables.

ALTER TABLE public.learner_exam_details
    DROP CONSTRAINT IF EXISTS learner_exam_details_pkey;

ALTER TABLE public.learner_exam_details
    ADD PRIMARY KEY (learner_exam_detail_id);
