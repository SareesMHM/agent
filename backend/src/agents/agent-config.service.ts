import { Injectable } from '@nestjs/common';

export interface GeneratedRole {
  name: string;
  department: string;
  description?: string;
  responsibilities?: string[];
  skills?: string[];
  tools?: string[];
  outputs?: string[];
  performanceCriteria?: string[];
  reportsTo?: string;
}

export const ALL_TOOLS = ['file_writer', 'doc_reader', 'web_search', 'code_runner', 'github'];
/** Tools that can modify or execute things need explicit human enabling. */
export const RESTRICTED_TOOLS = ['code_runner', 'github'];

@Injectable()
export class AgentConfigService {
  buildSystemPrompt(role: GeneratedRole, project: { name: string; description: string }) {
    const list = (a?: string[]) => (a?.length ? a.map((x) => `- ${x}`).join('\n') : '- (none specified)');
    return [
      `You are the ${role.name} in the ${role.department} department, working on the project "${project.name}".`,
      `Project brief: ${project.description}`,
      role.description ? `Role summary: ${role.description}` : '',
      `Responsibilities:\n${list(role.responsibilities)}`,
      `Skills:\n${list(role.skills)}`,
      `Expected deliverables:\n${list(role.outputs)}`,
      `Quality bar:\n${list(role.performanceCriteria)}`,
      role.reportsTo ? `You report to: ${role.reportsTo}.` : '',
      'Rules: stay within your role; never run unrestricted commands, deploy to production or make financial/employment decisions without human approval; flag blockers explicitly.',
    ].filter(Boolean).join('\n\n');
  }
  resolveTools(requested?: string[]) {
    return (requested?.length ? requested : ['file_writer', 'doc_reader'])
      .filter((t) => ALL_TOOLS.includes(t))
      .map((toolName) => ({ toolName, permitted: !RESTRICTED_TOOLS.includes(toolName) }));
  }
}
