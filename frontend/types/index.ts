export interface User { id: string; email: string; name: string }
export interface Company { id: string; name: string; industry?: string | null; description?: string | null; objectives?: string | null; _count?: { projects: number; members: number }; departments?: Department[] }
export interface Department { id: string; name: string; description?: string | null }
export interface Role { name: string; department: string; description?: string; responsibilities?: string[]; skills?: string[]; tools?: string[]; outputs?: string[]; reportsTo?: string | null }
export interface Project { id: string; name: string; description: string; status: string; analysis?: any; roles?: Role[] | null; createdAt: string }
export interface Agent { id: string; name: string; roleName: string; description?: string | null; systemPrompt: string; status: string; skills?: { id: string; name: string }[]; tools?: { id: string; toolName: string; permitted: boolean }[]; department?: Department | null; runs?: any[]; tasks?: any[]; _count?: { tasks: number; runs: number } }
export interface Task { id: string; title: string; description: string; phase?: string | null; status: string; priority: number; requiresApproval: boolean; output?: any; assignedAgent?: { id: string; name: string; roleName: string } | null; dependencies?: { dependsOnId: string }[] }
export interface Workflow { id: string; name: string; status: string; steps: { id: string; order: number; name: string }[] }
export interface DocumentItem { id: string; title: string; type: string; content: string; createdAt: string }
export interface Approval { id: string; status: string; kind: string; taskId?: string | null; task?: { id: string; title: string; output?: any } | null; payload?: any; createdAt: string }
export interface Member { id: string; role: string; user: User }
