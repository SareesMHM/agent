from langgraph.graph import END, START, StateGraph

from app import llm, mocks
from app.graphs.state import PlanState

SYSTEM = ("You are an AI Project Manager. Turn the project into a roadmap of concrete tasks. Return JSON: "
          "{\"tasks\": [{\"title\", \"description\", \"phase\", \"role\" (exactly one of the available roles), \"priority\" (1 high-5 low), "
          "\"estimatedHours\", \"requiresApproval\" (true for key deliverables), \"dependsOn\": [indexes of earlier tasks]}]}. "
          "Dependencies must only reference earlier tasks (no cycles). 8-30 tasks.")


async def plan(state: PlanState) -> PlanState:
    user = (f"Project: {state['name']}\nDescription: {state['description']}\nAnalysis: {state.get('analysis')}\n"
            f"Available roles: {state['role_names']}")
    data, tokens = await llm.complete_json(SYSTEM, user, lambda: mocks.plan(state["role_names"]))
    tasks = data.get("tasks", []) if isinstance(data, dict) else data
    return {"tasks": tasks, "attempts": state.get("attempts", 0) + 1, "tokens": state.get("tokens", 0) + tokens}


def validate(state: PlanState) -> PlanState:
    tasks = [t for t in state.get("tasks", []) if isinstance(t, dict) and t.get("title")]
    for i, t in enumerate(tasks):
        # only allow dependencies on earlier tasks -> acyclic by construction
        t["dependsOn"] = sorted({d for d in t.get("dependsOn", []) if isinstance(d, int) and 0 <= d < i})
        t["priority"] = min(5, max(1, int(t.get("priority") or 3)))
        t["requiresApproval"] = bool(t.get("requiresApproval", False))
        t.setdefault("description", "")
    return {"tasks": tasks}


def route(state: PlanState) -> str:
    return "retry" if not state.get("tasks") and state.get("attempts", 0) < 2 else "done"


_g = StateGraph(PlanState)
_g.add_node("plan", plan)
_g.add_node("validate", validate)
_g.add_edge(START, "plan")
_g.add_edge("plan", "validate")
_g.add_conditional_edges("validate", route, {"retry": "plan", "done": END})
graph = _g.compile()


async def plan_tasks(name: str, description: str, analysis: dict | None, roles: list[str]) -> dict:
    out = await graph.ainvoke({"name": name, "description": description, "analysis": analysis, "role_names": roles, "attempts": 0, "tokens": 0})
    return {"tasks": out["tasks"], "tokens": out.get("tokens", 0)}
