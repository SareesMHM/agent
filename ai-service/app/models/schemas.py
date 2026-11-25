from typing import Any, Optional

from pydantic import BaseModel, Field

from app.models.enums import DocType


class AnalyzeRequest(BaseModel):
    name: str
    description: str


class RolesRequest(AnalyzeRequest):
    analysis: Optional[dict] = None


class PlanRequest(AnalyzeRequest):
    analysis: Optional[dict] = None
    roles: list[str] = Field(default_factory=list)


class AgentInfo(BaseModel):
    id: str
    name: str
    roleName: str
    systemPrompt: str
    tools: list[str] = Field(default_factory=list)


class ExecuteRequest(BaseModel):
    organizationId: str
    projectId: str
    taskId: str
    agent: AgentInfo
    task: dict
    project: dict
    context: list[dict] = Field(default_factory=list)


class DocumentRequest(AnalyzeRequest):
    type: DocType
    analysis: Optional[dict] = None
    roles: list[str] = Field(default_factory=list)
    tasks: list[dict] = Field(default_factory=list)


class WorkflowStep(BaseModel):
    name: str
    execute: ExecuteRequest


class WorkflowRequest(BaseModel):
    steps: list[WorkflowStep]


class ExecuteResult(BaseModel):
    summary: str
    content: str
    files: list[str] = Field(default_factory=list)
    approved: bool = True
    review: Optional[Any] = None
    tokens: int = 0
