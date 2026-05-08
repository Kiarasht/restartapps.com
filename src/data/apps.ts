export type AppProject = {
  slug: string;
  name: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  icon: string;
  screenshots: string[];
  status: string;
  platforms: string[];
  highlights: string[];
  detailHighlights: string[];
  links: {
    label: string;
    href: string;
  }[];
};

export const apps: AppProject[] = [
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
    status: 'Available on Android',
    platforms: ['Android', 'Google Play', 'Galaxy Store'],
    highlights: ['Advanced filters', 'Job alerts', 'Saved jobs', 'Cloud sync'],
    detailHighlights: [
      'Build precise federal job searches with location, agency, schedule, pay, remote, and hiring path filters.',
      'Save jobs and searches so signed-in users can continue across devices.',
      'Get alert notifications with the newest matching jobs ready to review.'
    ],
    links: [
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
    status: 'Available on Android',
    platforms: ['Android', 'Google Play'],
    highlights: ['Live tracking', 'Visible passes', 'Location aware', 'Space details'],
    detailHighlights: [
      'Follow the International Space Station with an interface designed around quick, readable tracking.',
      'Check pass timing and viewing context from your current location.',
      'Learn more about the station with supporting mission and astronaut details.'
    ],
    links: [
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
