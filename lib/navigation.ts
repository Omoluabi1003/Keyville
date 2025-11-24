export type RouteConfig = {
  href: string;
  label: string;
  description?: string;
  ctaLabel?: string;
};

export const routes: RouteConfig[] = [
  { href: '/', label: 'Landing' },
  { href: '/experience', label: 'Experience' },
  { href: '/students', label: 'Students' },
  { href: '/teacher', label: 'Teacher' },
  { href: '/storycraft', label: 'Storycraft' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/security', label: 'Security' }
];

export const siteMetadata = {
  title: 'Keyville | Writing Growth through Playful Practice',
  description:
    'Keyville helps students strengthen writing stamina and feedback loops through guided room rotations, dashboards, and secure district workflows.',
  openGraph: {
    title: 'Keyville | Writing Growth through Playful Practice',
    description:
      'Room-rotation writing practice, teacher dashboards, governance-ready privacy and security posture for districts.',
    url: 'https://keyville.app',
    siteName: 'Keyville',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyville for districts, teachers, and students',
    description: 'Interactive writing practice with AI feedback and telemetry built for schools.'
  }
};

export const heroStats = [
  { label: 'Micro-challenges completed', value: '42k', detail: '+1.8x writing stamina' },
  { label: 'District pilots', value: '12', detail: 'Spanning 4 states' },
  { label: 'Teacher hours saved', value: '3.2h/wk', detail: 'Reduced manual scoring' }
];

export const caseStudies = [
  {
    name: 'Hudson Valley Pilot',
    dates: 'Fall 2023',
    outcomes: ['+24% completion', '2x formative feedback coverage', 'Universal Design for Learning alignment'],
    quote: 'Keyville made room rotations less chaotic and gave my students a voice in feedback.',
    role: '6th grade ELA teacher'
  },
  {
    name: 'Great Lakes District',
    dates: 'Spring 2024',
    outcomes: ['Writing samples ready for state reporting', 'Roster sync in 48 hours', 'Students self-reflected weekly'],
    quote: 'We saw writing volume jump without increasing screen fatigue.',
    role: 'Director of Curriculum'
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
