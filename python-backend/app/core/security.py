from __future__ import annotations

import secrets

from fastapi import Header, HTTPException, status

from app.core.config import get_settings


def require_service_key(x_service_key: str | None = Header(default=None)) -> None:
    settings = get_settings()
    expected = settings.service_api_key
    if not expected:
        return
    if x_service_key is None or not secrets.compare_digest(x_service_key, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid X-Service-Key",
        )
