import { createClient } from '@/lib/supabase/server';

export type PageViewStats = {
  total30d: number;
  total7d: number;
  uniques30d: number;
  topPaths: { path: string; views: number }[];
  devices: { device: string; views: number }[];
  days: { date: string; views: number }[];
};

function isoDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Aggregates the last 30 days of page views for the admin Analytics page.
 * Reads go through the signed-in staff session (RLS authenticated read).
 * Returns an empty/zero result set when the table isn't present yet — callers
 * must not crash when analytics haven't been enabled.
 */
export async function getPageViewStats(): Promise<PageViewStats> {
  const empty: PageViewStats = {
    total30d: 0,
    total7d: 0,
    uniques30d: 0,
    topPaths: [],
    devices: [],
    days: [],
  };

  try {
    const supabase = await createClient();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('analytics_page_views')
      .select('path, device, visitor, created_at')
      .gte('created_at', since)
      .limit(10000);

    if (error) return empty;

    const rows = (data ?? []) as {
      path: string;
      device: string | null;
      visitor: string | null;
      created_at: string;
    }[];

    const now = Date.now();
    const seven = now - 7 * 24 * 60 * 60 * 1000;

    const pathCount = new Map<string, number>();
    const deviceCount = new Map<string, number>();
    const dayCount = new Map<string, number>();
    const visitors = new Set<string>();

    for (const row of rows) {
      const ts = new Date(row.created_at).getTime();
      pathCount.set(row.path, (pathCount.get(row.path) ?? 0) + 1);
      deviceCount.set(
        row.device ?? 'unknown',
        (deviceCount.get(row.device ?? 'unknown') ?? 0) + 1,
      );
      dayCount.set(isoDay(ts), (dayCount.get(isoDay(ts)) ?? 0) + 1);
      if (row.visitor) visitors.add(row.visitor);
    }

    const days = [...dayCount.entries()]
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total30d: rows.length,
      total7d: rows.filter((r) => new Date(r.created_at).getTime() >= seven).length,
      uniques30d: visitors.size,
      topPaths: [...pathCount.entries()]
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 15),
      devices: [...deviceCount.entries()]
        .map(([device, views]) => ({ device, views }))
        .sort((a, b) => b.views - a.views),
      days,
    };
  } catch {
    return empty;
  }
}