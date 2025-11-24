export type KidTheme = {
  id: string;
  name: string;
  description: string;
  starterPrompts: string[];
  guardrail: string;
};

export const kidThemes: KidTheme[] = [
  {
    id: 'school-life',
    name: 'School life',
    description: 'Hallway routines, lunch swaps, club meetings, and science fair moments.',
    starterPrompts: [
      'Write a hallway announcement reminding your class to line up before the bell rings.',
      'Describe a lunch table conversation that turns into a plan for the talent show.',
      'Tell a quick story about helping a new student find their next classroom.'
    ],
    guardrail: 'Keep it friendly and school-safe: no gossip, shareable with families.'
  },
  {
    id: 'pets',
    name: 'Pets',
    description: 'Caring for cats, dogs, lizards, and every classroom critter.',
    starterPrompts: [
      'Write a note to a neighbor explaining how to feed your pet while you are on a field trip.',
      'Describe a funny moment when a pet tried to join a video call or homework session.',
      'Imagine a classroom pet giving advice to nervous test-takers.'
    ],
    guardrail: 'Stay lighthearted and safe for all readers.'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Team warm-ups, pep talks, and learning a new skill.',
    starterPrompts: [
      'Write a short pep talk to a teammate trying a new position for the first time.',
      'Describe the sounds and feelings during the last minute of a close game.',
      'Create a plan for teaching a younger student how to dribble, pass, or serve.'
    ],
    guardrail: 'Keep competition kind and focused on growth.'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Friendly dragons, hidden doors, and maps drawn in notebook margins.',
    starterPrompts: [
      'Write a backpack inventory for a student who discovers a secret tunnel under the library.',
      'Describe a dragon who prefers doing homework over guarding treasure.',
      'Explain how a group of friends use a magic key to sneak into a midnight study room.'
    ],
    guardrail: 'Adventures stay cooperative and age-appropriate.'
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Calm missions, curious astronauts, and classroom-made rockets.',
    starterPrompts: [
      'Write mission instructions for a crew of sixth graders exploring a quiet moon base.',
      'Describe the view from a classroom window on a ship traveling to Mars.',
      'Explain how the crew works together when a plant experiment needs extra care.'
    ],
    guardrail: 'No scary hazards; focus on teamwork and curiosity.'
  },
  {
    id: 'superheroes',
    name: 'Superheroes',
    description: 'Everyday heroes who use their powers to help classmates.',
    starterPrompts: [
      'Write a quick comic panel where a hero uses super-listening to help a shy student share.',
      'Describe a hero whose only power is returning lost homework in seconds.',
      'Explain how a team of heroes uses kindness to calm a noisy cafeteria.'
    ],
    guardrail: 'Powers are positive, safe, and school-friendly.'
  }
];
