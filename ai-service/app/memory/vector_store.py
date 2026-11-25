import hashlib
import math


def _embed(text: str, dim: int = 256) -> list[float]:
    v = [0.0] * dim
    for tok in text.lower().split():
        v[int(hashlib.md5(tok.encode()).hexdigest(), 16) % dim] += 1.0
    n = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / n for x in v]


class VectorStore:
    """In-memory semantic memory using hashed bag-of-words.
    TODO: swap for pgvector (postgres image already ships the extension) with a real embedding model."""

    def __init__(self):
        self.items: list[tuple[str, str, list[float]]] = []

    def add(self, namespace: str, text: str) -> None:
        self.items.append((namespace, text, _embed(text)))

    def search(self, namespace: str, query: str, k: int = 3) -> list[str]:
        q = _embed(query)
        scored = [(sum(a * b for a, b in zip(q, e)), t) for ns, t, e in self.items if ns == namespace]
        return [t for _, t in sorted(scored, reverse=True)[:k]]


store = VectorStore()
