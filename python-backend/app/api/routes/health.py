from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db

router = APIRouter(tags=["health"])


@router.get("/health/live")
def liveness() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/ready")
def readiness(db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database is unavailable: {exc}",
        ) from exc
    settings = get_settings()
    return {
        "status": "ready",
        "database": "ok",
        "environment": settings.environment,
    }
