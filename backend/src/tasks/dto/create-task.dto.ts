export class CreateTaskDto {
  projectId: string;
  title: string;
  description: string;
  assignedAgentId?: string;
  priority?: number;
  requiresApproval?: boolean;
}
