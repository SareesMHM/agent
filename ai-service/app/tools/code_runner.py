from app.utils.sandbox import run_python_isolated


def run_code(code: str) -> dict:
    """Disabled by default; see utils/sandbox.py."""
    return run_python_isolated(code)
