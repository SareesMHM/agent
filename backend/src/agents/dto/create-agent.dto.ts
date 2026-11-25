export class CreateAgentDto {
  projectId: string;
  name: string;
  roleName: string;
  departmentId?: string;
  description?: string;
  systemPrompt: string;
  skills?: string[];
  tools?: string[];
}
