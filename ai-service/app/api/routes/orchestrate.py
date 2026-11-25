from fastapi import APIRouter, Depends

from app.api.deps import require_internal
from app.graphs.workflow_graph import run_workflow
from app.models.schemas import WorkflowRequest

router = APIRouter(dependencies=[Depends(require_internal)])


@router.post("/run-workflow")
async def run(req: WorkflowRequest):
    """Run an ordered list of task executions as a LangGraph workflow (stops on first failure)."""
    return await run_workflow(req.steps)
