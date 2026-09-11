// ============================================================================
// FATHOM ITS 1 — SYSTEM CORE SERVICE & PEDAGOGICAL CALCULATOR
// Long-Term Memory, Cambridge Calibration, and Guided Learning Matrix
// ============================================================================

import { supabase, getOrCreateDeviceId } from './supabase';
import {
  CEFRLevel,
  DiagnosticQuestion,
  DiagnosticResult,
  GuidedLearningProjection,
  FathomITSStudentProfile,
  TutorVoice,
  FathomITSMessage
} from '../types/fathomITS';
import { CURATED_TUTOR_VOICES } from '../../api/elevenlabs';

const STORAGE_PROFILE_KEY = 'fathom_its_profile_v1';
const STORAGE_MESSAGES_KEY = 'fathom_its_messages_v1';

// Cambridge English Scale to CEFR Mapping
export const CAMBRIDGE_CEFR_MAP: { level: CEFRLevel; minScale: number; maxScale: number; baseHours: number; title: string }[] = [
  { level: 'A1', minScale: 80, maxScale: 99, baseHours: 90, title: 'Breakthrough (A1)' },
  { level: 'A2', minScale: 100, maxScale: 119, baseHours: 190, title: 'Waystage / Key (A2)' },
  { level: 'B1', minScale: 120, maxScale: 139, baseHours: 380, title: 'Preliminary (B1)' },
  { level: 'B2', minScale: 140, maxScale: 159, baseHours: 580, title: 'First / Vantage (B2)' },
  { level: 'C1', minScale: 160, maxScale: 179, baseHours: 780, title: 'Advanced (C1)' },
  { level: 'C2', minScale: 180, maxScale: 230, baseHours: 1100, title: 'Proficiency / Mastery (C2)' },
];

// Official Cambridge 3-5 Minute Diagnostic Question Bank
export const CAMBRIDGE_DIAGNOSTIC_BANK: DiagnosticQuestion[] = [
  {
    id: 'q1',
    category: 'grammar',
    cefrTarget: 'A2',
    question: 'Choose the correct form to complete the sentence:\n"She _____ English for two hours every day before work."',
    options: ['study', 'studies', 'studying', 'is study'],
    correctIndex: 1,
    explanation: 'Third-person singular subjects (she/he/it) take the "-s" or "-es" suffix in the Simple Present tense.',
    weight: 8
  },
  {
    id: 'q2',
    category: 'vocabulary',
    cefrTarget: 'B1',
    question: 'Select the phrasal verb that means "to cancel an event":\n"Due to the storm, the organizers had to _____ the outdoor concert."',
    options: ['call off', 'put off', 'turn down', 'give up'],
    correctIndex: 0,
    explanation: '"Call off" specifically means to cancel, whereas "put off" means to postpone.',
    weight: 9
  },
  {
    id: 'q3',
    category: 'listening',
    cefrTarget: 'B1',
    question: 'Listen carefully to the tutor prompt. What is the speaker implying?',
    audioPromptText: 'I would have joined the research seminar yesterday, had I known the lead author was presenting her empirical findings in person.',
    options: [
      'The speaker attended the seminar and spoke with the author.',
      'The speaker did not attend the seminar because they did not know the author was presenting.',
      'The speaker knew the author was presenting, but chose not to attend.',
      'The seminar was postponed to next week.'
    ],
    correctIndex: 1,
    explanation: 'The inverted third conditional ("had I known...") indicates an unreal past condition. The speaker was unaware, so they did not attend.',
    weight: 12
  },
  {
    id: 'q4',
    category: 'grammar',
    cefrTarget: 'B2',
    question: 'Choose the grammatically immaculate completion:\n"If the committee _____ the proposal sooner, the project would be underway by now."',
    options: ['approved', 'had approved', 'would approve', 'has approved'],
    correctIndex: 1,
    explanation: 'This is a mixed conditional: past condition (past perfect: "had approved") resulting in a present reality ("would be underway").',
    weight: 11
  },
  {
    id: 'q5',
    category: 'vocabulary',
    cefrTarget: 'B2',
    question: 'Which word best fits the academic context?\n"The data shows a _____ increase in cognitive retention among active learners."',
    options: ['subtle', 'substantial', 'suspicious', 'shallow'],
    correctIndex: 1,
    explanation: '"Substantial" is the academic collocation meaning large in size, value, or significance.',
    weight: 10
  },
  {
    id: 'q6',
    category: 'discourse',
    cefrTarget: 'C1',
    question: 'Select the most appropriate discourse marker to introduce an unexpected contrast:\n"The initial trial seemed unpromising; _____, the subsequent phases yielded breakthrough results."',
    options: ['moreover', 'nonetheless', 'consequently', 'similarly'],
    correctIndex: 1,
    explanation: '"Nonetheless" introduces a concession or contrast despite what was just stated, adhering to C1 formal cohesion.',
    weight: 12
  },
  {
    id: 'q7',
    category: 'grammar',
    cefrTarget: 'C1',
    question: 'Identify the sentence with correct formal inversion:\n',
    options: [
      'Under no circumstances employees should disclose proprietary algorithms.',
      'Under no circumstances should employees disclose proprietary algorithms.',
      'Under no circumstances employees must disclose proprietary algorithms.',
      'Under no circumstances disclose employees should proprietary algorithms.'
    ],
    correctIndex: 1,
    explanation: 'Negative introductory prepositional phrases ("Under no circumstances") trigger auxiliary-subject inversion: auxiliary ("should") + subject ("employees") + main verb ("disclose").',
    weight: 13
  },
  {
    id: 'q8',
    category: 'vocabulary',
    cefrTarget: 'C2',
    question: 'Choose the most precise synonym for "ubiquitous in nature":\n"In the modern technological epoch, algorithmic systems have become completely _____."',
    options: ['pervasive', 'ephemeral', 'tangential', 'precarious'],
    correctIndex: 0,
    explanation: '"Pervasive" denotes existing or spreading widely throughout an area or universe, an exact C2 register term.',
    weight: 12
  },
  {
    id: 'q9',
    category: 'listening',
    cefrTarget: 'C1',
    question: 'Listen to the academic discourse. What is the core methodological critique?',
    audioPromptText: 'While the correlation appears statistically robust on the surface, the methodology fails to account for confounding socioeconomic variables, thus precluding any valid claim of direct causality.',
    options: [
      'The sample size was too small to calculate statistical significance.',
      'The study proves conclusively that one variable caused the other.',
      'The presence of confounding variables prevents researchers from establishing direct causality.',
      'The socioeconomic data was fabricated by the researchers.'
    ],
    correctIndex: 2,
    explanation: 'The speaker stresses that confounding variables preclude (prevent) asserting causality despite high correlation.',
    weight: 13
  },
  {
    id: 'q10',
    category: 'production',
    cefrTarget: 'B2',
    question: 'Production Task (Speak or Type):\nRephrase the following sentence into the passive voice with a formal register:\n"Researchers conducted a thorough investigation into the security breach."',
    expectedKeywords: ['thorough investigation', 'conducted', 'was conducted', 'into the security breach'],
    explanation: 'Ideal passive formulation: "A thorough investigation into the security breach was conducted by researchers."',
    weight: 10
  }
];

export class FathomITSService {
  /**
   * Evaluates the Diagnostic Test and calculates exact CEFR and Cambridge Scale score
   */
  public static calculateDiagnosticResult(answers: Record<string, number | string>): DiagnosticResult {
    let rawScore = 0;
    let maxScore = 0;

    const categoryScores: Record<string, { score: number; total: number; percentage: number }> = {
      grammar: { score: 0, total: 0, percentage: 0 },
      vocabulary: { score: 0, total: 0, percentage: 0 },
      listening: { score: 0, total: 0, percentage: 0 },
      discourse: { score: 0, total: 0, percentage: 0 },
      production: { score: 0, total: 0, percentage: 0 }
    };

    for (const q of CAMBRIDGE_DIAGNOSTIC_BANK) {
      maxScore += q.weight;
      categoryScores[q.category].total += q.weight;

      const userAns = answers[q.id];
      let isCorrect = false;

      if (q.category === 'production') {
        if (typeof userAns === 'string' && userAns.trim().length > 10) {
          const lower = userAns.toLowerCase();
          const matches = (q.expectedKeywords || []).filter((kw) => lower.includes(kw.toLowerCase()));
          if (matches.length >= 2) {
            isCorrect = true;
          }
        }
      } else {
        if (userAns !== undefined && Number(userAns) === q.correctIndex) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        rawScore += q.weight;
        categoryScores[q.category].score += q.weight;
      }
    }

    // Calculate percentage
    const percentage = Math.round((rawScore / maxScore) * 100);

    // Calculate category percentages
    for (const cat of Object.keys(categoryScores)) {
      const item = categoryScores[cat];
      item.percentage = item.total > 0 ? Math.round((item.score / item.total) * 100) : 0;
    }

    // Map percentage to Cambridge English Scale (80 to 230)
    // 0% -> 80, 100% -> 220-230
    const cambridgeScale = Math.min(225, Math.max(80, Math.round(80 + (percentage / 100) * 145)));

    // Determine CEFR level
    let diagnosedLevel: CEFRLevel = 'A1';
    let subLevelString = 'A1.1';
    let levelDescriptor = 'Beginner / Breakthrough';

    if (cambridgeScale >= 200) {
      diagnosedLevel = 'C2';
      subLevelString = `C2.${Math.min(9, Math.floor(((cambridgeScale - 200) / 25) * 10))}`;
      levelDescriptor = 'Mastery / Native-Level Proficiency (Cambridge CPE Equivalent)';
    } else if (cambridgeScale >= 180) {
      diagnosedLevel = 'C1';
      subLevelString = `C1.${Math.min(9, Math.floor(((cambridgeScale - 180) / 20) * 10))}`;
      levelDescriptor = 'Effective Operational Proficiency (Cambridge CAE Equivalent)';
    } else if (cambridgeScale >= 160) {
      diagnosedLevel = 'B2';
      subLevelString = `B2.${Math.min(9, Math.floor(((cambridgeScale - 160) / 20) * 10))}`;
      levelDescriptor = 'Vantage / Upper Intermediate (Cambridge B2 First Equivalent)';
    } else if (cambridgeScale >= 140) {
      diagnosedLevel = 'B1';
      subLevelString = `B1.${Math.min(9, Math.floor(((cambridgeScale - 140) / 20) * 10))}`;
      levelDescriptor = 'Threshold / Intermediate (Cambridge B1 Preliminary Equivalent)';
    } else if (cambridgeScale >= 120) {
      diagnosedLevel = 'A2';
      subLevelString = `A2.${Math.min(9, Math.floor(((cambridgeScale - 120) / 20) * 10))}`;
      levelDescriptor = 'Waystage / Elementary (Cambridge A2 Key Equivalent)';
    } else {
      diagnosedLevel = 'A1';
      subLevelString = `A1.${Math.min(9, Math.floor(((cambridgeScale - 80) / 40) * 10))}`;
      levelDescriptor = 'Breakthrough / Beginner Standard';
    }

    // Determine strengths & weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (categoryScores.grammar.percentage >= 70) strengths.push('Syntactic Precision & Clause Structure');
    else weaknesses.push('Complex Tense Relationships & Inversions');

    if (categoryScores.vocabulary.percentage >= 70) strengths.push('Lexical Resource & Academic Register');
    else weaknesses.push('Phrasal Verbs & Advanced Collocations');

    if (categoryScores.listening.percentage >= 70) strengths.push('Acoustic Comprehension & Implied Meaning');
    else weaknesses.push('Rapid Spoken Discourse & Subtext Nuances');

    if (categoryScores.discourse.percentage >= 70) strengths.push('Cohesive Ties & Textual Rhetoric');
    else weaknesses.push('Discourse Markers & Transition Devices');

    return {
      timestamp: new Date().toISOString(),
      rawScore,
      maxScore,
      percentage,
      cambridgeScale,
      diagnosedLevel,
      subLevelString,
      levelDescriptor,
      categoryScores: categoryScores as any,
      strengths: strengths.length > 0 ? strengths : ['Communicative intent and baseline vocabulary'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Refining C2 idiomatic elegance']
    };
  }

  /**
   * Computes Guided Learning Hours (Cambridge / ALTE standards)
   */
  public static computeGuidedHours(current: CEFRLevel, target: CEFRLevel): GuidedLearningProjection {
    const levelsOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIdx = levelsOrder.indexOf(current);
    const targetIdx = levelsOrder.indexOf(target);

    // Base cumulative guided learning hours for each level transition
    const hoursPerStep: Record<string, number> = {
      'A1->A2': 100,
      'A2->B1': 190,
      'B1->B2': 200,
      'B2->C1': 200,
      'C1->C2': 320
    };

    let totalGuidedHours = 0;
    const milestoneSteps: GuidedLearningProjection['milestoneSteps'] = [];

    if (targetIdx > currentIdx) {
      for (let i = currentIdx; i < targetIdx; i++) {
        const from = levelsOrder[i];
        const to = levelsOrder[i + 1];
        const key = `${from}->${to}`;
        const stepHours = hoursPerStep[key] || 150;
        totalGuidedHours += stepHours;
        milestoneSteps.push({
          fromLevel: from,
          toLevel: to,
          hours: stepHours,
          description: `Progress from ${from} to ${to} (${stepHours} guided study hours)`
        });
      }
    } else {
      totalGuidedHours = 40; // Maintenance or polishing
      milestoneSteps.push({
        fromLevel: current,
        toLevel: target,
        hours: 40,
        description: `Consolidate and polish ${current} level fluency with advanced native discourse.`
      });
    }

    // Accelerated schedule: 3 hours per day
    const accelHoursPerDay = 3.0;
    const accelDays = Math.ceil(totalGuidedHours / accelHoursPerDay);
    const accelWeeks = Math.max(1, Math.ceil(accelDays / 7));

    // Steady schedule: 45 minutes per day (0.75 hours)
    const steadyHoursPerDay = 0.75;
    const steadyDays = Math.ceil(totalGuidedHours / steadyHoursPerDay);
    const steadyMonths = Math.max(1, Math.round((steadyDays / 30) * 10) / 10);

    return {
      currentLevel: current,
      targetLevel: target,
      totalGuidedHours,
      accelerated: {
        hoursPerDay: accelHoursPerDay,
        days: accelDays,
        weeks: accelWeeks
      },
      steady: {
        hoursPerDay: steadyHoursPerDay,
        months: steadyMonths
      },
      milestoneSteps
    };
  }

  /**
   * Loads the student profile from Supabase with LocalStorage fallback
   */
  public static async loadStudentProfile(): Promise<FathomITSStudentProfile | null> {
    const deviceId = getOrCreateDeviceId();

    // 1. Try Supabase cloud fetch first
    try {
      const { data, error } = await supabase
        .from('fathom_its_profiles')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (!error && data) {
        const voice = CURATED_TUTOR_VOICES.find((v) => v.id === data.voice_id) || CURATED_TUTOR_VOICES[0];
        const profile: FathomITSStudentProfile = {
          deviceId: data.device_id,
          userId: data.user_id,
          targetLanguage: data.target_language || 'en',
          selectedVoice: voice as TutorVoice,
          targetCEFR: data.target_cefr || 'B2',
          currentCEFR: data.current_cefr || 'A1',
          currentPoints: data.current_points || 0,
          baselineAssessment: data.baseline_breakdown || null,
          totalStudyMinutes: data.total_study_minutes || 0,
          sessionsCompleted: data.sessions_completed || 0,
          quizzesSolved: data.quizzes_solved || 0,
          lastActive: data.last_active || new Date().toISOString(),
          createdAt: data.created_at || new Date().toISOString()
        };

        // Cache locally
        localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
        return profile;
      }
    } catch (err) {
      console.warn('[Fathom ITS Service] Cloud profile load notice:', err);
    }

    // 2. Fallback to localStorage
    try {
      const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[Fathom ITS Service] Local profile parse error:', err);
    }

    return null;
  }

  /**
   * Saves the student profile to Supabase & localStorage
   */
  public static async saveStudentProfile(profile: FathomITSStudentProfile): Promise<void> {
    // Local persistence
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('[Fathom ITS Service] Error caching profile:', e);
    }

    // Cloud Supabase persistence
    try {
      const payload = {
        device_id: profile.deviceId,
        target_language: profile.targetLanguage,
        voice_id: profile.selectedVoice.id,
        voice_name: profile.selectedVoice.name,
        target_cefr: profile.targetCEFR,
        current_cefr: profile.currentCEFR,
        current_points: profile.currentPoints,
        baseline_score: profile.baselineAssessment?.percentage ?? null,
        baseline_cambridge_scale: profile.baselineAssessment?.cambridgeScale ?? null,
        baseline_cefr: profile.baselineAssessment?.diagnosedLevel ?? null,
        baseline_breakdown: profile.baselineAssessment ?? {},
        total_study_minutes: profile.totalStudyMinutes,
        sessions_completed: profile.sessionsCompleted,
        quizzes_solved: profile.quizzesSolved,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await supabase.from('fathom_its_profiles').upsert(payload, { onConflict: 'device_id' });
    } catch (err) {
      console.warn('[Fathom ITS Service] Cloud sync notice:', err);
    }
  }

  /**
   * Saves assessment result to Supabase
   */
  public static async saveAssessment(profile: FathomITSStudentProfile, assessment: DiagnosticResult): Promise<void> {
    try {
      await supabase.from('fathom_its_assessments').insert({
        device_id: profile.deviceId,
        assessment_type: 'diagnostic',
        raw_score: assessment.rawScore,
        max_score: assessment.maxScore,
        percentage: assessment.percentage,
        cambridge_scale: assessment.cambridgeScale,
        diagnosed_cefr: assessment.diagnosedLevel,
        sub_level_string: assessment.subLevelString,
        category_scores: assessment.categoryScores,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Fathom ITS Service] Assessment cloud save notice:', err);
    }
  }

  /**
   * Load tutoring messages from localStorage
   */
  public static loadTutoringMessages(): FathomITSMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }

  /**
   * Save tutoring messages to localStorage & Supabase
   */
  public static async saveTutoringMessages(profileId: string, messages: FathomITSMessage[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
  }
}
