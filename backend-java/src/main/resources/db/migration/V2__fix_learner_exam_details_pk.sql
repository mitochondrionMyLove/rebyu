



ALTER TABLE public.learner_exam_details
    DROP CONSTRAINT IF EXISTS learner_exam_details_pkey;

ALTER TABLE public.learner_exam_details
    ADD PRIMARY KEY (learner_exam_detail_id);
