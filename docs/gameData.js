const gameData = {
  version: '2024-09-content-lock',
  teacherMode: {
    label: 'Teacher mode',
    description:
      'Reveal the canonical prompts, expected answers, and rationales for quick fidelity checks during live use.',
  },
  rooms: [
    {
      id: 'vocab',
      title: 'Vocabulary Vault',
      tag: 'Match & Unlock',
      objective: 'Match each target word to its definition using context clues.',
      narrative: 'The vault scanner hums. Only the exact word-definition pairings will light up the lock sequence.',
      dataset: {
        words: [
          { id: 'reluctant', label: 'Reluctant', definition: 'Hesitant or unwilling to do something right away.' },
          { id: 'intricate', label: 'Intricate', definition: 'Very detailed or complicated with many connected parts.' },
          { id: 'ascend', label: 'Ascend', definition: 'To move or climb upward.' },
          { id: 'confer', label: 'Confer', definition: 'To discuss ideas together to make a decision.' },
        ],
      },
      teacher: {
        expected: {
          reluctant: 'Reluctant → Hesitant or unwilling to do something right away.',
          intricate: 'Intricate → Very detailed or complicated with many connected parts.',
          ascend: 'Ascend → To move or climb upward.',
          confer: 'Confer → To discuss ideas together to make a decision.',
        },
        rationale: 'Words tie directly to the story arc (hesitation, complexity, upward motion, collaboration). Matching forces precise decoding of meaning.',
      },
    },
    {
      id: 'grammar',
      title: 'Grammar Detective Bureau',
      tag: 'Fix It',
      objective: 'Repair the flawed sentence while keeping the meaning intact.',
      narrative: 'A red-ink note slides across the desk. Clean grammar is the key to the next door.',
      dataset: {
        flawed:
          'the detective hurry through the report because the final clue were hidden in the last paragraph'
        ,
        exemplar:
          'The detective hurried through the report because the final clue was hidden in the last paragraph.',
      },
      teacher: {
        expected: 'Capitalize the sentence, fix verb tenses (hurried/was), and keep the causal “because” clause.',
        rationale: 'Focus is on subject-verb agreement and past tense consistency within a complex sentence.',
      },
    },
    {
      id: 'fig',
      title: 'Figurative Language Lab',
      tag: 'Identify',
      objective: 'Identify whether each clue is a simile, metaphor, or personification.',
      narrative: 'Glow markers flash on the wall—only the right figurative labels keep the lab lights on.',
      dataset: {
        prompts: [
          { id: 'flame', clue: 'The idea spread like wildfire through the squad.', answer: 'simile' },
          { id: 'thief', clue: 'Time is a thief that steals our chances.', answer: 'metaphor' },
          { id: 'alarm', clue: 'The alarm clock yelled at me to wake up.', answer: 'personification' },
        ],
      },
      teacher: {
        expected: {
          flame: 'Simile (uses "like" to compare the spread of an idea to wildfire).',
          thief: 'Metaphor (directly calls time a thief).',
          alarm: 'Personification (alarm clock performing a human action—yelling).',
        },
        rationale: 'Prompts cover three core types with signal words and direct/implied comparisons.',
      },
    },
    {
      id: 'synAnt',
      title: 'Synonym–Antonym Arena',
      tag: 'Double Duty',
      objective: 'Provide one synonym and one antonym for each target word.',
      narrative: 'Two pillars slide forward. Balance each word with an opposite and an ally to keep the arena stable.',
      dataset: {
        targets: [
          { word: 'brave', examples: { syn: 'courageous', ant: 'fearful' } },
          { word: 'fragile', examples: { syn: 'delicate', ant: 'sturdy' } },
        ],
      },
      teacher: {
        expected: 'Any grade-appropriate synonym/antonym pairs that preserve meaning (e.g., brave → courageous/fearful; fragile → delicate/sturdy).',
        rationale: 'Swapping “tiny” back to “fragile” aligns with the resilience/handle-with-care theme.',
      },
    },
    {
      id: 'story',
      title: 'Executive Story Spin',
      tag: 'Create',
      objective:
        'Write a 4–5 sentence micro-story including: a forest setting, the phrase “mysterious sound,” the word “reluctant,” and at least one simile.',
      narrative: 'The exit door glows. Only a complete, vivid brief will convince headquarters to open it.',
      dataset: {
        constraints: ['forest', 'mysterious sound', 'reluctant', 'simile'],
        simileBank: [
          'like a lantern cutting through fog',
          'as quick as a flash of lightning',
          'as cautious as a cat on a ledge',
          'like whispers weaving through trees',
        ],
        rubric:
          '4–5 sentences, meets all constraints, and uses a precise simile that fits the tone (not random).',
      },
      teacher: {
        expected:
          'Story must have 4–5 sentences, mention a forest, literally include “mysterious sound,” use the word “reluctant,” and contain at least one simile (like/as).',
        rationale: 'Auto-checker guards the constraints so the writing task measures craft, not just length.',
      },
    },
  ],
  pools: {
    vocabularySets: [
      [
        { id: 'reluctant', label: 'Reluctant', definition: 'Hesitant or unwilling to do something right away.' },
        { id: 'intricate', label: 'Intricate', definition: 'Very detailed or complicated with many connected parts.' },
        { id: 'ascend', label: 'Ascend', definition: 'To move or climb upward.' },
        { id: 'confer', label: 'Confer', definition: 'To discuss ideas together to make a decision.' },
      ],
      [
        { id: 'resilient', label: 'Resilient', definition: 'Able to bounce back or recover quickly.' },
        { id: 'eerie', label: 'Eerie', definition: 'Strange in a way that causes unease.' },
        { id: 'precise', label: 'Precise', definition: 'Exact and accurate in detail.' },
        { id: 'observe', label: 'Observe', definition: 'To notice or watch carefully.' },
      ],
    ],
    grammarPrompts: [
      {
        flawed: 'the detective hurry through the report because the final clue were hidden in the last paragraph',
        exemplar: 'The detective hurried through the report because the final clue was hidden in the last paragraph.',
      },
      {
        flawed: 'because the signal were weak the team dont notice the final message on the radio',
        exemplar: 'Because the signal was weak, the team did not notice the final message on the radio.',
      },
    ],
    figurativeSets: [
      [
        { id: 'flame', clue: 'The idea spread like wildfire through the squad.', answer: 'simile' },
        { id: 'thief', clue: 'Time is a thief that steals our chances.', answer: 'metaphor' },
        { id: 'alarm', clue: 'The alarm clock yelled at me to wake up.', answer: 'personification' },
      ],
      [
        { id: 'shadow', clue: 'Doubt crept into the room and sat beside us.', answer: 'personification' },
        { id: 'ice', clue: 'Her stare was as icy as winter wind.', answer: 'simile' },
        { id: 'anchor', clue: 'Hope is the anchor that held the crew steady.', answer: 'metaphor' },
      ],
    ],
    synonymTargets: [
      [
        { word: 'brave', examples: { syn: 'courageous', ant: 'fearful' } },
        { word: 'fragile', examples: { syn: 'delicate', ant: 'sturdy' } },
      ],
      [
        { word: 'curious', examples: { syn: 'inquisitive', ant: 'uninterested' } },
        { word: 'sturdy', examples: { syn: 'strong', ant: 'weak' } },
      ],
    ],
    simileBank: [
      'like a flashlight cutting through smoke',
      'as steady as a metronome',
      'as restless as leaves in a storm',
      'like clues scattering across a desk',
    ],
  },
};
