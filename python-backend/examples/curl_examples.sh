#!/usr/bin/env sh
set -eu

BASE_URL="${BASE_URL:-http://localhost:8000}"
SERVICE_KEY="${SERVICE_KEY:-replace-with-a-long-random-internal-key}"

curl "$BASE_URL/api/v1/bkt/health/live"

curl -X POST "$BASE_URL/api/v1/bkt/mastery/events" \
  -H "Content-Type: application/json" \
  -H "X-Service-Key: $SERVICE_KEY" \
  -d '{
    "source_event_id": "learner-exam-detail:12:44:991:1",
    "learner_id": 12,
    "lesson_id": 101,
    "question_id": 501,
    "is_correct": true,
    "difficulty_level": "AVERAGE",
    "assessment_type": "LESSON_QUIZ",
    "occurred_at": "2026-07-12T12:00:00+08:00"
  }'

curl -X POST "$BASE_URL/api/v1/bkt/training/jobs/from-csv" \
  -H "X-Service-Key: $SERVICE_KEY" \
  -F "file=@sample_data/rebyu_bkt_demo_data.csv" \
  -F "requested_by=local-demo" \
  -F "num_fits=1"
