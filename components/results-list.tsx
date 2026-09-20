import type { Result } from '@/types';
import { TeamLogo } from '@/components/brand/team-logo';

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
      <div className="rounded-xl border border-dashed border-club-border bg-white p-10 text-center text-slate-500">
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
            className="rounded-xl border border-club-border bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className={win ? 'status-w' : draw ? 'status-d' : 'status-l'}>
                  {win ? 'W' : draw ? 'D' : 'L'}
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    <TeamLogo name={result.home_team} size="sm" />
                    <span className={result.home_team.toLowerCase() === 'ekhaya' ? 'font-bold text-club-gold-700' : ''}>
                      {result.home_team}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 rounded-md border border-club-border bg-[#F7F5F0] px-2 py-0.5 font-display text-base font-semibold text-club-ink">
                    <span className={result.home_team.toLowerCase() === 'ekhaya' ? 'text-club-gold-700' : ''}>
                      {result.home_score}
                    </span>
                    <span className="text-slate-400">:</span>
                    <span className={result.away_team.toLowerCase() === 'ekhaya' ? 'text-club-gold-700' : ''}>
                      {result.away_score}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    <span className={result.away_team.toLowerCase() === 'ekhaya' ? 'font-bold text-club-gold-700' : ''}>
                      {result.away_team}
                    </span>
                    <TeamLogo name={result.away_team} size="sm" />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>
                  {formatDate(result.match_date)}
                  {result.match_time ? ` \u00b7 ${formatTime(result.match_time)}` : ''}
                </span>
                {result.competition_name && (
                  <span className="hidden rounded-full bg-club-gold-100 px-2 py-0.5 text-xs font-semibold text-club-gold-700 sm:inline-block">
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
