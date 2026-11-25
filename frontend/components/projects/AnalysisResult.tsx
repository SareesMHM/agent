import { Card, CardTitle } from '../ui/card';

const Block = ({ title, items }: { title: string; items?: string[] }) => !items?.length ? null : (
  <div><p className="mb-1 text-sm font-medium">{title}</p><ul className="list-inside list-disc text-sm text-slate-600">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>
);

export function AnalysisResult({ analysis }: { analysis: any }) {
  if (!analysis) return null;
  return (
    <Card className="space-y-4">
      <CardTitle>AI project analysis</CardTitle>
      <p className="text-sm text-slate-600">{analysis.summary}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Block title="Requirements" items={analysis.requirements} />
        <Block title="Technologies" items={analysis.technologies} />
        <Block title="Departments" items={analysis.departments} />
        <Block title="Phases" items={analysis.phases} />
        <Block title="Deliverables" items={analysis.deliverables} />
        <Block title="Risks" items={analysis.risks} />
      </div>
      {analysis.estimatedEffortWeeks && <p className="text-sm">Estimated effort: <b>{analysis.estimatedEffortWeeks} weeks</b></p>}
    </Card>
  );
}
