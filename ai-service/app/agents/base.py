import json

from app import llm, mocks
from app.memory import conversation_buffer
from app.models.schemas import ExecuteRequest

JSON_RULES = ('Reply as JSON: {"summary": "one sentence", "content": "full deliverable in markdown"%s}.')


class BaseAgent:
    """Generic worker agent: system prompt from the backend + task context -> structured deliverable."""
    can_write_files = False

    def __init__(self, req: ExecuteRequest):
        self.req = req

    def system(self) -> str:
        extra = ', "files": [{"path": "relative/path.ext", "content": "..."}]' if self.can_write_files and "file_writer" in self.req.agent.tools else ""
        return self.req.agent.systemPrompt + "\n\n" + JSON_RULES % extra

    def user(self, feedback: str | None) -> str:
        ctx = "\n".join(f"- {c.get('title')}: {json.dumps(c.get('output'))[:1500]}" for c in self.req.context) or "(none)"
        memory = "\n".join(conversation_buffer.buffer.get(self.req.agent.id)) or "(none)"
        t = self.req.task
        msg = f"Task: {t.get('title')}\nPhase: {t.get('phase')}\nDetails: {t.get('description')}\n\nOutputs of prerequisite tasks:\n{ctx}\n\nYour recent work:\n{memory}"
        return msg + (f"\n\nReviewer feedback to address:\n{feedback}" if feedback else "")

    async def run(self, feedback: str | None = None) -> tuple[dict, int]:
        t, a = self.req.task, self.req.agent
        data, tokens = await llm.complete_json(
            self.system(), self.user(feedback),
            lambda: mocks.execute(a.roleName, t.get("title", ""), t.get("description", ""), self.can_write_files))
        if not isinstance(data, dict):
            data = {"summary": "Completed", "content": json.dumps(data)}
        conversation_buffer.buffer.add(a.id, f"{t.get('title')}: {data.get('summary', '')}")
        return data, tokens
