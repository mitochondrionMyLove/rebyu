"""Example integration from a Rebyu assessment service.

Call `send_answer_to_bkt()` only after learner_exam_details has committed. In a
high-reliability deployment, place the payload in an outbox table in the same
transaction, then let a worker deliver it to this service.
"""
from __future__ import annotations

from datetime import datetime

import httpx


class BktServiceError(RuntimeError):
    pass


def send_answer_to_bkt(
    *,
    base_url: str,
    service_api_key: str,
    learner_id: int,
    lesson_id: int,
    exam_id: int,
    exam_question_id: int,
    attempt_no: int,
    question_id: int,
    is_correct: bool,
    difficulty_level: str,
    assessment_type: str,
    answered_at: datetime,
) -> dict:
    source_event_id = (
        f"learner-exam-detail:{learner_id}:{exam_id}:"
        f"{exam_question_id}:{attempt_no}"
    )
    payload = {
        "source_event_id": source_event_id,
        "learner_id": learner_id,
        "lesson_id": lesson_id,
        "question_id": question_id,
        "is_correct": is_correct,
        "difficulty_level": difficulty_level.upper(),
        "assessment_type": assessment_type.upper(),
        "occurred_at": answered_at.isoformat(),
    }

    try:
        response = httpx.post(
            f"{base_url.rstrip('/')}/api/v1/bkt/mastery/events",
            headers={"X-Service-Key": service_api_key},
            json=payload,
            timeout=5.0,
        )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise BktServiceError(f"BKT service request failed: {exc}") from exc
    return response.json()
