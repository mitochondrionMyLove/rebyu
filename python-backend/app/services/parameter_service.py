from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models import BktParameter, BktParameterClass


@dataclass(frozen=True)
class ResolvedParameters:
    prior: float
    learn: float
    guess: float
    slip: float
    forget: float
    model_variant: str

    def as_dict(self) -> dict[str, float | str]:
        return {
            "prior": self.prior,
            "learn": self.learn,
            "guess": self.guess,
            "slip": self.slip,
            "forget": self.forget,
            "model_variant": self.model_variant,
        }


def _class_value(
    classes: dict[tuple[str, str], float],
    parameter: str,
    class_name: str,
    fallback: float,
) -> float:
    return float(
        classes.get(
            (parameter, class_name),
            classes.get((parameter, "default"), fallback),
        )
    )


def resolve_parameters(
    session: Session,
    *,
    lesson_id: int,
    difficulty_level: str,
    assessment_type: str,
) -> ResolvedParameters:
    settings = get_settings()
    aggregate = session.get(BktParameter, lesson_id)
    rows = list(
        session.scalars(
            select(BktParameterClass).where(BktParameterClass.lesson_id == lesson_id)
        )
    )
    classes = {
        (row.parameter_name, row.class_name): float(row.parameter_value) for row in rows
    }

    prior_fallback = aggregate.prior_probability if aggregate else settings.fallback_prior
    learn_fallback = aggregate.learn_probability if aggregate else settings.fallback_learn
    guess_fallback = aggregate.guess_probability if aggregate else settings.fallback_guess
    slip_fallback = aggregate.slip_probability if aggregate else settings.fallback_slip
    forget_fallback = aggregate.forget_probability if aggregate else settings.fallback_forget

    return ResolvedParameters(
        prior=_class_value(classes, "prior", "default", prior_fallback),
        learn=_class_value(classes, "learns", assessment_type, learn_fallback),
        guess=_class_value(classes, "guesses", difficulty_level, guess_fallback),
        slip=_class_value(classes, "slips", difficulty_level, slip_fallback),
        forget=_class_value(classes, "forgets", assessment_type, forget_fallback),
        model_variant=aggregate.model_variant if aggregate else "fallback",
    )
