import json
import re
from typing import Callable, Optional

from app.config import settings
from app.utils.token_counter import estimate_tokens

_client = None


def _get_client():
    global _client
    if _client is None:
        from anthropic import AsyncAnthropic
        _client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    return _client


def extract_json(text: str):
    """Parse the first JSON object/array in an LLM reply (tolerates code fences / prose)."""
    text = re.sub(r"```(?:json)?", "", text)
    for opener, closer in (("{", "}"), ("[", "]")):
        s, e = text.find(opener), text.rfind(closer)
        if s != -1 and e > s:
            try:
                return json.loads(text[s:e + 1])
            except json.JSONDecodeError:
                continue
    raise ValueError("No valid JSON in model output")


async def complete(system: str, user: str, max_tokens: Optional[int] = None) -> tuple[str, int]:
    resp = await _get_client().messages.create(
        model=settings.llm_model, max_tokens=max_tokens or settings.max_tokens,
        system=system, messages=[{"role": "user", "content": user}])
    text = "".join(b.text for b in resp.content if getattr(b, "type", "") == "text")
    return text, resp.usage.input_tokens + resp.usage.output_tokens


async def complete_json(system: str, user: str, mock: Callable[[], dict | list]) -> tuple[dict | list, int]:
    """JSON completion. Uses deterministic mock output when no API key is configured."""
    if settings.mock_mode:
        data = mock()
        return data, estimate_tokens(json.dumps(data))
    system += "\n\nRespond with a single valid JSON value only. No commentary, no markdown fences."
    last_err: Exception | None = None
    for _ in range(2):
        text, tokens = await complete(system, user)
        try:
            return extract_json(text), tokens
        except ValueError as e:
            last_err = e
            user += "\n\n(Your previous reply was not valid JSON. Reply with JSON only.)"
    raise RuntimeError(f"LLM did not return valid JSON: {last_err}")


async def complete_text(system: str, user: str, mock: Callable[[], str]) -> tuple[str, int]:
    if settings.mock_mode:
        t = mock()
        return t, estimate_tokens(t)
    return await complete(system, user, max_tokens=6000)
