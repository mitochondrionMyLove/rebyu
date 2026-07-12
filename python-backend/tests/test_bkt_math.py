from app.services.bkt_math import mastery_level, update_mastery


def test_correct_answer_increases_mastery() -> None:
    result = update_mastery(
        mastery_before=0.30,
        is_correct=True,
        learn=0.20,
        guess=0.25,
        slip=0.10,
        forget=0.00,
    )
    assert result.predicted_correct_probability == 0.445
    assert result.mastery_after > 0.30
    assert 0 <= result.mastery_posterior <= 1


def test_incorrect_answer_reduces_belief_before_learning_transition() -> None:
    result = update_mastery(
        mastery_before=0.75,
        is_correct=False,
        learn=0.10,
        guess=0.20,
        slip=0.10,
        forget=0.00,
    )
    assert result.mastery_posterior < 0.75
    assert 0 <= result.mastery_after <= 1


def test_mastery_levels() -> None:
    thresholds = {
        "developing_threshold": 0.40,
        "good_threshold": 0.70,
        "mastered_threshold": 0.85,
    }
    assert mastery_level(0.20, **thresholds) == "weak"
    assert mastery_level(0.50, **thresholds) == "developing"
    assert mastery_level(0.75, **thresholds) == "good"
    assert mastery_level(0.90, **thresholds) == "mastered"
