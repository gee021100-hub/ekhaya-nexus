import type { Result } from '@/types';

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(time: string | null): string | null {
  if (!time) return null;
  const [h, m] = time.split(':');
  const hours = Number(h);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${m} ${suffix}`;
}

export function ResultsList({ results }: { results: Result[] }) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-slate-50 p-10 text-center text-slate-500">
        No results available for this team yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => {
        const ekhayaScore =
          result.home_team.toLowerCase() === 'ekhaya'
            ? result.home_score
            : result.away_score;
        const opponentScore =
          result.home_team.toLowerCase() === 'ekhaya'
            ? result.away_score
            : result.home_score;
        const win = ekhayaScore > opponentScore;
        const draw = ekhayaScore === opponentScore;

        return (
          <div
            key={result.id}
            className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={
                    win
                      ? 'inline-block rounded bg-club-green-100 px-2 py-0.5 text-xs font-semibold text-club-green-700'
                      : draw
                        ? 'inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600'
                        : 'inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700'
                  }
                >
                  {win ? 'W' : draw ? 'D' : 'L'}
                </span>
                <div className="font-medium text-slate-900">
                  {result.home_team}{' '}
                  <span className={result.home_team.toLowerCase() === 'ekhaya' ? 'font-bold text-club-green-700' : 'font-bold'}>
                    {result.home_score}
                  </span>{' '}
                  <span className="text-slate-400">-</span>{' '}
                  <span className={result.away_team.toLowerCase() === 'ekhaya' ? 'font-bold text-club-green-700' : 'font-bold'}>
                    {result.away_score}
                  </span>{' '}
                  {result.away_team}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>
                  {formatDate(result.match_date)}
                  {result.match_time ? ` \u00b7 ${formatTime(result.match_time)}` : ''}
                </span>
                {result.competition_name && (
                  <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:inline-block">
                    {result.competition_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
