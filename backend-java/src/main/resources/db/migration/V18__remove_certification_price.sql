-- Certification access is subscription-based. Prices belong to enrollment
-- transactions/plans, not to the certification catalog.
ALTER TABLE certifications DROP COLUMN IF EXISTS price;
