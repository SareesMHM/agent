import re

from app.agents.base import BaseAgent
from app.agents.developer import DeveloperAgent
from app.agents.project_manager import ProjectManagerAgent
from app.agents.qa import QAAgent

_RULES: list[tuple[str, type[BaseAgent]]] = [
    (r"qa|test", QAAgent),
    (r"manager|lead|director", ProjectManagerAgent),
    (r"developer|engineer|architect|devops|database|designer", DeveloperAgent),
]


def resolve_agent(role_name: str) -> type[BaseAgent]:
    """role_name -> agent class (first matching rule); unknown roles use the generic BaseAgent."""
    for pattern, cls in _RULES:
        if re.search(pattern, role_name.lower()):
            return cls
    return BaseAgent
