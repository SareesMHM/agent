from typing import Any, Optional, TypedDict


class RoleState(TypedDict, total=False):
    name: str
    description: str
    analysis: Optional[dict]
    roles: list[dict]
    attempts: int
    tokens: int


class PlanState(TypedDict, total=False):
    name: str
    description: str
    analysis: Optional[dict]
    role_names: list[str]
    tasks: list[dict]
    attempts: int
    tokens: int


class ExecState(TypedDict, total=False):
    req: Any
    output: dict
    review: dict
    feedback: Optional[str]
    revisions: int
    files: list[str]
    tokens: int


class WorkflowState(TypedDict, total=False):
    steps: list[Any]
    results: list[dict]
    failed: bool
