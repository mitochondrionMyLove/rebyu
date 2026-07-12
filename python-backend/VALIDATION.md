# Validation Results

Validated on July 12, 2026.

## Automated tests

```text
8 passed
```

Covered:

- BKT update math
- mastery threshold mapping
- liveness and readiness APIs
- database-backed mastery event ingestion
- event idempotency
- fallback parameters before the first trained model
- learner mastery retrieval
- readiness weight normalization

## pyBKT smoke test

Input: `sample_data/rebyu_bkt_demo_data.csv`

```text
Rows: 2,304
Selected candidate: full_rebyu
Validation AUC: 0.5769304901
Validation RMSE: 0.4940251525
Validation accuracy: 0.54375
Generated files: 12
```

## End-to-end service persistence smoke test

The training service was run through SQLAlchemy against a temporary database.

```text
Run status: succeeded
Stored lesson parameter rows: 4
Stored learner-lesson mastery rows: 192
Stored active model artifacts: 1
Training rows recorded on model run: 2,304
```

## Alembic migration smoke test

`alembic upgrade head` completed successfully against a fresh temporary database and reported revision:

```text
20260712_0001 (head)
```
