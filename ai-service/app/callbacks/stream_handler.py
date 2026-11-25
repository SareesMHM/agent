import httpx

from app.config import settings


async def emit(organization_id: str, event: dict) -> None:
    """Push progress events to the backend WebSocket gateway. Best-effort; never raises."""
    try:
        async with httpx.AsyncClient(timeout=3) as c:
            await c.post(f"{settings.backend_url}/internal/ai-events",
                         headers={"x-internal-token": settings.internal_token},
                         json={"organizationId": organization_id, **event})
    except Exception:
        pass
