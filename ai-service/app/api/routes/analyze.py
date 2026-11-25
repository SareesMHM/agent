from fastapi import APIRouter, Depends

from app import llm, mocks
from app.api.deps import require_internal
from app.graphs.task_planner import plan_tasks
from app.models.schemas import AnalyzeRequest, PlanRequest

router = APIRouter(dependencies=[Depends(require_internal)])

SYSTEM = ("You are a senior business/systems analyst. Analyse the project brief. Return JSON: {\"summary\", \"requirements\": [], "
          "\"technologies\": [], \"departments\": [], \"phases\": [], \"deliverables\": [], \"estimatedEffortWeeks\": number, \"risks\": []}.")


@router.post("/analyze-project")
async def analyze_project(req: AnalyzeRequest):
    data, _ = await llm.complete_json(SYSTEM, f"Project: {req.name}\n{req.description}", lambda: mocks.analyze(req.name, req.description))
    return data


@router.post("/plan-tasks")
async def plan(req: PlanRequest):
    return await plan_tasks(req.name, req.description, req.analysis, req.roles)
