import asyncio

from app.graphs.role_generator import generate_roles
from app.graphs.task_planner import plan_tasks


def test_roles_include_project_manager_and_dedupe():
    out = asyncio.run(generate_roles("Shop", "Create an e-commerce platform with AI product recommendations and payments", None))
    names = [r["name"] for r in out["roles"]]
    assert "Project Manager" in names and "AI Engineer" in names
    assert len(names) == len(set(names))


def test_plan_dependencies_only_reference_earlier_tasks():
    roles = [r["name"] for r in asyncio.run(generate_roles("Shop", "Create a web platform", None))["roles"]]
    tasks = asyncio.run(plan_tasks("Shop", "Create a web platform", None, roles))["tasks"]
    assert tasks
    for i, t in enumerate(tasks):
        assert all(d < i for d in t["dependsOn"])
