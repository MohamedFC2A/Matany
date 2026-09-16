// ============================================================================
// FATHOM ITS 1 — SYSTEM TYPE DEFINITIONS & SCHEMAS
// ============================================================================

export type TargetLanguageCode = 'en' | 'fr' | 'de' | 'es' | 'ja' | 'it' | 'zh';

export interface TargetLanguage {
  code: TargetLanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  isAvailable: boolean;
  statusText?: string;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface CEFRLevelInfo {
  level: CEFRLevel;
  title: string;
  cambridgeExam: string;
  cambridgeScaleRange: [number, number];
  description: string;
  requiredHoursBase: number;
}

export interface TutorVoice {
  id: string; // ElevenLabs Voice ID
  name: string;
  avatar: string;
  accent: string;
  gender: 'male' | 'female';
  roleTitle: string;
  description: string;
  previewText: string;
  audioSampleCache?: string; // Base64 or Blob URL
}

export const CURATED_TUTOR_VOICES: TutorVoice[] = [
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    avatar: '🇬🇧',
    accent: 'British RP (Cambridge/Oxford Standard)',
    gender: 'male',
    roleTitle: 'Cambridge Academic & Phonetics Coach',
    description: 'نبرة أكاديمية بريطانية فصحى، رصينة ووقورة، مثالية لإتقان النطق ومخارج الحروف وقواعد كامبريدج.',
    previewText: 'Good day! I am George, your Cambridge academic mentor at Fathom ITS 1. Are you prepared to elevate your English to native precision?'
  },
  {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    name: 'Alice',
    avatar: '👩‍🏫',
    accent: 'British Educated Standard',
    gender: 'female',
    roleTitle: 'Pedagogical Fluency & Grammar Specialist',
    description: 'معلمة بريطانية واضحة المخارج ونقية الإيقاع، ممتازة في تفكيك القواعد المعقدة وبناء الثقة اللغوية.',
    previewText: 'Hello! I am Alice. Together, we will master grammar, expand your vocabulary, and build unshakable fluency step by step.'
  },
  {
    id: 'XrExE9yKIg1WjnnlVkGX',
    name: 'Matilda',
    avatar: '🎓',
    accent: 'American Academic Standard',
    gender: 'female',
    roleTitle: 'Advanced Syntax & CEFR Examiner',
    description: 'مدربة لغوية أمريكية متخصصة في التحليل النحوي الدقيق، صبورة وعميقة التفسير.',
    previewText: 'Greetings! I am Matilda. Let us systematically diagnose your current language level and engineer your path to C2 mastery.'
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    avatar: '🌟',
    accent: 'General American Conversational',
    gender: 'female',
    roleTitle: 'Natural Fluency & Idiomatic Expression Coach',
    description: 'أسلوب تفاعلي حيوي ودافئ، تركز على المحادثة الطبيعية وتصحيح التراكيب اللفظية الواقعية.',
    previewText: 'Hi there! I am Sarah. You and I are going to transform the way you speak, making everyday conversations effortless and natural.'
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD',
    name: 'Charlie',
    avatar: '🌏',
    accent: 'Australian Articulate Standard',
    gender: 'male',
    roleTitle: 'Interactive Communication & Nuance Trainer',
    description: 'نبرة عميقة وجذابة، بارع في توضيح الفروق الدقيقة بين الكلمات والمصطلحات المتقدمة.',
    previewText: 'G day! I am Charlie. Precision and clarity are our targets. Let us sharpen your listening and speaking instincts right now.'
  },
  {
    id: 'hpp4J3VqNfWAUOO0d1Us',
    name: 'Bella',
    avatar: '✨',
    accent: 'American Professional Standard',
    gender: 'female',
    roleTitle: 'Phonetics & Articulation Specialist',
    description: 'نبرة مشرقة ودقيقة جداً، تركز على تدريب الأذن والتصحيح الفونيتيكي للأصوات الصعبة.',
    previewText: 'Welcome! I am Bella. We will polish your pronunciation, sentence structure, and listening comprehension point by point.'
  },
  {
    id: 'N2lVS1w4EtoT3dr4eOWO',
    name: 'Callum',
    avatar: '⚡',
    accent: 'Transatlantic Dynamic Cadence',
    gender: 'male',
    roleTitle: 'Rapid Conversational & Listening Coach',
    description: 'صوت ديناميكي رشيق ونقي، يدربك على سرعة الاستيعاب السمعي والرد التلقائي دون تردد.',
    previewText: 'Ready to challenge yourself? I am Callum. We will stretch your linguistic boundaries with real-world, high-speed dialogue.'
  }
];

export type QuestionCategory = 'grammar' | 'vocabulary' | 'listening' | 'discourse' | 'production';

export interface DiagnosticQuestion {
  id: string;
  category: QuestionCategory;
  cefrTarget: CEFRLevel;
  question: string;
  audioPromptText?: string; // Text spoken by tutor for listening comprehension
  options?: string[];
  correctIndex?: number;
  expectedKeywords?: string[]; // For open production
  explanation: string;
  weight: number;
}

export interface DiagnosticCategoryScore {
  score: number;
  total: number;
  percentage: number;
}

export interface DiagnosticResult {
  timestamp: string;
  rawScore: number;
  maxScore: number;
  percentage: number;
  cambridgeScale: number; // 80 - 230
  diagnosedLevel: CEFRLevel;
  subLevelString: string; // e.g. "B1.4"
  levelDescriptor: string;
  categoryScores: Record<QuestionCategory, DiagnosticCategoryScore>;
  strengths: string[];
  weaknesses: string[];
}

export interface GuidedLearningProjection {
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  totalGuidedHours: number;
  accelerated: {
    hoursPerDay: number;
    days: number;
    weeks: number;
  };
  steady: {
    hoursPerDay: number;
    months: number;
  };
  milestoneSteps: {
    fromLevel: CEFRLevel;
    toLevel: CEFRLevel;
    hours: number;
    description: string;
  }[];
}

export interface MSQQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pointsAwarded: number;
  userSelectedIndex?: number;
  isAnswered?: boolean;
}

export interface MSQExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
  points?: number;
}

export interface MSQExamSuite {
  id: string;
  title: string;
  description?: string;
  level: CEFRLevel | string;
  durationMinutes: number;
  passingScore?: number;
  questions: MSQExamQuestion[];
  totalPoints?: number;
}

export interface CorrectionCard {
  originalText: string;
  improvedText: string;
  ruleExplanation: string;
  category: 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Idiomatic Style';
}

export interface PointIncrementNotice {
  id: string;
  delta: number;
  reason: string;
  metric: 'Syntax' | 'Vocabulary' | 'Listening' | 'Fluency' | 'Quiz';
  timestamp: string;
}

export interface FathomITSMessage {
  id: string;
  role: 'tutor' | 'user' | 'system';
  content: string;
  timestamp: string;
  audioUrl?: string;
  isAudioPlaying?: boolean;
  msq?: MSQQuizItem;
  correction?: CorrectionCard;
  pointIncrement?: PointIncrementNotice;
}

export interface FathomITSStudentProfile {
  deviceId: string;
  userId?: string | null;
  targetLanguage: TargetLanguageCode;
  selectedVoice: TutorVoice;
  targetCEFR: CEFRLevel;
  currentCEFR: CEFRLevel;
  currentPoints: number;
  baselineAssessment?: DiagnosticResult | null;
  totalStudyMinutes: number;
  sessionsCompleted: number;
  quizzesSolved: number;
  lastActive: string;
  createdAt: string;
}

export type FathomITSFlowState = 'onboarding' | 'diagnostic' | 'roadmap' | 'tutoring';
