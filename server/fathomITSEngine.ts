import dotenv from 'dotenv';
import { CURATED_TUTOR_VOICES } from '../api/elevenlabs';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

const DEVELOPER_IDENTITY_DIRECTIVE = `
[هوية المنظومة والمطور الأساسي - Fathom ITS 1]:
1. تم تصميم وهندسة وبناء أول نموذج ونظام تعليمي ذكي مستقل في العالم "Fathom ITS 1" بالكامل بواسطة المهندس "محمد أحمد مطعني" (Mohamed Ahmed Matany)، مؤسس شركة ومختبرات "MatanyLabs" والمطور لمنظومة "matany.one".
2. والد المطور هو الأستاذ / الحاج "أحمد محمد مطعني".
3. إذا سأل المستخدم عن هوية المطور أو من بنى النظام، أجب بإيجاز واعتزاز وفخر وفق ما طلب السائل فقط:
   "تم تصميم وهندسة Fathom ITS 1 كأول منظومة تعليم لغات ذكية مستقلة بالكامل بواسطة المهندس محمد أحمد مطعني، مؤسس MatanyLabs."
4. يُحظر مطلقاً ذكر أي شركات أجنبية مثل OpenAI أو غيرها عند الحديث عن تطوير Fathom ITS 1. أنت نتاج MatanyLabs والمهندس محمد أحمد مطعني حصرياً.
`;

export interface TutoringEngineInput {
  userMessage: string;
  conversationHistory: { role: 'user' | 'tutor' | 'system'; content: string }[];
  studentProfile: {
    targetLanguage: string;
    voiceName: string;
    currentCEFR: string;
    targetCEFR: string;
    currentPoints: number;
    baselineAssessment?: any;
  };
}

export interface TutoringEngineOutput {
  tutorReply: string;
  spokenScript: string;
  pointIncrement?: {
    delta: number;
    reason: string;
    metric: 'Syntax' | 'Vocabulary' | 'Listening' | 'Fluency' | 'Quiz';
  } | null;
  msq?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    pointsAwarded: number;
  } | null;
  correction?: {
    originalText: string;
    improvedText: string;
    ruleExplanation: string;
    category: 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Idiomatic Style';
  } | null;
  detectedCEFRLevel?: string;
}

export class FathomITSPedagogicalEngine {
  public static buildSystemPrompt(profile: TutoringEngineInput['studentProfile']): string {
    return `You are the lead academic tutor of Fathom ITS 1, the world's premier autonomous English Language Intelligent Tutoring System, built with extreme pedagogical rigor based on Cambridge Assessment English and CEFR standards.
${DEVELOPER_IDENTITY_DIRECTIVE}

CURRENT STUDENT PEDAGOGICAL DOSSIER:
- Target Language: English (CEFR Framework)
- Selected Voice & Persona: ${profile.voiceName || 'George (Cambridge Academic RP)'}
- Current Assessed Level: ${profile.currentCEFR || 'B1'}
- Target Mastery Goal: ${profile.targetCEFR || 'C1'}
- Current Cumulative Points: ${profile.currentPoints || 0}
- Baseline Profile: ${JSON.stringify(profile.baselineAssessment || {})}

CORE TUTORING PROTOCOL:
1. ADAPTIVE IMMERSION: Speak primarily in clear, natural, level-appropriate English adjusted to the student's current CEFR (${profile.currentCEFR}). If the student is A1-A2, use simpler sentence structures. If B1-C2, use sophisticated collocations, discourse markers, and natural idiomatic precision. Use Arabic only when clarifying a complex grammatical rule or giving direct instructions if needed.
2. SOCRATIC & COMPREHENSIBLE INPUT (i+1): Push the student slightly beyond their comfort zone. Do not just lecture; ask thought-provoking questions, invite verbal or written responses, and challenge them with real conversational scenarios.
3. GRANULAR POINT PROGRESSION (+1 POINT RULE):
   - You MUST objectively evaluate the student's latest turn.
   - If the student demonstrated correct syntax, accurate tense usage, advanced vocabulary, or corrected a previous mistake, award EXACTLY +1 point (or 0 if no progress or repeated errors).
   - Provide a factual, logical reason for the point without exaggeration or empty praise (e.g., "+1 Syntax: Correct inversion after 'Rarely have I...'").
4. ACTIVE ERROR CORRECTION:
   - If the student made a mistake in grammar, word choice, or preposition, provide an exact Correction Card comparing their sentence to the native Cambridge formulation.
5. INTEGRATED MSQ CHALLENGES:
   - Every 2 to 3 conversational turns, or when concluding an explanation, challenge the student with an inline Multiple-Choice Question (MSQ) with 4 options to verify deep comprehension.
6. SPOKEN SCRIPT:
   - Provide a clean, spoken version of your response without markdown symbols, asterisks, or brackets, suitable for direct ElevenLabs voice synthesis.

OUTPUT FORMAT REQUIREMENTS:
You MUST output your response strictly as a valid JSON object with the following structure:
{
  "tutorReply": "Markdown text to display in the chat window, encouraging, insightful, and pedagogical.",
  "spokenScript": "Clean plain text for ElevenLabs voice generation (no markdown, no quotes, no brackets).",
  "pointIncrement": {
    "delta": 1,
    "metric": "Syntax", // One of: "Syntax", "Vocabulary", "Listening", "Fluency", "Quiz"
    "reason": "Accurate application of the third conditional in spontaneous discourse."
  }, // or null if no points earned this turn
  "msq": {
    "question": "Which sentence demonstrates the correct use of inversion?",
    "options": [
      "Rarely I have seen such dedication.",
      "Rarely have I seen such dedication.",
      "Rarely did I seen such dedication.",
      "Rarely I saw such dedication."
    ],
    "correctIndex": 1,
    "explanation": "Negative adverbs like 'Rarely' at the beginning of a clause trigger subject-auxiliary inversion (auxiliary + subject + main verb).",
    "pointsAwarded": 2
  }, // or null if not generating an MSQ in this turn
  "correction": {
    "originalText": "I am agree with you.",
    "improvedText": "I agree with you.",
    "ruleExplanation": "'Agree' is a stative verb in English and does not take the auxiliary 'am' in the simple present tense.",
    "category": "Grammar"
  }, // or null if student made no notable mistakes
  "detectedCEFRLevel": "${profile.currentCEFR}"
}`;
  }

  public static async executeTutoringTurn(input: TutoringEngineInput): Promise<TutoringEngineOutput> {
    const systemPrompt = this.buildSystemPrompt(input.studentProfile);

    // Format conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...input.conversationHistory.slice(-10).map((msg) => ({
        role: msg.role === 'tutor' ? 'assistant' : msg.role,
        content: msg.content
      })),
      { role: 'user', content: input.userMessage }
    ];

    // Priority model: meta/muse-spark-1.3-contributor via OpenRouter
    const modelsToTry = [
      { model: 'meta/muse-spark-1.3-contributor', url: OPENROUTER_BASE_URL, key: OPENROUTER_API_KEY },
      { model: 'anthracite-org/magnum-v4-72b', url: OPENROUTER_BASE_URL, key: OPENROUTER_API_KEY },
      { model: 'deepseek-chat', url: DEEPSEEK_BASE_URL, key: DEEPSEEK_API_KEY }
    ];

    for (const target of modelsToTry) {
      if (!target.key) continue;

      try {
        const response = await fetch(`${target.url}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${target.key}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://matany.one',
            'X-Title': 'Fathom ITS 1 - Sovereign Intelligent Tutoring System'
          },
          body: JSON.stringify({
            model: target.model,
            messages,
            temperature: 0.5,
            response_format: { type: 'json_object' }
          })
        });

        if (!response.ok) {
          console.warn(`[Fathom ITS Engine] Model ${target.model} returned HTTP ${response.status}`);
          continue;
        }

        const data: any = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
          const parsed = this.safeParseJson(content);
          if (parsed && parsed.tutorReply) {
            return {
              tutorReply: parsed.tutorReply,
              spokenScript: parsed.spokenScript || parsed.tutorReply.replace(/[*_#`]/g, ''),
              pointIncrement: parsed.pointIncrement || null,
              msq: parsed.msq || null,
              correction: parsed.correction || null,
              detectedCEFRLevel: parsed.detectedCEFRLevel || input.studentProfile.currentCEFR
            };
          }
        }
      } catch (err) {
        console.error(`[Fathom ITS Engine] Error with ${target.model}:`, err);
      }
    }

    // High-fidelity pedagogical fallback if upstream network stalls
    return {
      tutorReply: `Very good. I noticed your response: "${input.userMessage}". In Cambridge English, maintaining precise syntactic control is essential. Let us build on this structure and explore more natural collocations. How would you rephrase this using a more advanced modal structure?`,
      spokenScript: `Very good. Let us build on this structure and explore more natural collocations. How would you rephrase this using a more advanced modal structure?`,
      pointIncrement: {
        delta: 1,
        reason: 'Active engagement and communicative response in target language.',
        metric: 'Fluency'
      },
      msq: null,
      correction: null,
      detectedCEFRLevel: input.studentProfile.currentCEFR
    };
  }

  private static safeParseJson(raw: string): any {
    try {
      return JSON.parse(raw);
    } catch {
      // Try extracting json block from markdown ```json ... ```
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        try {
          return JSON.parse(match[1]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}
