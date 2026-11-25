import asyncio

from app.graphs.executor import run_task
from app.models.schemas import AgentInfo, ExecuteRequest


def _req(role, tools):
    return ExecuteRequest(
        organizationId="o", projectId="p-test", taskId="t",
        agent=AgentInfo(id="a1", name=f"{role} AI", roleName=role, systemPrompt="You are a pro.", tools=tools),
        task={"title": "Build API", "description": "Do it", "phase": "Build"}, project={"name": "X", "description": "Y"})


def test_execute_returns_summary_and_writes_files(tmp_path, monkeypatch):
    from app.config import settings
    monkeypatch.setattr(settings, "workspace_dir", str(tmp_path))
    res = asyncio.run(run_task(_req("Backend Developer", ["file_writer"])))
    assert res["summary"] and res["approved"]
    assert res["files"] and (tmp_path / "p-test" / res["files"][0]).exists()


def test_no_files_without_file_writer_permission(tmp_path, monkeypatch):
    from app.config import settings
    monkeypatch.setattr(settings, "workspace_dir", str(tmp_path))
    assert asyncio.run(run_task(_req("Backend Developer", [])))["files"] == []
