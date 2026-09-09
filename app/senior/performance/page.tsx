import type { Metadata } from 'next';
import { getCompetitions, getPerformanceByCompetition } from '@/lib/data';
import { PerformanceView } from '@/components/performance-view';

export const metadata: Metadata = {
  title: 'Performance',
};

export default async function SeniorPerformancePage() {
  const competitions = await getCompetitions();

  const performanceData: Record<string, Awaited<ReturnType<typeof getPerformanceByCompetition>>> = {};
  for (const comp of competitions) {
    performanceData[comp.id] = await getPerformanceByCompetition(comp.id);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Performance</h2>
        <p className="text-sm text-slate-500">Goals, assists, medical and minutes by competition</p>
      </div>
      <PerformanceView
        competitions={competitions}
        initialPerformance={performanceData}
      />
    </div>
  );
}
