from app.utils.sandbox import safe_path


def read_doc(project_id: str, path: str, limit: int = 20000) -> str:
    p = safe_path(project_id, path)
    return p.read_text()[:limit] if p.exists() else ''
