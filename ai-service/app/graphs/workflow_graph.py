from langgraph.graph import END, START, StateGraph

from app.graphs.executor import run_task
from app.graphs.state import WorkflowState


def build(step_count: int):
    """Sequential workflow graph: step_i -> step_{i+1}; halts on first failure (conditional edge)."""
    g = StateGraph(WorkflowState)

    def make(i: int):
        async def node(state: WorkflowState) -> WorkflowState:
            step = state["steps"][i]
            try:
                res = await run_task(step.execute)
                ok = True
            except Exception as e:  # recorded; workflow stops
                res, ok = {"error": str(e)}, False
            return {"results": state.get("results", []) + [{"step": step.name, "ok": ok, **res}], "failed": not ok}
        return node

    for i in range(step_count):
        g.add_node(f"s{i}", make(i))
    g.add_edge(START, "s0")
    for i in range(step_count):
        nxt = f"s{i + 1}" if i + 1 < step_count else END
        g.add_conditional_edges(f"s{i}", lambda s, nxt=nxt: END if s.get("failed") else nxt)
    return g.compile()


async def run_workflow(steps: list) -> dict:
    if not steps:
        return {"results": [], "failed": False}
    out = await build(len(steps)).ainvoke({"steps": steps, "results": [], "failed": False})
    return {"results": out["results"], "failed": out["failed"]}
