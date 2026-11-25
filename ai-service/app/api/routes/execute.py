from fastapi import APIRouter, Depends, HTTPException

from app import llm, mocks
from app.api.deps import require_internal
from app.graphs.executor import run_task
from app.models.schemas import DocumentRequest, ExecuteRequest

router = APIRouter(dependencies=[Depends(require_internal)])


@router.post("/execute-task")
async def execute_task(req: ExecuteRequest):
    try:
        return await run_task(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-document")
async def generate_document(req: DocumentRequest):
    system = (f"You are a professional technical writer. Write a complete {req.type.value.replace('_', ' ')} document in markdown. "
              "Be specific, structured and realistic; do not invent facts about the client beyond the brief.")
    user = (f"Project: {req.name}\nBrief: {req.description}\nAnalysis: {req.analysis}\nTeam roles: {req.roles}\n"
            f"Tasks and status: {req.tasks}")
    content, _ = await llm.complete_text(system, user, lambda: mocks.document(req.type.value, req.name, req.description))
    return {"title": f"{req.type.value.replace('_', ' ')} - {req.name}", "content": content}
