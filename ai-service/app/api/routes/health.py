from fastapi import APIRouter

from app.config import settings

router = APIRouter()


@router.get('/health')
async def health():
    return {'status': 'ok', 'mock_mode': settings.mock_mode, 'model': settings.llm_model}
