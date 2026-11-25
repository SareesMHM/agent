import pytest

from app.tools.registry import run_tool
from app.utils.sandbox import safe_path


def test_path_traversal_blocked(tmp_path, monkeypatch):
    from app.config import settings
    monkeypatch.setattr(settings, "workspace_dir", str(tmp_path))
    for bad in ["../x", "/etc/passwd", "a/../../x", "C:\\x"]:
        with pytest.raises(ValueError):
            safe_path("p", bad)
    assert safe_path("p", "ok/file.txt").is_relative_to(tmp_path.resolve())


def test_tool_permission_enforced():
    with pytest.raises(PermissionError):
        run_tool("code_runner", ["file_writer"], "print(1)")


def test_code_runner_disabled_by_default():
    with pytest.raises(PermissionError):
        run_tool("code_runner", ["code_runner"], "print(1)")
