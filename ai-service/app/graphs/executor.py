from langgraph.graph import END, START, StateGraph

from app.agents.registry import resolve_agent
from app.agents.reviewer import review as run_review
from app.callbacks.audit_handler import audit
from app.callbacks.stream_handler import emit
from app.graphs.state import ExecState
from app.tools.registry import run_tool

MAX_REVISIONS = 1


async def worker(state: ExecState) -> ExecState:
    req = state["req"]
    agent = resolve_agent(req.agent.roleName)(req)
    await emit(req.organizationId, {"type": "agent.working", "agentId": req.agent.id, "taskId": req.taskId, "projectId": req.projectId})
    out, tokens = await agent.run(state.get("feedback"))
    return {"output": out, "tokens": state.get("tokens", 0) + tokens}


async def reviewer(state: ExecState) -> ExecState:
    req = state["req"]
    rev, tokens = await run_review(req.task, state["output"])
    return {"review": rev, "tokens": state.get("tokens", 0) + tokens, "feedback": rev.get("feedback"),
            "revisions": state.get("revisions", 0) + (0 if rev.get("approved") else 1)}


def route(state: ExecState) -> str:
    if state["review"].get("approved") or state.get("revisions", 0) > MAX_REVISIONS:
        return "finalize"
    return "revise"


async def finalize(state: ExecState) -> ExecState:
    req, out = state["req"], state["output"]
    written: list[str] = []
    if out.get("files") and "file_writer" in req.agent.tools:
        written = run_tool("file_writer", req.agent.tools, req.projectId, out["files"])
    audit("task.executed", task=req.taskId, agent=req.agent.id, files=written)
    return {"files": written}


_g = StateGraph(ExecState)
_g.add_node("worker", worker)
_g.add_node("reviewer", reviewer)
_g.add_node("finalize", finalize)
_g.add_edge(START, "worker")
_g.add_edge("worker", "reviewer")
_g.add_conditional_edges("reviewer", route, {"revise": "worker", "finalize": "finalize"})
_g.add_edge("finalize", END)
graph = _g.compile()


async def run_task(req) -> dict:
    s = await graph.ainvoke({"req": req, "revisions": 0, "tokens": 0})
    out = s["output"]
    return {
        "summary": out.get("summary", ""), "content": out.get("content", ""), "files": s.get("files", []),
        "approved": bool(s["review"].get("approved")), "review": s["review"], "tokens": s.get("tokens", 0),
    }
