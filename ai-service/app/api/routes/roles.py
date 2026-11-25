from fastapi import APIRouter, Depends

from app.api.deps import require_internal
from app.graphs.role_generator import generate_roles
from app.models.schemas import RolesRequest

router = APIRouter(dependencies=[Depends(require_internal)])


@router.post("/generate-roles")
async def roles(req: RolesRequest):
    return await generate_roles(req.name, req.description, req.analysis)
