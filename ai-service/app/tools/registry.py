from typing import Callable

from app.tools.code_runner import run_code
from app.tools.doc_reader import read_doc
from app.tools.file_writer import write_files
from app.tools.github_tool import create_pull_request
from app.tools.web_search import web_search

TOOLS: dict[str, Callable] = {
    "file_writer": write_files,
    "doc_reader": read_doc,
    "code_runner": run_code,
    "github": create_pull_request,
    "web_search": web_search,
}


def run_tool(name: str, allowed: list[str], *args, **kwargs):
    """Every tool call is gated by the agent's permitted-tools list."""
    if name not in allowed:
        raise PermissionError(f"Tool '{name}' not permitted for this agent")
    return TOOLS[name](*args, **kwargs)
