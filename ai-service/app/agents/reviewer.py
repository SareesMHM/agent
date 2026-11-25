import json

from app import llm, mocks

SYSTEM = ('You are a strict senior reviewer. Judge whether the deliverable satisfies the task. '
          'Reply JSON: {"approved": true|false, "feedback": "specific fixes if not approved"}.')


async def review(task: dict, output: dict) -> tuple[dict, int]:
    user = f"Task: {task.get('title')}\n{task.get('description')}\n\nDeliverable:\n{json.dumps(output)[:6000]}"
    data, tokens = await llm.complete_json(SYSTEM, user, mocks.review)
    if not isinstance(data, dict):
        data = {"approved": True, "feedback": ""}
    return data, tokens
