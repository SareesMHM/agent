"""Deterministic offline outputs used when ANTHROPIC_API_KEY is not set (demo/testing)."""

ROLE_LIBRARY = {
    "Project Manager": ("Management", ["Create roadmap", "Assign and track tasks", "Review deliverables", "Report progress"], ["Planning", "Risk management"]),
    "Business Analyst": ("Software Development", ["Elicit requirements", "Write SRS/BRD", "Define acceptance criteria"], ["Requirements analysis", "Documentation"]),
    "UI/UX Designer": ("Software Development", ["Design user flows", "Create wireframes and UI kit"], ["Figma", "Accessibility"]),
    "Frontend Developer": ("Software Development", ["Build responsive UI", "Integrate APIs", "Write frontend tests"], ["React", "Next.js", "TypeScript", "Tailwind CSS"]),
    "Backend Developer": ("Software Development", ["Design REST APIs", "Implement business logic", "Write backend tests"], ["Node.js", "NestJS", "PostgreSQL"]),
    "Database Engineer": ("Software Development", ["Design schema", "Write migrations", "Optimise queries"], ["PostgreSQL", "Prisma"]),
    "AI Engineer": ("Software Development", ["Build AI features", "Evaluate model quality"], ["Python", "LLMs", "Embeddings"]),
    "QA Engineer": ("Software Development", ["Write test plan", "Automate tests", "Report defects"], ["Jest", "Playwright"]),
    "DevOps Engineer": ("Software Development", ["Containerise services", "Set up CI/CD"], ["Docker", "GitHub Actions", "AWS"]),
    "Security Engineer": ("Software Development", ["Threat model", "Review auth and data isolation"], ["OWASP", "Pen testing"]),
    "Marketing Manager": ("Marketing", ["Plan launch campaign", "Define brand messaging"], ["Strategy", "Analytics"]),
    "Content Writer": ("Marketing", ["Write website and campaign copy"], ["Copywriting", "SEO"]),
    "HR Manager": ("Human Resources", ["Define hiring plan", "Write job descriptions"], ["Recruitment", "Policy"]),
    "Finance Manager": ("Finance", ["Prepare budget", "Track costs"], ["Budgeting", "Reporting"]),
    "Customer Support Manager": ("Customer Support", ["Design support workflows", "Write help content"], ["Support ops"]),
}


def _has(d: str, *words: str) -> bool:
    d = d.lower()
    return any(w in d for w in words)


def pick_roles(description: str) -> list[str]:
    roles = ["Project Manager"]
    software = _has(description, "app", "platform", "website", "system", "software", "api", "portal", "e-commerce", "ecommerce", "mobile") or not _has(description, "campaign", "hiring", "recruit")
    if software:
        roles += ["Business Analyst", "UI/UX Designer", "Frontend Developer", "Backend Developer", "Database Engineer", "QA Engineer", "DevOps Engineer", "Security Engineer"]
    if _has(description, "ai", "recommend", "machine learning", "chatbot", "predict"):
        roles.append("AI Engineer")
    if _has(description, "market", "campaign", "brand", "launch", "seo"):
        roles += ["Marketing Manager", "Content Writer"]
    if _has(description, "hr", "recruit", "hiring", "payroll", "employee"):
        roles.append("HR Manager")
    if _has(description, "payment", "budget", "invoice", "finance"):
        roles.append("Finance Manager")
    if _has(description, "support", "customer service", "helpdesk"):
        roles.append("Customer Support Manager")
    return list(dict.fromkeys(roles))


def analyze(name: str, description: str) -> dict:
    roles = pick_roles(description)
    depts = list(dict.fromkeys(ROLE_LIBRARY[r][0] for r in roles))
    return {
        "summary": f"{name}: {description[:200]}",
        "requirements": ["Core features as described in the brief", "User accounts and permissions", "Responsive, accessible UI", "Secure data handling", "Automated testing and deployment"],
        "technologies": ["Next.js", "TypeScript", "Node.js/NestJS", "PostgreSQL", "Docker"],
        "departments": depts,
        "phases": ["Discovery", "Design", "Build", "Test", "Launch"],
        "deliverables": ["SRS", "UI designs", "Working application", "Test report", "Deployment"],
        "estimatedEffortWeeks": max(4, 2 * len(roles)),
        "risks": ["Scope creep", "Third-party integration delays"],
    }


def roles(name: str, description: str) -> dict:
    out = []
    for r in pick_roles(description):
        dept, resp, skills = ROLE_LIBRARY[r]
        out.append({
            "name": r, "department": dept, "description": f"{r} for {name}.",
            "responsibilities": resp, "skills": skills, "tools": ["file_writer", "doc_reader"],
            "outputs": [f"{r} deliverables"], "performanceCriteria": ["Meets acceptance criteria", "Clear documentation"],
            "reportsTo": None if r == "Project Manager" else "Project Manager",
        })
    return {"roles": out}


PHASE_TASKS = [
    ("Discovery", "Business Analyst", "Write requirements specification", "Produce SRS covering functional and non-functional requirements.", False, []),
    ("Discovery", "Project Manager", "Create project roadmap", "Define milestones, phases and ownership.", False, []),
    ("Design", "UI/UX Designer", "Design user flows and wireframes", "Wireframes for all key screens.", True, [0]),
    ("Design", "Database Engineer", "Design database schema", "ER design and Prisma schema.", False, [0]),
    ("Design", "Security Engineer", "Threat model and security requirements", "Authentication, authorisation, tenant isolation.", False, [0]),
    ("Build", "Backend Developer", "Implement backend APIs", "REST endpoints, validation, business logic.", False, [3, 4]),
    ("Build", "Frontend Developer", "Implement frontend UI", "Pages and components integrated with APIs.", True, [2, 5]),
    ("Build", "AI Engineer", "Implement AI features", "AI-powered functionality and evaluation.", False, [5]),
    ("Test", "QA Engineer", "Create and run test plan", "Unit, integration and E2E tests with defect report.", False, [5, 6]),
    ("Launch", "DevOps Engineer", "Containerise and set up CI/CD", "Dockerfiles, pipeline, staging deploy.", True, [8]),
    ("Launch", "Project Manager", "Final delivery report", "Summarise outcomes, risks and next steps.", True, [8, 9]),
]


def plan(roles_available: list[str]) -> dict:
    avail = set(roles_available)
    kept: list[tuple] = []
    idx_map: dict[int, int] = {}
    for i, t in enumerate(PHASE_TASKS):
        role = t[1] if t[1] in avail else ("Project Manager" if "Project Manager" in avail else (roles_available[0] if roles_available else t[1]))
        if t[1] not in avail and t[1] != "Project Manager" and t[1] not in ("Business Analyst",):
            continue
        idx_map[i] = len(kept)
        kept.append((t, role))
    tasks = []
    for t, role in kept:
        tasks.append({
            "title": t[2], "description": t[3], "phase": t[0], "role": role, "priority": 2 if t[0] in ("Discovery", "Design") else 3,
            "estimatedHours": 8, "requiresApproval": t[4],
            "dependsOn": [idx_map[d] for d in t[5] if d in idx_map],
        })
    return {"tasks": tasks}


def execute(role: str, title: str, description: str, with_files: bool) -> dict:
    out = {
        "summary": f"{role} completed: {title}",
        "content": f"# {title}\n\n**Prepared by:** {role}\n\n{description}\n\n## Outcome\n- Work completed per the task brief.\n- No blockers identified.\n\n_(Generated in mock mode - set ANTHROPIC_API_KEY for real output.)_",
    }
    if with_files:
        slug = "".join(c if c.isalnum() else "-" for c in title.lower()).strip("-")[:40]
        out["files"] = [{"path": f"deliverables/{slug}.md", "content": out["content"]}]
    return out


def review() -> dict:
    return {"approved": True, "feedback": "Meets requirements."}


def document(doc_type: str, name: str, description: str) -> str:
    return (f"# {doc_type.replace('_', ' ')} - {name}\n\n## 1. Overview\n{description}\n\n## 2. Scope\nTo be refined with the team.\n\n"
            "## 3. Details\n- Item 1\n- Item 2\n\n_(Mock-mode document - set ANTHROPIC_API_KEY for real content.)_")
