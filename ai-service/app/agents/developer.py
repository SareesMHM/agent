from app.agents.base import BaseAgent


class DeveloperAgent(BaseAgent):
    """Engineering roles may emit files, written to the sandboxed workspace if file_writer is permitted."""
    can_write_files = True
