import type { Fixture } from '@/types';
import { TeamLogo } from '@/components/brand/team-logo';

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(time: string | null): string | null {
  if (!time) return 'TBC';
  const [h, m] = time.split(':');
  const hours = Number(h);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${m} ${suffix}`;
}

export function FixturesList({ fixtures }: { fixtures: Fixture[] }) {
  if (fixtures.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-club-border bg-white p-10 text-center text-slate-500">
        No upcoming fixtures for this team yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fixtures.map((fixture) => (
        <div
          key={fixture.id}
          className="rounded-xl border border-club-border bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="min-w-[7rem]">
                <p className="text-sm font-semibold text-club-ink">
                  {formatDate(fixture.match_date)}
                </p>
                <p className="text-xs text-slate-500">{formatTime(fixture.match_time)}</p>
              </div>
              <div className="flex items-center gap-2 font-medium text-club-ink">
                <TeamLogo name={fixture.home_team} size="sm" />
                <span className={fixture.home_team.toLowerCase() === 'ekhaya' ? 'font-bold text-club-gold-700' : ''}>
                  {fixture.home_team}
                </span>
                <span className="mx-1 text-slate-400">vs</span>
                <span className={fixture.away_team.toLowerCase() === 'ekhaya' ? 'font-bold text-club-gold-700' : ''}>
                  {fixture.away_team}
                </span>
                <TeamLogo name={fixture.away_team} size="sm" />
              </div>
            </div>
            {fixture.competition_name && (
              <span className="hidden rounded-full bg-club-gold-100 px-2 py-0.5 text-xs font-semibold text-club-gold-700 sm:inline-block">
                {fixture.competition_name}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
