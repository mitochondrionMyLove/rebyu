"""Create Rebyu BKT service tables.

Revision ID: 20260712_0001
Revises: None
Create Date: 2026-07-12
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260712_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "bkt_model_runs",
        sa.Column("model_run_id", sa.String(36), primary_key=True),
        sa.Column("run_type", sa.String(30), nullable=False, server_default="training"),
        sa.Column("trigger_type", sa.String(30), nullable=False, server_default="manual"),
        sa.Column("source_type", sa.String(30), nullable=False, server_default="database"),
        sa.Column("status", sa.String(20), nullable=False, server_default="queued"),
        sa.Column("requested_by", sa.String(150)),
        sa.Column("celery_task_id", sa.String(100)),
        sa.Column("certification_id", sa.BigInteger()),
        sa.Column("date_from", sa.DateTime(timezone=True)),
        sa.Column("date_to", sa.DateTime(timezone=True)),
        sa.Column("model_variant", sa.String(80)),
        sa.Column("evaluation_mode", sa.String(80)),
        sa.Column("seed", sa.Integer(), nullable=False, server_default="42"),
        sa.Column("num_fits", sa.Integer(), nullable=False, server_default="2"),
        sa.Column("test_size", sa.Float(), nullable=False, server_default="0.20"),
        sa.Column("training_rows", sa.Integer()),
        sa.Column("learner_count", sa.Integer()),
        sa.Column("skill_count", sa.Integer()),
        sa.Column("metrics", sa.JSON()),
        sa.Column("configuration", sa.JSON()),
        sa.Column("artifact_path", sa.String(500)),
        sa.Column("error_message", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True)),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint(
            "status IN ('queued','running','succeeded','failed','cancelled')",
            name="ck_bkt_model_runs_status",
        ),
    )
    op.create_index("ix_bkt_model_runs_status", "bkt_model_runs", ["status"])
    op.create_index("ix_bkt_model_runs_celery_task_id", "bkt_model_runs", ["celery_task_id"])

    op.create_table(
        "bkt_parameters",
        sa.Column("lesson_id", sa.BigInteger(), primary_key=True),
        sa.Column("prior_probability", sa.Float(), nullable=False),
        sa.Column("learn_probability", sa.Float(), nullable=False),
        sa.Column("guess_probability", sa.Float(), nullable=False),
        sa.Column("slip_probability", sa.Float(), nullable=False),
        sa.Column("forget_probability", sa.Float(), nullable=False, server_default="0"),
        sa.Column("model_variant", sa.String(80), nullable=False),
        sa.Column(
            "model_run_id",
            sa.String(36),
            sa.ForeignKey("bkt_model_runs.model_run_id", ondelete="SET NULL"),
        ),
        sa.Column("last_trained_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "bkt_parameter_classes",
        sa.Column("lesson_id", sa.BigInteger(), primary_key=True),
        sa.Column("parameter_name", sa.String(30), primary_key=True),
        sa.Column("class_name", sa.String(80), primary_key=True),
        sa.Column("parameter_value", sa.Float(), nullable=False),
        sa.Column(
            "model_run_id",
            sa.String(36),
            sa.ForeignKey("bkt_model_runs.model_run_id", ondelete="SET NULL"),
        ),
        sa.Column("last_trained_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint(
            "parameter_name IN ('prior','learns','guesses','slips','forgets')",
            name="ck_bkt_parameter_classes_parameter",
        ),
    )

    op.create_table(
        "learner_lesson_mastery",
        sa.Column("learner_id", sa.BigInteger(), primary_key=True),
        sa.Column("lesson_id", sa.BigInteger(), primary_key=True),
        sa.Column("mastery_probability", sa.Float(), nullable=False),
        sa.Column("mastery_level", sa.String(20), nullable=False),
        sa.Column("attempt_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_event_id", sa.String(150)),
        sa.Column(
            "model_run_id",
            sa.String(36),
            sa.ForeignKey("bkt_model_runs.model_run_id", ondelete="SET NULL"),
        ),
        sa.Column("last_updated", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint(
            "mastery_level IN ('weak','developing','good','mastered')",
            name="ck_learner_lesson_mastery_level",
        ),
    )
    op.create_index(
        "ix_mastery_learner_level",
        "learner_lesson_mastery",
        ["learner_id", "mastery_level"],
    )

    op.create_table(
        "bkt_mastery_events",
        sa.Column("event_id", sa.String(36), primary_key=True),
        sa.Column("source_event_id", sa.String(150), nullable=False, unique=True),
        sa.Column("learner_id", sa.BigInteger(), nullable=False),
        sa.Column("lesson_id", sa.BigInteger(), nullable=False),
        sa.Column("question_id", sa.BigInteger()),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.Column("difficulty_level", sa.String(20), nullable=False),
        sa.Column("assessment_type", sa.String(30), nullable=False),
        sa.Column("mastery_before", sa.Float(), nullable=False),
        sa.Column("mastery_posterior", sa.Float(), nullable=False),
        sa.Column("mastery_after", sa.Float(), nullable=False),
        sa.Column("predicted_correct_probability", sa.Float(), nullable=False),
        sa.Column("parameters_used", sa.JSON(), nullable=False),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(
        "ix_bkt_mastery_events_source_event_id",
        "bkt_mastery_events",
        ["source_event_id"],
        unique=True,
    )
    op.create_index(
        "ix_bkt_mastery_events_learner_lesson",
        "bkt_mastery_events",
        ["learner_id", "lesson_id", "occurred_at"],
    )

    op.create_table(
        "bkt_model_artifacts",
        sa.Column("artifact_id", sa.String(36), primary_key=True),
        sa.Column(
            "model_run_id",
            sa.String(36),
            sa.ForeignKey("bkt_model_runs.model_run_id", ondelete="CASCADE"),
            nullable=False,
            unique=True,
        ),
        sa.Column("model_variant", sa.String(80), nullable=False),
        sa.Column("artifact_path", sa.String(500), nullable=False),
        sa.Column("sha256", sa.String(64), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(
        "ix_bkt_model_artifacts_is_active",
        "bkt_model_artifacts",
        ["is_active"],
    )


def downgrade() -> None:
    op.drop_table("bkt_model_artifacts")
    op.drop_table("bkt_mastery_events")
    op.drop_table("learner_lesson_mastery")
    op.drop_table("bkt_parameter_classes")
    op.drop_table("bkt_parameters")
    op.drop_table("bkt_model_runs")
