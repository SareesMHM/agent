from app.utils.sandbox import safe_path

MAX_FILE_BYTES = 200_000
MAX_FILES = 20


def write_files(project_id: str, files: list[dict]) -> list[str]:
    """Write agent-produced files into the sandboxed project workspace. Returns written relative paths."""
    written: list[str] = []
    for f in files[:MAX_FILES]:
        content = str(f.get("content", ""))
        if len(content.encode()) > MAX_FILE_BYTES:
            continue
        try:
            p = safe_path(project_id, str(f.get("path", "")))
        except ValueError:
            continue
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content)
        written.append(str(f["path"]))
    return written
