export interface SentenceCompletionEnhancements {
  version: string;
  updated: string;
  features: Feature[];
  rolloutPlan: RolloutPlan;
  comfortToggleIntegration: ComfortToggleIntegration;
}

export interface Feature {
  id: string;
  title: string;
  status: string;
  effort: string;
  impact: string;
  description: string;
  toggleKey: string;
  defaultEnabled: boolean;
  config: Config;
  wordBankRequirements?: WordBankRequirements;
  analyticsEvents: string[];
  screenPosition?: string;
  templateExamples?: TemplateExample[];
  requiresOptIn?: boolean;
  privacyNote?: string;
}

export interface Config {
  pauseMs?: number;
  maxSuggestions?: number;
  matchStrategy?: string;
  animation?: string;
  showSparklesOnInsert?: boolean;
  voiceAnnounce?: boolean;
  allowSkip?: boolean;
  slotsHighlightColor?: string;
  successSound?: string;
  mismatchAnimation?: string;
  autoPopulateOnComplete?: boolean;
  badgeOnFullBuild?: string;
  provider?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  showSourceBadge?: boolean;
  allowRemix?: boolean;
  cacheLocally?: boolean;
}

export interface WordBankRequirements {
  needsTags: string[];
  exampleTags: ExampleTags;
}

export interface ExampleTags {
  treasure: string[];
  whispered: string[];
  glowing: string[];
}

export interface TemplateExample {
  questTheme: string;
  template: string;
  slots: Slot[];
}

export interface Slot {
  index: number;
  placeholder: string;
  expectedType: string;
  hint: string;
}

export interface RolloutPlan {
  phase1: string[];
  phase2: string[];
  phase3: string[];
}

export interface ComfortToggleIntegration {
  autoSuggest: string;
  sentenceBuilder: string;
  aiCompletion: string;
}

export const sentenceCompletionEnhancements: SentenceCompletionEnhancements = {
  version: '1.0.0',
  updated: '2025-11-25',
  features: [
    {
      id: 'autoSuggest',
      title: 'Contextual Auto-Suggest',
      status: 'ready',
      effort: 'low',
      impact: 'high',
      description:
        "Dynamically filters and ranks word-bank pills based on the user's current partial sentence. Appears after 2-second pause.",
      toggleKey: 'enableAutoSuggest',
      defaultEnabled: true,
      config: {
        pauseMs: 2000,
        maxSuggestions: 5,
        matchStrategy: 'keyword+type',
        animation: 'fadeInUp',
        showSparklesOnInsert: true,
        voiceAnnounce: true
      },
      wordBankRequirements: {
        needsTags: ['noun', 'verb', 'adjective', 'adverb', 'emotion', 'setting'],
        exampleTags: {
          treasure: ['noun', 'adventure'],
          whispered: ['verb', 'mysterious'],
          glowing: ['adjective', 'magical']
        }
      },
      analyticsEvents: ['auto_suggest_shown', 'auto_suggest_inserted', 'auto_suggest_ignored']
    },
    {
      id: 'sentenceBuilder',
      title: 'Drag-and-Drop Sentence Builder',
      status: 'ready',
      effort: 'medium',
      impact: 'high',
      description:
        'Optional pre-writing mini-game where kids drag words into glowing sentence slots. Completed sentence becomes editable starter text.',
      toggleKey: 'enableSentenceBuilder',
      defaultEnabled: true,
      screenPosition: 'beforeTimer',
      config: {
        allowSkip: true,
        slotsHighlightColor: '#7c3aed',
        successSound: '/audio/success-chime.mp3',
        mismatchAnimation: 'shake',
        autoPopulateOnComplete: true,
        badgeOnFullBuild: 'sentence-architect'
      },
      templateExamples: [
        {
          questTheme: 'meteorMail',
          template: 'The _ fell from the _ making a _ sound.',
          slots: [
            { index: 0, placeholder: '_____', expectedType: 'noun', hint: 'something from space' },
            { index: 1, placeholder: '_____', expectedType: 'noun', hint: 'where it came from' },
            { index: 2, placeholder: '_____', expectedType: 'adjective', hint: 'how it sounded' }
          ]
        }
      ],
      analyticsEvents: ['builder_started', 'builder_completed', 'builder_skipped', 'builder_wrong_drop']
    },
    {
      id: 'aiCompletion',
      title: 'AI-Powered Adaptive Completion',
      status: 'beta',
      effort: 'high',
      impact: 'very-high',
      description:
        'Lightweight on-device or edge AI suggests 2–3 vivid sentence continuations, learns from user edits/rejections.',
      toggleKey: 'enableAICompletion',
  defaultEnabled: false,
      requiresOptIn: true,
      config: {
        provider: 'vercel-ai',
        model: 'gpt-4o-mini',
        maxTokens: 25,
        temperature: 0.8,
        systemPrompt:
          'You are a friendly creative writing helper for 6th graders. Keep suggestions exciting, age-appropriate (no violence/scary themes), and under 12 words.',
        showSourceBadge: true,
        allowRemix: true,
        cacheLocally: true
      },
      privacyNote: 'All processing happens on-device or via anonymized edge request. No text is stored.',
      analyticsEvents: ['ai_completion_requested', 'ai_completion_used', 'ai_completion_edited', 'ai_completion_rejected']
    }
  ],
  rolloutPlan: {
    phase1: ['autoSuggest'],
    phase2: ['autoSuggest', 'sentenceBuilder'],
    phase3: ['autoSuggest', 'sentenceBuilder', 'aiCompletion']
  },
  comfortToggleIntegration: {
    autoSuggest: 'Show smart word suggestions',
    sentenceBuilder: 'Play sentence builder game first',
    aiCompletion: 'Magic AI sentence helper (beta)'
  }
};
