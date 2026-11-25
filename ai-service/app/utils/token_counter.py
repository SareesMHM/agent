def estimate_tokens(text: str) -> int:
    """Rough estimate (~4 chars/token). Real usage is taken from the API response when available."""
    return max(1, len(text) // 4)
