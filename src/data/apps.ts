import downloadCounts from './download-counts.json';

const countsBySlug: Record<string, { display: string }> = downloadCounts;
const getDownloadCount = (slug: string, fallback = '0') => countsBySlug[slug]?.display ?? fallback;

export type AppProject = {
  slug: string;
  name: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  icon: string;
  screenshots: string[];
  status: string;
  downloads: string;
  highlights: string[];
  detailHighlights: string[];
  links: {
    label: string;
    href: string;
  }[];
};

export const apps: AppProject[] = [
  {
    slug: 'pgnify',
    name: 'Pgnify: Chess Analysis & Stats',
    eyebrow: 'Local chess analysis',
    shortDescription:
      'Review your games on your device, practice your own mistakes, and explore top players.',
    description:
      'Pgnify turns Chess.com games and PGN files into private, on-device analysis with the Arasan chess engine. Find the moves that cost you, see the engine’s top lines, practice the positions you got wrong, track your accuracy over time, and explore the world’s titled players on iPhone, iPad, and Android.',
    icon: '/assets/pgnify/icon.png',
    screenshots: [
      '/assets/pgnify/screenshot-1.png',
      '/assets/pgnify/screenshot-2.png',
      '/assets/pgnify/screenshot-3.png'
    ],
    status: 'Preparing for beta on iOS and Android',
    downloads: '0',
    highlights: ['Local engine', 'Practice mistakes', 'Accuracy trend', 'Player stats'],
    detailHighlights: [
      'Sync a public Chess.com username or import a PGN, with no Chess.com password and no account.',
      'Analyze games privately on your device: move ratings, an evaluation bar, the engine’s top lines, and Explore mode.',
      'Practice positions from your own mistakes, follow your accuracy and recurring weaknesses, and browse titled players’ ratings and recent games.'
    ],
    links: []
  },
  {
    slug: 'nyc-government-jobs',
    name: 'NYC Government Job Tracker',
    eyebrow: 'NYC job search',
    shortDescription: 'Search, save, filter, and track New York City government job opportunities.',
    description:
      'NYC Government Job Tracker helps job seekers explore New York City government openings with focused filters, saved jobs, hiring insights, alerts, reminders, and optional cloud sync.',
    icon: '/assets/nyc-government-jobs/icon.png',
    screenshots: [
      '/assets/nyc-government-jobs/screenshot-1.png',
      '/assets/nyc-government-jobs/screenshot-2.png',
      '/assets/nyc-government-jobs/screenshot-3.png'
    ],
    status: 'Available on iOS and Android',
    downloads: getDownloadCount('nyc-government-jobs', '10+'),
    highlights: ['Focused filters', 'Job alerts', 'Saved jobs', 'Hiring insights'],
    detailHighlights: [
      'Search NYC government openings by keyword, agency, location, career level, salary, posting date, and more.',
      'Save jobs and searches, create alerts, and set reminders for opportunities that are closing soon.',
      'Explore hiring trends and work locations using current NYC Open Data.'
    ],
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/nyc-government-job-tracker/id6791472621'
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.restart.nycjobs'
      }
    ]
  },
  {
    slug: 'gsa-auction-finder',
    name: 'GSA Auction Finder',
    eyebrow: 'Federal auction discovery',
    shortDescription: 'Search, save, compare, and monitor public GSA auction listings.',
    description:
      'GSA Auction Finder helps buyers discover public GSA Auctions listings, search and filter by category, state, bid, deadline, agency, and nearby ZIP area, then save listings, compare options, and open the official listing to bid or buy.',
    icon: '/assets/gsa-auction-finder/icon.png',
    screenshots: [
      '/assets/gsa-auction-finder/screenshot-1.png',
      '/assets/gsa-auction-finder/screenshot-2.png',
      '/assets/gsa-auction-finder/screenshot-3.png'
    ],
    status: 'Available on Android',
    downloads: getDownloadCount('gsa-auction-finder', '1+'),
    highlights: ['Auction search', 'Saved listings', 'Comparisons', 'Alerts'],
    detailHighlights: [
      'Search public GSA Auctions listings with filters for category, state, status, bid range, ending window, bidders, agency, reserve details, and ZIP-area distance.',
      'Save listings, personal notes, searches, and ZIP locations locally, then compare auction details side by side.',
      'Use best-effort daily alerts, notification health, official listing links, and Pro options for more alerts and an ad-free experience.'
    ],
    links: [
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.restart.gsaauctionfinder'
      }
    ]
  },
  {
    slug: 'gsa-per-diem',
    name: 'US Per Diem',
    eyebrow: 'Travel rate lookup',
    shortDescription: 'Look up GSA per diem rates, review lodging and M&IE, and generate travel expense reports.',
    description:
      'US Per Diem helps travelers look up GSA lodging and meals and incidental expense rates by fiscal year, state, city, county, or ZIP code, then generate per diem expense reports for trips.',
    icon: '/assets/gsa-per-diem/icon.png',
    screenshots: [
      '/assets/gsa-per-diem/screenshot-1-v2.png',
      '/assets/gsa-per-diem/screenshot-2-v2.png',
      '/assets/gsa-per-diem/screenshot-3-v2.png'
    ],
    status: 'Available on iOS and Android',
    downloads: getDownloadCount('gsa-per-diem', '1K+'),
    highlights: ['GSA rates', 'Trip reports', 'M&IE breakdowns', 'Favorites'],
    detailHighlights: [
      'Look up GSA per diem rates by fiscal year, state, city, county, or ZIP code.',
      'Review lodging rates, meals and incidental expenses, and first and last day calculations.',
      'Generate per diem expense reports for travel dates using current GSA rate data.'
    ],
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/gsa-per-diem/id6779188397'
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.restart.gsaperdiem'
      }
    ]
  },
  {
    slug: 'usajobs',
    name: 'USAJobs',
    eyebrow: 'Federal job search',
    shortDescription: 'Search, save, filter, and track federal job opportunities with alerts that keep you moving.',
    description:
      'USAJobs helps job seekers explore federal openings with focused filters, saved jobs, alert digests, synced activity, and reminders for jobs that are closing soon.',
    icon: '/assets/usajobs/icon.png',
    screenshots: [
      '/assets/usajobs/screenshot-1.png',
      '/assets/usajobs/screenshot-2.png',
      '/assets/usajobs/screenshot-3.png'
    ],
    status: 'Available on iOS and Android',
    downloads: getDownloadCount('usajobs', '1K+'),
    highlights: ['Advanced filters', 'Job alerts', 'Saved jobs', 'Cloud sync'],
    detailHighlights: [
      'Build precise federal job searches with location, agency, schedule, pay, remote, and hiring path filters.',
      'Save jobs and searches so signed-in users can continue across devices.',
      'Get alert notifications with the newest matching jobs ready to review.'
    ],
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/usajobs-federal-job-tracker/id6771679907'
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.restart.usajobs'
      }
    ]
  },
  {
    slug: 'iss-tracker',
    name: 'ISS Tracker',
    eyebrow: 'Space station tracking',
    shortDescription: 'Track the International Space Station and see upcoming visible passes from your location.',
    description:
      'ISS Tracker gives space fans a clear way to follow the station, explore current position data, and plan when to look up for visible passes.',
    icon: '/assets/iss-tracker/icon.png',
    screenshots: [
      '/assets/iss-tracker/screenshot-1.png',
      '/assets/iss-tracker/screenshot-2.png',
      '/assets/iss-tracker/screenshot-3.png'
    ],
    status: 'Available on iOS and Android',
    downloads: getDownloadCount('iss-tracker', '10K+'),
    highlights: ['Live tracking', 'Visible passes', 'Location aware', 'Space details'],
    detailHighlights: [
      'Follow the International Space Station with an interface designed around quick, readable tracking.',
      'Check pass timing and viewing context from your current location.',
      'Learn more about the station with supporting mission and astronaut details.'
    ],
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/iss-tracker-orbit-passes/id6803000019'
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.restart.spacestationtracker'
      }
    ]
  }
];

export function getAppBySlug(slug: string) {
  return apps.find((app) => app.slug === slug);
}

/** Download display strings ("10K+", "1M+", "0") as a number, for sorting and totals. */
export function getDownloadValue(downloads: string) {
  const normalized = downloads.trim().toUpperCase().replace('+', '');
  const multiplier = normalized.endsWith('K') ? 1_000 : normalized.endsWith('M') ? 1_000_000 : 1;
  return Number.parseFloat(normalized.replace(/[KM]/g, '')) * multiplier;
}

/**
 * How an app's store status is shown on cards and its page: "Coming soon" before launch, "New"
 * while it has fewer than 100 downloads, and the download count after that.
 */
export function getAvailability(app: AppProject) {
  const downloads = getDownloadValue(app.downloads);
  if (downloads === 0) return { tone: 'soon', badge: 'Coming soon', value: 'Coming soon', label: 'Store launch' };
  if (downloads < 100) return { tone: 'new', badge: 'New', value: 'New', label: 'On the stores' };
  return { tone: 'live', badge: `${app.downloads} downloads`, value: app.downloads, label: 'Downloads' };
}
