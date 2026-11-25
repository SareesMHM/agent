import { BadGatewayException, Injectable } from '@nestjs/common';

/** HTTP client for the Python FastAPI AI service. */
@Injectable()
export class AiClientService {
  private base = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';

  private async post<T = any>(path: string, body: unknown): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${this.base}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal-token': process.env.INTERNAL_TOKEN ?? '' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new BadGatewayException(`AI service unreachable: ${(e as Error).message}`);
    }
    if (!res.ok) throw new BadGatewayException(`AI service error ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }
  analyzeProject(p: { name: string; description: string }) { return this.post('/analyze-project', p); }
  generateRoles(p: { name: string; description: string; analysis: any }) { return this.post('/generate-roles', p); }
  planTasks(p: any) { return this.post('/plan-tasks', p); }
  executeTask(p: any) { return this.post('/execute-task', p); }
  generateDocument(p: any) { return this.post('/generate-document', p); }
}
