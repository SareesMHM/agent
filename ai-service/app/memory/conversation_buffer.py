from collections import defaultdict, deque


class ConversationBuffer:
    """Short-term per-agent memory (in-process)."""

    def __init__(self, size: int = 10):
        self._b: dict[str, deque] = defaultdict(lambda: deque(maxlen=size))

    def add(self, agent_id: str, text: str) -> None:
        self._b[agent_id].append(text)

    def get(self, agent_id: str) -> list[str]:
        return list(self._b[agent_id])


buffer = ConversationBuffer()
