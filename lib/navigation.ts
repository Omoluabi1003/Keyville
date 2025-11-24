export const brand = {
  appName: 'KEYVILLE',
  organization: 'ETL GIS Consulting LLC',
  byline: 'KEYVILLE — project by ETL GIS Consulting LLC'
};

export type RouteConfig = {
  href: string;
  label: string;
  description?: string;
  ctaLabel?: string;
};

export const routes: RouteConfig[] = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Play a Quest' },
  { href: '/students', label: 'Study Tips' },
  { href: '/storycraft', label: 'Storycraft' }
];

export const siteMetadata = {
  title: `${brand.appName} — project by ${brand.organization} | Writing Growth through Playful Practice`,
  description:
    `${brand.appName}, built as a project by ${brand.organization}, helps students strengthen writing stamina and feedback loops through guided room rotations, dashboards, and secure district workflows.`,
  openGraph: {
    title: `${brand.appName} — project by ${brand.organization} | Writing Growth through Playful Practice`,
    description:
      `Room-rotation writing practice, teacher dashboards, governance-ready privacy and security posture for districts, delivered as a ${brand.organization} project.`,
    url: 'https://etl-gis.com',
    siteName: `${brand.appName} · ${brand.organization}`,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.appName} — project by ${brand.organization} for districts, teachers, and students`,
    description: `Interactive writing practice with AI feedback and telemetry built for schools, created by ${brand.organization}.`
  }
};

export const heroStats = [
  { label: 'Quick quests finished', value: '42k', detail: 'Short rounds keep focus strong' },
  { label: 'Average session', value: '10 minutes', detail: 'Fast to start, easy to pause' },
  { label: 'Friendly feedback', value: 'Instant tips', detail: 'Hints, not grades' }
];

export const caseStudies = [
  {
    name: 'Maya, 6th grader',
    dates: '3 weeks of practice',
    outcomes: ['Used “Story Sprint” to finish homework on time', 'Turned feedback into two quick edits', 'Stayed focused without feeling rushed'],
    quote: 'The quests felt like levels in a game. I fixed my story faster because the hints were short.',
    role: 'Student writer'
  },
  {
    name: 'Mr. Carter’s ELA class',
    dates: '2 class periods',
    outcomes: ['Everyone finished a paragraph quest', 'Students swapped kind feedback cards', 'Less screen hopping and fewer tabs'],
    quote: 'My students felt safe to try, edit, and try again because the steps were simple.',
    role: '6th grade teacher'
  }
];

export const sandboxChallenge = {
  prompt: 'Rotate into the “Perspective Flip” room and rewrite this sentence from the antagonist’s viewpoint: “The gate creaked as the heroes approached.”',
  scaffolds: ['Who is the antagonist?', 'What do they fear losing?', 'How do they describe the heroes?'],
  sampleResponse: 'The gate groaned, warning me as the intruders crept closer, their bright armor an insult to the shadows I kept safe.',
  aiFeedback: {
    highlights: ['Voice matches antagonist perspective', 'Concrete detail: “bright armor” gives context', 'Sense of ownership over “shadows” shows motive'],
    nextStep: 'Add a sensory detail to emphasize tension (sound or smell) and a feeling that shows vulnerability.'
  },
  telemetry: [
    { metric: 'Words written', value: '62', benchmark: '40-70 target band' },
    { metric: 'Feedback latency', value: '3.2s', benchmark: '<5s for flow' },
    { metric: 'Revision loop', value: '2 passes', benchmark: '2-3 passes recommended' }
  ]
};
