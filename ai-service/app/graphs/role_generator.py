from langgraph.graph import END, START, StateGraph

from app import llm, mocks
from app.graphs.state import RoleState

SYSTEM = ("You are an expert organisational designer. Given a project, produce the minimal effective team of professional roles. "
          "Return JSON: {\"roles\": [{\"name\", \"department\", \"description\", \"responsibilities\": [], \"skills\": [], "
          "\"tools\": [subset of file_writer, doc_reader, web_search], \"outputs\": [], \"performanceCriteria\": [], \"reportsTo\"}]}. "
          "Always include a Project Manager. 4-14 roles.")


async def generate(state: RoleState) -> RoleState:
    user = f"Project: {state['name']}\nDescription: {state['description']}\nAnalysis: {state.get('analysis')}"
    data, tokens = await llm.complete_json(SYSTEM, user, lambda: mocks.roles(state["name"], state["description"]))
    roles = data.get("roles", []) if isinstance(data, dict) else data
    return {"roles": roles, "attempts": state.get("attempts", 0) + 1, "tokens": state.get("tokens", 0) + tokens}


def validate(state: RoleState) -> RoleState:
    clean, seen = [], set()
    for r in state.get("roles", []):
        if not isinstance(r, dict) or not r.get("name") or not r.get("department"):
            continue
        key = r["name"].strip().lower()
        if key in seen:
            continue
        seen.add(key)
        clean.append({
            "name": r["name"].strip(), "department": r["department"].strip(), "description": r.get("description", ""),
            "responsibilities": list(r.get("responsibilities", [])), "skills": list(r.get("skills", [])),
            "tools": [t for t in r.get("tools", []) if t in ("file_writer", "doc_reader", "web_search")] or ["file_writer", "doc_reader"],
            "outputs": list(r.get("outputs", [])), "performanceCriteria": list(r.get("performanceCriteria", [])),
            "reportsTo": r.get("reportsTo"),
        })
    return {"roles": clean}


def route(state: RoleState) -> str:
    return "retry" if len(state.get("roles", [])) < 2 and state.get("attempts", 0) < 2 else "done"


_g = StateGraph(RoleState)
_g.add_node("generate", generate)
_g.add_node("validate", validate)
_g.add_edge(START, "generate")
_g.add_edge("generate", "validate")
_g.add_conditional_edges("validate", route, {"retry": "generate", "done": END})
graph = _g.compile()


async def generate_roles(name: str, description: str, analysis: dict | None) -> dict:
    out = await graph.ainvoke({"name": name, "description": description, "analysis": analysis, "attempts": 0, "tokens": 0})
    return {"roles": out["roles"], "tokens": out.get("tokens", 0)}
