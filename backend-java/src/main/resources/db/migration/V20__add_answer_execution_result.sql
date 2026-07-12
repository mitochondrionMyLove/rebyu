-- Judge0 execution payload for programming answers, stored as JSON:
-- {codeHash, mode, status, output, error, executionTimeMs, memoryKb,
--  passedTests, totalTests, testResults:[{index,sample,passed,status}]}.
-- Overwritten by every Run/Check and cleared whenever the submitted code
-- changes without a fresh run, so it never describes stale code.
ALTER TABLE public.assessment_attempt_answers
    ADD COLUMN IF NOT EXISTS execution_result TEXT;
