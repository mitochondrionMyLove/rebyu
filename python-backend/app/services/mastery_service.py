from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models import (
    BktMasteryEvent,
    BktProcessedEvent,
    LearnerLessonMastery,
    LearnerLessonMasteryHistory,
)
from app.schemas.mastery import MasteryEventCreate, MasteryEventResponse, ParametersUsed
from app.services import category_service, priority_service
from app.services.bkt_math import mastery_level, update_mastery
from app.services.parameter_service import resolve_parameters


def _payload_hash(payload: MasteryEventCreate) -> str:
    canonical = json.dumps(
        {
            "source_event_id": payload.source_event_id,
            "learner_id": payload.learner_id,
            "lesson_id": payload.lesson_id,
            "question_id": payload.question_id,
            "is_correct": payload.is_correct,
            "difficulty_level": payload.difficulty_level,
            "assessment_type": payload.assessment_type,
        },
        sort_keys=True,
    )
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def _response_from_event(
    event: BktMasteryEvent,
    mastery: LearnerLessonMastery,
    *,
    duplicate: bool,
) -> MasteryEventResponse:
    params = event.parameters_used
    return MasteryEventResponse(
        source_event_id=event.source_event_id,
        duplicate=duplicate,
        learner_id=event.learner_id,
        lesson_id=event.lesson_id,
        question_id=event.question_id,
        is_correct=event.is_correct,
        predicted_correct_probability=event.predicted_correct_probability,
        mastery_before=event.mastery_before,
        mastery_posterior=event.mastery_posterior,
        mastery_after=event.mastery_after,
        mastery_level=mastery.mastery_level,
        attempt_count=mastery.attempt_count,
        parameters_used=ParametersUsed(**params),
        processed_at=event.processed_at,
    )


def process_mastery_event(session: Session, payload: MasteryEventCreate) -> MasteryEventResponse:
    existing_event = session.scalar(
        select(BktMasteryEvent).where(
            BktMasteryEvent.source_event_id == payload.source_event_id
        )
    )
    if existing_event:
        mastery = session.get(
            LearnerLessonMastery,
            (existing_event.learner_id, existing_event.lesson_id),
        )
        if mastery is None:
            raise RuntimeError("Mastery event exists but its mastery row is missing")
        return _response_from_event(existing_event, mastery, duplicate=True)

    settings = get_settings()
    parameters = resolve_parameters(
        session,
        lesson_id=payload.lesson_id,
        difficulty_level=payload.difficulty_level,
        assessment_type=payload.assessment_type,
    )

    mastery = session.scalar(
        select(LearnerLessonMastery)
        .where(
            LearnerLessonMastery.learner_id == payload.learner_id,
            LearnerLessonMastery.lesson_id == payload.lesson_id,
        )
        .with_for_update()
    )
    mastery_before = mastery.mastery_probability if mastery else parameters.prior
    previous_level = mastery.mastery_level if mastery else None
    update = update_mastery(
        mastery_before=mastery_before,
        is_correct=payload.is_correct,
        learn=parameters.learn,
        guess=parameters.guess,
        slip=parameters.slip,
        forget=parameters.forget,
    )
    level = mastery_level(
        update.mastery_after,
        developing_threshold=settings.developing_threshold,
        good_threshold=settings.good_threshold,
        mastered_threshold=settings.mastered_threshold,
    )
    now = datetime.now(timezone.utc)

    if mastery is None:
        mastery = LearnerLessonMastery(
            learner_id=payload.learner_id,
            lesson_id=payload.lesson_id,
            mastery_probability=update.mastery_after,
            mastery_level=level,
            attempt_count=1,
            last_event_id=payload.source_event_id,
            last_updated=now,
        )
        session.add(mastery)
    else:
        mastery.mastery_probability = update.mastery_after
        mastery.mastery_level = level
        mastery.attempt_count += 1
        mastery.last_event_id = payload.source_event_id
        mastery.last_updated = now

    # Evidence counters + curriculum path (kept current from each event).
    if payload.is_correct:
        mastery.correct_count = (mastery.correct_count or 0) + 1
    else:
        mastery.incorrect_count = (mastery.incorrect_count or 0) + 1
    mastery.certification_id = payload.certification_id or mastery.certification_id
    mastery.middle_category_id = payload.middle_category_id or mastery.middle_category_id
    mastery.major_category_id = payload.major_category_id or mastery.major_category_id
    mastery.lesson_title = payload.lesson_title or mastery.lesson_title
    mastery.middle_category_title = payload.middle_category_title or mastery.middle_category_title
    mastery.major_category_title = payload.major_category_title or mastery.major_category_title
    mastery.last_assessment_type = payload.assessment_type

    event = BktMasteryEvent(
        source_event_id=payload.source_event_id,
        learner_id=payload.learner_id,
        lesson_id=payload.lesson_id,
        question_id=payload.question_id,
        is_correct=payload.is_correct,
        difficulty_level=payload.difficulty_level,
        assessment_type=payload.assessment_type,
        mastery_before=update.mastery_before,
        mastery_posterior=update.mastery_posterior,
        mastery_after=update.mastery_after,
        predicted_correct_probability=update.predicted_correct_probability,
        parameters_used=parameters.as_dict(),
        occurred_at=payload.occurred_at,
        processed_at=now,
    )
    session.add(event)

    # Audit trail for result-page mastery changes and analytics.
    session.add(
        LearnerLessonMasteryHistory(
            event_id=payload.source_event_id,
            learner_id=payload.learner_id,
            certification_id=payload.certification_id,
            lesson_id=payload.lesson_id,
            previous_mastery=update.mastery_before,
            observation_posterior=update.mastery_posterior,
            final_mastery=update.mastery_after,
            previous_mastery_level=previous_level,
            new_mastery_level=level,
            observed_correct=payload.is_correct,
            assessment_type=payload.assessment_type,
            difficulty_level=payload.difficulty_level,
            model_version=parameters.model_variant,
            created_at=now,
        )
    )
    # Idempotency ledger with a deterministic payload hash for conflict detection.
    session.add(
        BktProcessedEvent(
            event_id=payload.source_event_id,
            learner_id=payload.learner_id,
            certification_id=payload.certification_id,
            exam_question_id=payload.question_id,
            payload_hash=_payload_hash(payload),
            processing_status="PROCESSED",
            processed_at=now,
        )
    )

    # Recalculate the lesson priority and roll it up into the parent middle and
    # major categories, in the SAME transaction. Requires the curriculum path.
    if payload.certification_id is not None:
        session.flush()
        computed = priority_service.compute_lesson_priority(mastery, settings)
        priority_service.upsert_priority(
            session,
            learner_id=payload.learner_id,
            certification_id=payload.certification_id,
            category_type="LESSON",
            category_id=payload.lesson_id,
            title=payload.lesson_title or mastery.lesson_title,
            computed=computed,
            settings=settings,
            model_version=parameters.model_variant,
            last_assessment_type=payload.assessment_type,
            source_event_id=payload.source_event_id,
            major_category_id=payload.major_category_id,
            middle_category_id=payload.middle_category_id,
            lesson_id=payload.lesson_id,
        )
        category_service.recompute_categories(
            session,
            learner_id=payload.learner_id,
            certification_id=payload.certification_id,
            settings=settings,
            source_event_id=payload.source_event_id,
            model_version=parameters.model_variant,
        )

    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        existing_event = session.scalar(
            select(BktMasteryEvent).where(
                BktMasteryEvent.source_event_id == payload.source_event_id
            )
        )
        if existing_event is None:
            raise
        mastery = session.get(
            LearnerLessonMastery,
            (existing_event.learner_id, existing_event.lesson_id),
        )
        if mastery is None:
            raise RuntimeError("Duplicate event exists without mastery row")
        return _response_from_event(existing_event, mastery, duplicate=True)

    session.refresh(event)
    session.refresh(mastery)
    return _response_from_event(event, mastery, duplicate=False)
