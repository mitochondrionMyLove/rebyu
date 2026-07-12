from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BktUpdateResult:
    predicted_correct_probability: float
    mastery_before: float
    mastery_posterior: float
    mastery_after: float


def clamp_probability(value: float, epsilon: float = 1e-12) -> float:
    return min(max(float(value), epsilon), 1.0 - epsilon)


def update_mastery(
    *,
    mastery_before: float,
    is_correct: bool,
    learn: float,
    guess: float,
    slip: float,
    forget: float = 0.0,
) -> BktUpdateResult:
    p = clamp_probability(mastery_before)
    learn = min(max(float(learn), 0.0), 1.0)
    guess = min(max(float(guess), 0.0), 1.0)
    slip = min(max(float(slip), 0.0), 1.0)
    forget = min(max(float(forget), 0.0), 1.0)

    predicted_correct = p * (1.0 - slip) + (1.0 - p) * guess

    if is_correct:
        numerator = p * (1.0 - slip)
        denominator = numerator + (1.0 - p) * guess
    else:
        numerator = p * slip
        denominator = numerator + (1.0 - p) * (1.0 - guess)

    posterior = numerator / max(denominator, 1e-12)
    transitioned = posterior * (1.0 - forget) + (1.0 - posterior) * learn
    mastery_after = min(max(transitioned, 0.0), 1.0)

    return BktUpdateResult(
        predicted_correct_probability=float(predicted_correct),
        mastery_before=float(p),
        mastery_posterior=float(posterior),
        mastery_after=float(mastery_after),
    )


def mastery_level(
    probability: float,
    *,
    developing_threshold: float,
    good_threshold: float,
    mastered_threshold: float,
) -> str:
    if probability >= mastered_threshold:
        return "mastered"
    if probability >= good_threshold:
        return "good"
    if probability >= developing_threshold:
        return "developing"
    return "weak"
