/**
 * Official team crests — sourced from the club's media library and the
 * official Sulombatimbo/sulommw.com broadcaster imagery. Keys are the exact
 * team names used across fixtures, results and standings in lib/data.ts.
 */

const TEAM_LOGO_MAP: Record<string, string> = {
  ekhaya: '/branding/ekhaya-logo.jpg',
  'big bullets': '/teams/big-bullets.jpg',
  'mighty wanderers': '/teams/mighty-wanderers.png',
  'silver strikers': '/teams/silver-strikers.png',
  'blue eagles': '/teams/blue-eagles.jpg',
  'masters fc': '/teams/masters-fc.jpg',
  'moyale barracks': '/teams/moyale-barracks.jpg',
  'chitipa united': '/teams/chitipa-united.jpg',
  'red lions': '/teams/red-lions.png',
  'civo utd': '/teams/civil-club.jpg',
  'civo': '/teams/civil-club.jpg',
  'civil service united': '/teams/civil-club.jpg',
  'mitundu baptist': '/teams/mitundu-baptist.jpg',
  'karonga united': '/teams/karonga-united.jpg',
  'dedza dynamos': '/teams/dedza-dynamos.jpg',
  mafco: '/teams/mafco.jpg',
  'kamuzu barracks': '/teams/kamuzu-barracks.jpg',
  'creck sporting': '/teams/creck-sporting.png',
};

/** Returns the logo path for a club name, or null when no crest is available. */
export function teamLogoSrc(teamName: string): string | null {
  const key = teamName.trim().toLowerCase();
  return TEAM_LOGO_MAP[key] ?? null;
}