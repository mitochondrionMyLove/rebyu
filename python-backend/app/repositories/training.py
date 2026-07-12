from __future__ import annotations

from datetime import datetime
from typing import Any

import pandas as pd
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import get_settings


class TrainingDataRepository:
    def __init__(self) -> None:
        self.settings = get_settings()

    def load_dataframe(
        self,
        session: Session,
        *,
        certification_id: int | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> pd.DataFrame:
        view = self.settings.training_view_name
        conditions: list[str] = []
        params: dict[str, Any] = {}

        if certification_id is not None:
            conditions.append("certification_id = :certification_id")
            params["certification_id"] = certification_id
        if date_from is not None:
            conditions.append("answered_at >= :date_from")
            params["date_from"] = date_from
        if date_to is not None:
            conditions.append("answered_at < :date_to")
            params["date_to"] = date_to

        where = f" WHERE {' AND '.join(conditions)}" if conditions else ""
        statement = text(
            f"SELECT * FROM {view}{where} "
            "ORDER BY learner_id, answered_at, attempt_order"
        )
        return pd.read_sql_query(statement, session.connection(), params=params)
