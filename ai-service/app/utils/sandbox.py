import os
import subprocess
import sys
import tempfile
from pathlib import Path

from app.config import settings


def workspace_root(project_id: str) -> Path:
    safe = "".join(c for c in project_id if c.isalnum() or c in "-_")[:64] or "default"
    root = Path(settings.workspace_dir).resolve() / safe
    root.mkdir(parents=True, exist_ok=True)
    return root


def safe_path(project_id: str, relative: str) -> Path:
    """Resolve a relative path inside the project workspace; reject traversal and absolute paths."""
    if not relative or relative.startswith(("/", "\\")) or ":" in relative:
        raise ValueError("Invalid path")
    root = workspace_root(project_id)
    target = (root / relative).resolve()
    if root != target and root not in target.parents:
        raise ValueError("Path escapes workspace")
    return target


def run_python_isolated(code: str, timeout: int = 10) -> dict:
    """Best-effort restricted execution: temp dir, empty env, timeout, output cap.
    NOT a security boundary - run the AI service itself in a locked-down container."""
    if not settings.enable_code_runner:
        raise PermissionError("code_runner is disabled (set ENABLE_CODE_RUNNER=true inside an isolated container)")
    with tempfile.TemporaryDirectory() as tmp:
        f = Path(tmp) / "main.py"
        f.write_text(code)
        try:
            p = subprocess.run([sys.executable, "-I", str(f)], cwd=tmp, env={"PATH": os.defpath},
                               capture_output=True, text=True, timeout=timeout)
        except subprocess.TimeoutExpired:
            return {"exit_code": -1, "stdout": "", "stderr": "timeout"}
        return {"exit_code": p.returncode, "stdout": p.stdout[:5000], "stderr": p.stderr[:5000]}
