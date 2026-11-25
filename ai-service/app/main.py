from fastapi import FastAPI

from app.api.routes import analyze, execute, health, orchestrate, roles

app = FastAPI(title="AgentForge AI Service", version="1.0.0")
app.include_router(health.router)
for r in (analyze.router, roles.router, execute.router, orchestrate.router):
    app.include_router(r)
