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
