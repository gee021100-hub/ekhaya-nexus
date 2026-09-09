export interface TierDefinition {
  code: string;
  name: string;
  tagline: string;
  priceMwk: number;
  priceIsMinimum: boolean;
  periodLabel: string;
  benefits: string[];
  highlight?: string;
}

export const TIER_DEFINITIONS: TierDefinition[] = [
  {
    code: 'bronze',
    name: 'Bronze',
    tagline: 'The essentials',
    priceMwk: 10000,
    priceIsMinimum: false,
    periodLabel: '/year',
    benefits: [
      'Digital / printed card',
      'Member number',
      'Newsletter',
      'Birthday message',
      '5% merchandise discount',
    ],
  },
  {
    code: 'silver',
    name: 'Silver',
    tagline: 'Most popular',
    priceMwk: 50000,
    priceIsMinimum: false,
    periodLabel: '/year',
    highlight: 'Most popular',
    benefits: [
      'All Bronze benefits',
      'Welcome pack',
      '10% merchandise discount',
      'Priority ticket access',
    ],
  },
  {
    code: 'gold',
    name: 'Gold',
    tagline: 'For the faithful',
    priceMwk: 250000,
    priceIsMinimum: false,
    periodLabel: '/year',
    benefits: [
      'All Silver benefits',
      'Club-event access',
      'Premium gift',
      'Member recognition',
      '15% merchandise discount',
    ],
  },
  {
    code: 'platinum',
    name: 'Platinum',
    tagline: 'VIP supporter',
    priceMwk: 500000,
    priceIsMinimum: true,
    periodLabel: '+/year',
    benefits: [
      'VIP recognition',
      'Premium benefits defined by management',
      'Priority everything',
    ],
  },
];

export const TIER_CODES = TIER_DEFINITIONS.map((t) => t.code);

export function getTierDefinition(code: string | null | undefined): TierDefinition | undefined {
  return TIER_DEFINITIONS.find((t) => t.code === code);
}