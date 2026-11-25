from fastapi import Header, HTTPException

from app.config import settings


async def require_internal(x_internal_token: str = Header(default="")):
    """Service-to-service auth: only the NestJS backend may call the AI service."""
    if settings.internal_token and x_internal_token != settings.internal_token:
        raise HTTPException(status_code=403, detail="Forbidden")
