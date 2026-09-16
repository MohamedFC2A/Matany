/**
 * ============================================================================
 * Dynamic Parameter Tuning Engine (محرك الضبط الديناميكي للبارامترات والنوايا)
 * Matany AI (Matany) — Sovereign Multi-Model Architecture
 *
 * Core Responsibility:
 * 1. Deep Semantic User Intent & Request Deconstruction (فهم نية المستخدم وطلبه بدقة)
 * 2. Pre-Execution Model Hyperparameter Tuning (ضبط الإعدادات والقيم الصحيحة للنماذج الأصلية قبل البدء)
 * 3. Architecture-Specific Alignment (DeepSeek V4 Pro, Flash, Reasoner, Chat, Muse Spark, Vision, Magnum)
 * 4. Dynamic Cognitive Directive Injection (توجيه المعايرة التلقائية للنموذج)
 * ============================================================================
 */

import {
  classifyContextualQueryIntent,
  resolveMultiTurnQuery,
  extractCleanSearchQuery
} from './searchEngine/index';

export interface ExtractedSearchContext {
  shouldSearch: boolean;
  extractedQuery: string;
  extractedTopic: string;
  reason: string;
}

export type UserIntentCategory =
  | 'SYSTEM_DIAGNOSTIC_GPAENG'
  | 'CYBERSECURITY_AND_EXPLOIT_AUDITING'
  | 'CODE_ENGINEERING_AND_ARCHITECTURE'
  | 'SVG_VECTOR_STUDIO_AND_DESIGN'
  | 'NEURAL_IMAGE_STUDIO_AND_PROCESSING'
  | 'FATHOM_ITS_EXAM_AND_LANGUAGE_ASSESSMENT'
  | 'MATHEMATICAL_AND_DEDUCTIVE_LOGIC'
  | 'SCIENTIFIC_AND_ACADEMIC_RESEARCH'
  | 'FACTUAL_SEARCH_AND_REALTIME_GROUNDING'
  | 'COMPARATIVE_AND_EVALUATION_ANALYSIS'
  | 'TECHNICAL_DOCUMENTATION'
  | 'MULTIMODAL_IMAGE_AND_FORENSICS'
  | 'MULTIMODAL_MEDIA_AND_ARCHIVE_DECONSTRUCTION'
  | 'CREATIVE_LITERARY_AND_BRAINSTORMING'
  | 'UNINHIBITED_PERSONA_MATANY'
  | 'GENERAL_CONVERSATION_AND_QUICK_QA';

export type ModelFamily =
  | 'deepseek-pro'
  | 'deepseek-flash'
  | 'deepseek-reasoner'
  | 'deepseek-chat'
  | 'muse-spark'
  | 'deepseek-vision'
  | 'magnum'
  | 'fathom-search'
  | 'fathom-its'
  | 'generic';

export type TaskComplexity =
  | 'LIGHT'
  | 'STANDARD'
  | 'DEEP_ANALYTICAL'
  | 'EXHAUSTIVE_ARCHITECTURAL';

export type HallucinationRisk =
  | 'EXTREME'
  | 'HIGH'
  | 'MODERATE'
  | 'LOW';

export interface TunedHyperparameters {
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stop?: string[];
  stream: boolean;
  // Official DeepSeek API Architecture (https://api-docs.deepseek.com/guides/thinking_mode)
  reasoning_effort?: 'low' | 'high' | 'max';
  thinking_mode?: 'enabled' | 'disabled';
  max_thinking_tokens?: number;
  stream_options?: { include_usage: boolean };
}

export interface DynamicTuningRequest {
  userPrompt: string;
  conversationHistory?: Array<{ role: string; content: any }>;
  requestedModel: string;
  isMatanyMode?: boolean;
  deepSearch?: boolean;
  hasMultimodalImages?: boolean;
  hasVideoOrAudio?: boolean;
  hasZipOrCodeFiles?: boolean;
  explicitTemperature?: number;
  userId?: string;
}

export interface PriorNeuralImageContext {
  prompt?: string;
  imageUrl?: string;
  operation?: string;
  title?: string;
  style?: string;
  aspectRatio?: string;
  seed?: number;
  sourceRole?: string;
}

export type ImageOperationType = 'edit' | 'addition' | 'generation';

export interface DynamicTuningResult {
  detectedIntent: UserIntentCategory;
  detectedImageOperation?: ImageOperationType;
  priorNeuralImage?: PriorNeuralImageContext | null;
  intentConfidence: number;
  complexityLevel: TaskComplexity;
  hallucinationRisk: HallucinationRisk;
  targetModelFamily: ModelFamily;
  hyperparameters: TunedHyperparameters;
  calibrationDirective: string;
  tuningRationale: string;
  extractedSearchContext?: ExtractedSearchContext;
  telemetry: {
    intent: string;
    model: string;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    maxTokens: number;
    reasoningEffort?: 'low' | 'high' | 'max';
    thinkingMode?: 'enabled' | 'disabled';
    maxThinkingTokens?: number;
    timestamp: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN MATCHER CATALOGUE (Dual Arabic & English Context Awareness)
// ─────────────────────────────────────────────────────────────────────────────

const CYBER_PATTERNS = [
  /(ثغرة|ثغرات|اختراق|بايلود|payload|exploit|cve|zero-day|0-day|rce|sqli|xss|csrf|ssrf|buffer\s*overflow|heap\s*overflow|reverse\s*engineering|هندسة\s*عكسية|تشفير|فك\s*تشفير|dpop|rfc\s*9449|jkt|jwk|jwks|nonce|envoy|kafka\s*kms|envelope\s*encryption|امتيازات|privilege\s*escalation|bypass|تجاوز\s*حماية|شيل|reverse\s*shell|metasploit|nmap|burp|wireshark|malware|تحليل\s*أمني|أمن\s*سيبراني|cybersecurity|red\s*team|blue\s*team|threat\s*model|تدقيق\s*أمني|هجوم|حقن|تصيد|تسريب)/i,
  /\b(vulnerability|vulnerabilities|exploit|payload|injection|penetration\s+testing|zero-day|zero\s+day|cve-\d+|poc|patch|auth\s+bypass|security\s+audit|dpop|stateless\s+nonce|jwk|envelope\s+encryption|buffer\s+overflow|privilege\s+escalation)\b/i
];

const CODE_ENGINEERING_PATTERNS = [
  /(كود|برمجة|دالة|كلاس|class|function|async|await|typescript|javascript|python|rust|golang|c\+\+|react|vue|node\.js|express|api|rest|graphql|database|sql|nosql|schema|docker|kubernetes|refactor|إعادة\s*هيكلة|تصحيح\s*خطأ|debug|syntax|ast|ring\s*buffer|lock-free|concurrency|multithreading|خوارزمية|algorithm|data\s*structure|مصفوفة|شجرة|tree|graph|git|pull\s*request|سكريبت|script|frontend|backend)/i,
  /\b(code|function|interface|refactor|debugging|typescript|python|rust|c\+\+|algorithms?|data\s+structures?|lock-free|ring\s+buffer|concurrency|deadlock|memory\s+leak|compiler|ast|sql\s+schema|unit\s+tests?|e2e\s+tests?)\b/i
];

export const NEURAL_IMAGE_PATTERNS = [
  // 1. Inpainting / Object Recoloring
  /(?:غير|عدل|بدل|لون|صبغ|غيرلي|بدلي)\s+(?:لي\s+)?(?:لون\s+)?(?:القميص|البنطلون|الفستان|السيارة|العربية|الشعر|العين|العينين|الحذاء|الجاكيت|التيشيرت|المنتج|العنصر|الكائن|الكوب|العلبة|الخلفية|الباب|الجدار|اللون|الملابس|البدلة)/i,
  /\b(?:recolor|change\s+the\s+color\s+of|dye|paint\s+the)\b/i,

  // 2. Background Removal & Replacement
  /(?:احذف|شيل|ازالة|إزالة|عزل|اعزل|غير|بدل|تفريغ|فرغ)\s+(?:لي\s+)?(?:الخلفية|خلفية\s+الصورة|الباكجراوند)/i,
  /\b(?:remove\s+background|bg\s+remove|cutout|transparent\s+background|replace\s+background)\b/i,

  // 3. Person & Element Compositing (Combining people while preserving facial geometry)
  /(?:اضف|أضف|ادمج|حط|ركب|اجمع|دمج)\s+(?:لي\s+)?(?:شخصين|الشخصين|الصورتين|شخص\s+تاني|مع\s+بعض|جنب\s+بعض|صورة\s+شخص|وجه|ملامح|صورتي|الصورة\s+دي\s+مع)/i,
  /\b(?:composite|combine\s+two\s+people|merge\s+photos|add\s+person|place\s+next\s+to)\b/i,

  // 4. Super-Resolution & 2K/4K Quality Enhancement
  /(?:تحسين|حسن|وضح|توضيح|علي|علّي|ارفع|زوّد|تكبير|زيادة|فلترة)\s+(?:لي\s+)?(?:جودة\s+الصورة|دقة\s+الصورة|الملامح|الجودة|الدقة|ريزوليوشن|resolution|clarity|upscale|enhance|2k|4k|hd|uhd)/i,
  /\b(?:upscale|super\s*resolution|enhance\s+(?:image|photo|quality)|make\s+4k|make\s+2k|sharpen\s+image)\b/i,

  // 5. Product Mockup & Commercial Photo Editing
  /(?:صورة\s+منتج|عدل\s+المنتج|تعديل\s+صورة\s+المنتج|غير\s+صورة\s+المنتج|صورة\s+المنتج|علبة\s+المنتج|منتجات|mockup|product\s+photo|product\s+shot|e-commerce\s+photo)/i,

  // 6. Text Editing & Inpainting inside images
  /(?:غير|عدل|بدل|استبدل|احذف|امسح|عدلي|غيرلي)\s+(?:لي\s+)?(?:النص|الكلام|الكتابة|النصوص|الكلمة|الجملة)\s+(?:في\s+الصورة|المكتوب|المكتوبة|اللي\s+في\s+الصورة)/i,
  /\b(?:edit\s+text\s+in\s+image|replace\s+text|change\s+text\s+in\s+photo|inpaint\s+text)\b/i,

  // 7. General Photographic Manipulation on attached image
  /(?:عدل\s+على\s+الصورة|تعديل\s+الصورة|ظبط\s+الصورة|معالجة\s+الصورة|فلتر\s+للصورة|edit\s+this\s+photo|modify\s+this\s+image|inpaint)/i,

  // 8. Human Anatomy, Portrait Retouch & Facial Enhancement
  /(?:معالجة\s+الوجه|تعديل\s+الوجه|تعديل\s+الشخص|معالجة\s+البشر|تعديل\s+البشر|اصلاح\s+الملامح|تعديل\s+الملامح|تعديل\s+الجسم|تصحيح\s+اليد|تصحيح\s+الاصابع|تنقية\s+البشرة|مسام\s+البشرة|skin\s+retouch|face\s+retouch|portrait\s+enhancement|anatomy\s+fix|facial\s+features)/i
];

export const CONTEXTUAL_IMAGE_EDIT_PATTERNS = [
  // 1. Direct contextual edit phrases on image attributes (change color, background, style)
  /(?:عدل\s+عليها|غير\s+فيها|بدل\s+فيها|عدل\s+فيها|غير\s+لون|بدل\s+لون|عدل\s+لون|غير\s+شكل|بدل\s+شكل|غير\s+الخلفية|بدل\s+الخلفية|امسح\s+الـ|احذف\s+الـ|شيل\s+الـ)/i,
  // 2. Modifying visual lighting / time of day
  /(?:خليها|خليه|اجعلها|اجعله|سوها|سوه)\s+(?:بالليل|بالنهار|في\s+الليل|في\s+النهار|وقت\s+الغروب|وقت\s+الشروق|تحت\s+المطر|على\s+البحر|في\s+الثلج|في\s+الصحراء|في\s+الفضاء)/i,
  // 3. Changing color or appearance of an item in the image (e.g. "خلي لون السيارة أسود", "خليه أحمر", "اجعل الفستان أزرق", "اجعل اللوحة مصرية")
  /(?:خلي|خليه|خلها|خليها|اجعل|اجعله|اجعلها|سوي|سوه|سوها|صبغ|لون)\s+(?:لي\s+)?(?:لون\s+)?(?:السيارة|العربية|القميص|الفستان|الشعر|العين|البنطلون|الباب|الجدار|اللوحة|الخلفية|اللوحه|النمرة)?\s*(?:ذهبي|ذهبيه|ذهبية|أحمر|احمر|حمرا|حمراء|أزرق|ازرق|زرقا|زرقاء|أخضر|اخضر|خضرا|خضراء|أصفر|اصفر|صفرا|صفراء|أسود|اسود|سودا|سوداء|أبيض|ابيض|بيضا|بيضاء|فضي|فضيه|فضية|كحلي|رمادي|مات|مطفي|لامع|كروم|كربون\s*فايبر|وردي|بنفسجي|برتقالي|بني|مصرية|مصريه|سعودية|سعوديه)/i,
  // 4. In-scene ambient changes (e.g. "بدون دخان", "مع مطر ودخان")
  /(?:بدون\s*(?:دخان|خلفية|سيارات|ناس|اضاءة|إضاءة|مطر|أشجار)|مع\s*(?:دخان|مطر|ثلج|ضباب|غيوم))/i,
  // 5. Image regeneration / retry requests
  /(?:مش\s*ظاهرة|لم\s*تظهر|ما\s*ظهرت|مظهرتش|فين\s*الصورة|الصورة\s*فين|أعد\s*(?:المحاولة|توليد|إنشاء|انشاء|التعديل|الإنشاء)\s*(?:للصورة)?|اعد\s*(?:المحاولة|توليد|إنشاء|انشاء|التعديل|الإنشاء)\s*(?:للصورة)?|الصورة\s*معلقة|الصورة\s*بايظة|مش\s*باينة|ما\s*بانت|مش\s*شغالة)/i,
  // 6. English edit directives with explicit visual targets
  /\b(?:edit\s+(?:it|this|the\s+image|the\s+photo)|modify\s+(?:it|this|the\s+image|the\s+photo)|change\s+(?:the\s+color|the\s+background|the\s+style)|replace\s+the\s+(?:background|color|car|face)|remove\s+the\s+(?:background|person|object)|make\s+it\s+(?:night|day|red|blue|dark|bright|gold|golden|silver|matte|glossy|egyptian))\b/i
];

export const CONTEXTUAL_IMAGE_ADDITION_PATTERNS = [
  // Arabic addition with explicit target or visual noun
  /(?:ضيف|ضيفلي|أضف|اضف|أضيف|اضيف|إضافة|اضافة|حط|حطلي|حطله|حطلها|ركب|ركبلي|زود|زوّد|ادمج|أدخل|ادخل)\s+(?:لي\s+)?(?:في\s+الصورة|على\s+الصورة|بالصورة|فيها|عليها|جنبها|معاها|فوقها|تحتها|شخص|سيارة|شجرة|خلفية|سحاب|مطر|نور|إضاءة|لوحة|دخان|ثلج|شمس|قمر|طائرة|طيارة|درون|طائر|عصفور|بحر|جبل|نهر)/i,
  /(?:ضيف\s+عليها|حط\s+عليها|ضيف\s+فيها|حط\s+فيها|ركب\s+عليها|زود\s+عليها|ضيف\s+جنب|حط\s+جنب|ضيف\s+مع|حط\s+مع|أضف\s+إلى|اضف\s+إلى|أضف\s+الي|اضف\s+الي|إضافة\s+إلى|اضافة\s+الي)/i,
  /(?:ضيف|أضف|اضف|أضيف|اضيف|حط|ركب|زود)\s+(?:لي\s+)?(?:[\p{L}\p{N}\s]{1,30})\s*(?:تحلق|يقف|تقف|تجلس|يجلس|يمشي|تطير|يطير|تجري|يجري|فوق|تحت|بجانب|جنب|مع|في\s+المشهد|في\s+الصورة|على\s+الصورة)/iu,
  // English addition with explicit boundaries and visual targets
  /\b(?:add\s+(?:to\s+it|a\s+person|a\s+tree|an\s+object|rain|mist|smoke|car|background|drone)|put\s+(?:on\s+it|next\s+to\s+it)|insert\s+(?:into\s+it|into\s+the\s+image))\b/i
];

export const NEURAL_IMAGE_GENERATION_PATTERNS = [
  /(?:صورة|صوره|خلفية|خلفيه|wallpaper|بورتريه|portrait)\s+(?:واقعية|فوتوغرافية|احترافية|عالية\s+الدقة|hd|4k|8k|فنية)/i,
  /(?:صمم|صممي|انشئ|أنشئ|ولد|توليد|اعمل|اعملي|سوي|سويلي|طلع|طلعلي|اريد|أريد|عايز|عاوز|بدي|محتاج|تخيل|ارسم|ارسمي|هات|جهز|صنع|create|generate|design|draw|make|render)\s+(?:لي\s+)?(?:صورة|صوره|خلفية|خلفيه|لوحة|بورتريه|photo|image|picture|wallpaper|portrait)/i,
  // Explicit drawing verbs on visual subjects
  /(?:ارسم|ارسمي|draw|paint)\s+(?:لي\s+)?[\p{L}\p{N}\s]{2,40}/iu,
  // Concise two-word queries: "صورة [noun]" (e.g. صورة سيارة، صورة فضاء، صورة اسد، صورة بحر، صورة بنت، صورة قطة)
  /^(?:صورة|صوره|خلفية\s*شاشة|خلفيه\s*شاشة|wallpaper|بورتريه|portrait)\s+[\p{L}\p{N}]+/iu,
  // Physical visual objects with drawing/designing (e.g. "صمم سيارة", "ارسم قطة")
  /(?:ارسم|ارسمي|تخيل|صمم)\s+(?:لي\s+)?(?:قطة|كلب|[أا]سد|نمر|طائر|عصفور|حيوان|شجرة|زهور|ورد|سيارة|عربية|طبيعة|منظر|[أا]شكال|شمس|غروب|شروق|قمر|بحر|فضاء|كوكب|رجل|شخص|وجه|بنت|طفل|طبيعة\s*صامتة|وحش|حصان|ذئب|فراشة|جبل|شاطئ|غابة)/i,
  /(?:صورة|صوره|خلفية|خلفيه|بورتريه|photo|image|picture)\s+(?:لـ|للـ|عن|فيها|تعبر\s+عن|جميلة|فنية|واقعية|احترافية|طبيعية|سينمائية|شخصية|متحركة|جديدة|hd|4k|8k)/i,
  /\b(?:generate\s+(?:an?\s+)?(?:image|photo|picture|wallpaper|portrait)|create\s+(?:an?\s+)?(?:image|photo|picture|wallpaper|portrait)|design\s+(?:an?\s+)?(?:image|photo|picture|wallpaper|portrait)|draw\s+(?:an?\s+)?(?:image|photo|picture)|image\s+of|photo\s+of|picture\s+of|photorealistic|realistic\s+photo|dslr\s+shot|hyperrealistic|realistic\s+portrait|realistic\s+human|realistic\s+person|generate\s+photo|create\s+photo)\b/i
];

const SVG_DESIGN_PATTERNS = [
  /<svg[\s\S]*?<\/svg>/i,
  /```svg/i,
  // Explicit request for SVG or vector code/file creation:
  /(?:كود\s*(?:الـ\s*)?svg|ملف\s*(?:الـ\s*)?svg|رسم\s*(?:الـ\s*)?svg|تصميم\s*(?:الـ\s*)?svg|\.svg\b|بصيغة\s*svg|صيغة\s*svg|كـ\s*svg|على\s*شكل\s*svg|رسم\s*شعاعي|متجهات\s*شعاعية|رسومات\s*فيكتور|vector\s*graphics?|vector\s*art|vector\s*illustration)/i,
  /\b(?:draw|create|generate|design|output|export|code)\s+(?:an?\s+)?(?:svg|vector)\b/i,
  /\b(?:make\s+it|convert\s+to|output\s+as)\s+(?:svg|vector)\b/i,
  // Direct combination: creation verb + explicit svg/vector target
  /(?=.*\b(?:svg|فيكتور|متجهات|شعاعي|vector)\b)(?=.*(?:كود|ملف|رسم|انشئ|أنشئ|صمم|ولد|توليد|اعمل|سوي|draw|create|generate|code)).*/is,
  // Strict SVG editing: MUST explicitly mention SVG code or vector file
  /(?:غير|عدل|بدل|لون|اضف|أضف|احذف|شيل|حول)\s+(?:لي\s+)?(?:في\s+)?(?:كود\s*(?:الـ\s*)?svg|ملف\s*(?:الـ\s*)?svg|تصميم\s*svg|الفيكتور)/i,
  /\b(?:change|modify|update|edit|recolor)\s+(?:the\s+)?(?:svg\s+code|svg\s+file|vector\s+graphic)\b/i
];

const MATH_DEDUCTIVE_LOGIC_PATTERNS = [
  /(مسألة\s*رياضية|معادلة|تكامل|تفاضل|جبر|نسبية\s*خاصة|نسبية\s*عامة|سرعة\s*الضوء|مفارقة\s*(?:التوأم|الجد)|ساعة\s*بيولوجية|لغز|أحجية|احجية|حزورة|استدلال\s*منطقي|برهان|proof|theorem|نظرية|اينشتاين|شرودنجر|كوانتم|حساب\s*دقيق|احسب\s*لي|احسب|فكم\s*ساعة\s*ستمر|كم\s*ساعة\s*ستمر|إذا\s*سافر|لو\s*سافر|تجربة\s*فكرية|أوجد\s*الناتج|كم\s*يساوي)/i,
  /\b(calculat(?:e|ion)|equation|integral|differential|linear\s+algebra|relativity|speed\s+of\s+light|twin\s+paradox|riddle|logic\s+puzzle|formal\s+proof|deductive\s+reasoning|thought\s+experiment|theorem|math\s+problem)\b/i
];

const SCIENTIFIC_RESEARCH_PATTERNS = [
  /(بحث\s*علمي|دراسة\s*علمية|ورقة\s*بحثية|جامعة|أبحاث\s*طبية|تشخيص\s*طبي|طب\s*بشري|علاج\s*طبي|لقاح|جينات|dna|rna|كيمياء|فيزياء\s*نووية|تلسكوب|مذنب|كويكب|ثقب\s*أسود|طاقة|جسيمات|أرشيف|arxiv|nature|lancet|peer-reviewed)/i,
  /\b(scientific\s+study|research\s+paper|clinical\s+trial|astrophysics|quantum\s+mechanics|genetics|dna|rna|crispr|biochemistry|particle\s+physics|exoplanet|arxiv|nature\s+journal)\b/i
];

const COMPARISON_PATTERNS = [
  /(قارن\s*بين|مقارنة\s*(?:بين)?|الفرق\s*بين|أيهما\s*(?:أفضل|أحسن|أقوى|أسرع|أدق)|مفاضلة|ضد|vs|versus|مواصفات|عيوب\s*ومميزات|مميزات\s*وعيوب|تقييم|benchmarks?|مراجعة\s*شاملة)/i,
  /\b(compare|comparison|difference\s+between|which\s+is\s+better|pros\s+and\s+cons|benchmark\s+vs|versus|head\s+to\s+head|buying\s+guide)\b/i
];

const CREATIVE_LITERARY_PATTERNS = [
  /(اكتب\s*(?:لي\s*)?(?:قصة|رواية|قصيدة|شعر|أبيات|خاطرة|سيناريو|حوار\s*خيالي)|قصيدة|شعر\s*فصيح|أبيات\s*شعرية|ألف\s*(?:لي)?|تخيل\s*أن|مشهد\s*درامي|وصف\s*أدبي|بلاغة|استعارة|roleplay|شخصية\s*خيالية)/i,
  /\b(write\s+a\s+(?:story|poem|novel|script|dialogue)|creative\s+writing|roleplay|fiction|imagine\s+that|brainstorm\s+ideas)\b/i
];

const EXPLICIT_CREATIVE_FRAMING = [
  /^(?:اكتب\s*(?:لي\s*)?(?:قصيدة|شعر|أبيات|قصة|رواية|سيناريو|خاطرة)|ألف\s*(?:لي)?\s*(?:قصة|قصيدة)|أنشئ\s*(?:لي\s*)?(?:قصيدة|قصة))/i,
  /\b(?:write\s+(?:me\s+)?a\s+(?:poem|story|novel|script)|compose\s+a\s+poem)\b/i
];

const GREETING_PATTERNS = [
  /^(مرحبا|اهلا|اهلاً|صباح\s*الخير|مساء\s*الخير|سلام\s*عليكم|السلام\s*عليكم|هاي|ازيك|عامل\s*ايه|كيف\s*حالك|hello|hi|hey|good\s+morning|good\s+evening)([\s,،]+(كيف\s*حالك|عامل\s*ايه|ازيك|اليوم|يا\s*(?:غالي|صديقي|بطل)|how\s+are\s+you|today|there))*\s*[.!؟?]?$/i
];

export const SIMPLE_ARITHMETIC_PATTERN = /^(?:(?:احسب|أحسب|احسبلي|احسب\s*لي|أوجد\s*الناتج|أوجد\s*ناتج|كم\s*يساوي|كم|ناتج|حساب)\s+)?(?:-?\d+(?:\.\d+)?\s*(?:[\+\-\*\/×÷\^]|زائد|ناقص|في|على|ضرب|قسمة)\s*)+-?\d+(?:\.\d+)?\s*[؟?]?$/i;

export const TRIVIAL_DIRECT_QA_PATTERNS = [
  /^(?:ما\s*(?:هي|هو)?\s*عاصمة\s+[\p{L}\s]+)[؟?]?$/iu,
  /^(?:من\s*(?:هو|هي)?\s*(?:رئيس|مخترع|مؤسس|مكتشف|ملك|أمير|حاكم|مؤلف|كاتب|شاعر)\s+[\p{L}\s]+)[؟?]?$/iu,
  /^(?:ما\s*(?:معنى|تعريف|مرادف|ضد|مضاد)\s+(?:كلمة\s+)?[\p{L}\s]+)[؟?]?$/iu,
  /^(?:كم\s*(?:عدد|عمر|سعر|ساعة|يوم|شهر|سنة|طول|وزن|مسافة|درجة)\s+[\p{L}\s]+)[؟?]?$/iu,
  /^(?:أين\s*تقع|اين\s*تقع|في\s*أي\s*بلد|في\s*اي\s*دولة)\s+[\p{L}\s]+[؟?]?$/iu,
  /^(?:من\s*أنت|من\s*انت|ما\s*اسمك|عرفني\s*بنفسك|ماذا\s*تستطيع\s*أن\s*تفعل|من\s*مطورك|من\s*صنعك)[؟?]?$/iu,
  /^(?:شكرا|شكراً|ألف\s*شكر|تسلم|يعطيك\s*العافية|تمام|أوكي|اوكي|تمام\s*جداً|ممتاز|عظيم|جميل|حسناً|حسنا|أكمل|اكمل|نعم|لا)[.!؟?]?$/iu,
];

export const EXAM_ASSESSMENT_PATTERNS = [
  /(?:امتحان|اختبار|كويز|قيّ?م\s*مستواي|تحدي\s*لغوي|تحدي\s*شامل|اختبرني|امتحني|msq|exam|quiz|test\s*me|assessment|cefr|evaluation|placement\s*test)/i,
  /(?:اختبرني\s+في|امتحني\s+في|اعملي\s+(?:امتحان|اختبار|كويز)|اعمل\s+لي\s+(?:امتحان|اختبار|كويز)|عايز\s+(?:امتحان|اختبار|كويز)|عاوز\s+(?:امتحان|اختبار|كويز)|بدي\s+(?:امتحان|اختبار|كويز)|اريد\s+(?:امتحان|اختبار|كويز)|نبي\s+(?:امتحان|اختبار|كويز))/i,
  /(?:قيم\s+مستواي|قيّم\s+مستواي|فحص\s+مستوى|تحديد\s+مستوى|اختبار\s+تحديد\s+المستوى|check\s+my\s+level|test\s+my\s+english)/i,
  /(?:اسئلة\s+اختيار\s+من\s+متعدد|أسئلة\s+اختيار\s+من\s+متعدد|multiple\s*choice\s*questions?)/i
];

export interface PedagogicalExamContext {
  targetLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  levelDescriptorAr: string;
  cefrGrammarScope: string;
  topic: string;
  isDiagnosticPlacement: boolean;
  isHistoryReview: boolean;
  questionCount: number;
  durationMinutes: number;
  passingScore: number;
  historyMistakes: Array<{
    original: string;
    improved: string;
    rule: string;
    category?: string;
  }>;
  recentVocabulary: string[];
}

export class DynamicParameterTuner {
  /**
   * Strips authoritative protocol instructions, MCP banners, and internal metadata badges
   * to isolate the pure, raw user query.
   */
  public static extractPureUserText(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/\[AUTHORITATIVE[\s\S]*?\][\s\S]*?(?=(?:\n\n\[AUTHORITATIVE)|$)/gi, '')
      .replace(/\[(?:المرفق في هذا الطلب الحالي|عدد الصور المرفقة|ملاحظة سياقية|إطارات ولقطات بصرية).*?\]/g, '')
      .replace(/---\s*\[.*?\]\s*---/g, '')
      .replace(/\[(?:ATTACHED_IMAGES|IMAGE_CONTEXT)[\s\S]*?\]/gi, '')
      .trim();
  }

  /**
   * Deterministically checks whether user input expresses image generation, creation, or editing intent.
   * Strictly disambiguates questions, explanations, coding, and general inquiries so they NEVER trigger image studio.
   */
  public static isImageGenerationOrEditIntent(text: string): boolean {
    if (!text || typeof text !== 'string') return false;
    const pure = this.extractPureUserText(text);
    if (!pure) return false;

    // Strict Question & Inquiry Disambiguation:
    // If the prompt is a general question, inquiry, or explanation request ("اي فائدة", "ما فائدة", "كيف", "لماذا", "ليه", "اشرح", "what is", "how to", "why"),
    // it is NEVER an image intent unless it contains an explicit imperative image generation/drawing verb!
    const isQuestionOrInquiry = /^(?:اي|أي|ما|ماذا|كيف|لماذا|ليه|هل|اشرح|شرح|وضح|فسر|معنى|ماذا\s*تعني|what|why|how|explain|can\s+you\s+explain)\b/i.test(pure) ||
      /\b(?:اي\s*فائدة|ما\s*فائدة|فائدة|ماهي\s*فائدة|ما\s*المقصود|ايش\s*فايدة)\b/i.test(pure);

    const hasExplicitImperativeImageCreation = /(?:صمم\s*صورة|انشئ\s*صورة|أنشئ\s*صورة|ولد\s*صورة|اعمل\s*صورة|ارسم\s*صورة|توليد\s*صورة|generate\s*(?:an?\s*)?image|create\s*(?:an?\s*)?image|draw\s*(?:an?\s*)?image|make\s*(?:an?\s*)?image)\b/i.test(pure);

    if (isQuestionOrInquiry && !hasExplicitImperativeImageCreation) {
      return false;
    }

    // Technical / coding / system queries guard
    const isTechnicalOrCode = /(?:كود|برمجة|دالة|موقع|صفحة|واجهة|html|css|js|ts|python|react|api|bug|error|قاعدة|database|خطة|مقال)\b/i.test(pure);
    if (isTechnicalOrCode && !hasExplicitImperativeImageCreation) {
      return false;
    }

    return (
      NEURAL_IMAGE_PATTERNS.some(p => p.test(pure)) ||
      NEURAL_IMAGE_GENERATION_PATTERNS.some(p => p.test(pure)) ||
      CONTEXTUAL_IMAGE_EDIT_PATTERNS.some(p => p.test(pure)) ||
      CONTEXTUAL_IMAGE_ADDITION_PATTERNS.some(p => p.test(pure))
    );
  }

  /**
   * Resolves the underlying ModelFamily category from a string identifier.
   */
  public static resolveModelFamily(modelName: string): ModelFamily {
    const m = (modelName || '').toLowerCase().trim();

    // Redirect any legacy flash models to deepseek-pro (Fathom Quant 3 flagship)
    if (
      m.includes('flash-cyber') ||
      m.includes('flash-cyper') ||
      m === 'deepseek-v4-flash' ||
      m === 'deepseek/deepseek-v4-flash'
    ) {
      return 'deepseek-pro';
    }

    if (
      m.includes('quant') ||
      m.includes('pro-cyber') ||
      m.includes('pro-cyper') ||
      m.includes('cyber-ultra') ||
      m.includes('cyber-2.6') ||
      m.includes('cyper-2.6') ||
      m.includes('cyber-2.1') ||
      m.includes('cyper-2.1') ||
      m === 'deepseek-v4-pro' ||
      m === 'deepseek/deepseek-v4-pro' ||
      m === 'fathom-cyber-2.6' ||
      m === 'fathom-cyber-2.1' ||
      m === 'fathom-quant-3'
    ) {
      return 'deepseek-pro';
    }

    if (
      m === 'deepseek-reasoner' ||
      m.includes('reasoner') ||
      m.includes('r1') ||
      m === 'deepseek/deepseek-r1'
    ) {
      return 'deepseek-reasoner';
    }

    if (
      m === 'deepseek-chat' ||
      m.includes('chat') ||
      m.includes('deepseek-v3') ||
      m === 'deepseek/deepseek-chat'
    ) {
      return 'deepseek-chat';
    }

    if (m.includes('muse-spark') || m.includes('spark') || m.includes('fathom-spark')) {
      return 'muse-spark';
    }

    if (m.includes('vision') || m.includes('fathom-cam') || m.includes('cam')) {
      return 'deepseek-vision';
    }

    if (m.includes('magnum') || m === 'matany' || m.includes('matany-persona')) {
      return 'magnum';
    }

    if (m === 'fathom-search' || m.includes('fathom-search') || m.includes('qwen')) {
      return 'fathom-search';
    }

    if (m.includes('its') || m === 'fathom-its-1' || m === 'fathom-its') {
      return 'fathom-its';
    }

    return 'generic';
  }

  /**
   * Deep pedagogical context extractor for Fathom ITS & CEFR Language Assessments.
   * Extracts target CEFR level, grammar scope, topic, past student mistakes from history,
   * question count, and rational time duration.
   */
  public static extractPedagogicalExamContext(
    userPrompt: string,
    conversationHistory?: Array<{ role: string; content: any }>,
    requestedModel?: string
  ): PedagogicalExamContext {
    const text = (userPrompt || '').trim();
    const history = Array.isArray(conversationHistory) ? conversationHistory : [];

    // 1. Detect target CEFR Level
    let targetLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' = 'B1';
    let levelExplicitlyFound = false;
    let isDiagnosticPlacement = false;

    // Check for explicit level in user prompt
    if (/\b(?:a1|مبتدئ\s*جداً|مبتدئ\s*جدا|level\s*1|المستوى\s*الأول|مستوى\s*أول|مستوى\s*1)\b/i.test(text)) {
      targetLevel = 'A1';
      levelExplicitlyFound = true;
    } else if (/\b(?:a2|مبتدئ|ابتدائي|level\s*2|المستوى\s*الثاني|مستوى\s*ثاني|مستوى\s*2)\b/i.test(text)) {
      targetLevel = 'A2';
      levelExplicitlyFound = true;
    } else if (/\b(?:b1|متوسط|intermediate|level\s*3|المستوى\s*الثالث|مستوى\s*ثالث|مستوى\s*3)\b/i.test(text)) {
      targetLevel = 'B1';
      levelExplicitlyFound = true;
    } else if (/\b(?:b2|فوق\s*المتوسط|upper\s*intermediate|level\s*4|المستوى\s*الرابع|مستوى\s*رابع|مستوى\s*4)\b/i.test(text)) {
      targetLevel = 'B2';
      levelExplicitlyFound = true;
    } else if (/\b(?:c1|متقدم|advanced|level\s*5|المستوى\s*الخامس|مستوى\s*خامس|مستوى\s*5)\b/i.test(text)) {
      targetLevel = 'C1';
      levelExplicitlyFound = true;
    } else if (/\b(?:c2|محترف|إتقان|mastery|proficient|level\s*6|المستوى\s*السادس|مستوى\s*سادس|مستوى\s*6)\b/i.test(text)) {
      targetLevel = 'C2';
      levelExplicitlyFound = true;
    } else if (/(?:قيم\s+مستواي|قيّم\s+مستواي|فحص\s+مستوى|تحديد\s+مستوى|اختبار\s+تحديد\s+المستوى|check\s+my\s+level|placement\s*test)/i.test(text)) {
      isDiagnosticPlacement = true;
      targetLevel = 'B1';
    }

    // If level not explicit in prompt, search backward in conversation history
    if (!levelExplicitlyFound && !isDiagnosticPlacement) {
      for (let i = history.length - 1; i >= 0; i--) {
        const msg = history[i];
        const content = typeof msg.content === 'string'
          ? msg.content
          : Array.isArray(msg.content)
            ? msg.content.map((c: any) => c.text || '').join(' ')
            : JSON.stringify(msg.content || '');

        // Check badge for current level
        const badgeMatch = /"currentLevel"\s*:\s*"(A1|A2|B1|B2|C1|C2)"/i.exec(content);
        if (badgeMatch && badgeMatch[1]) {
          targetLevel = badgeMatch[1].toUpperCase() as any;
          levelExplicitlyFound = true;
          break;
        }

        // Check prior exam for level
        const examMatch = /"level"\s*:\s*"(A1|A2|B1|B2|C1|C2)"/i.exec(content);
        if (examMatch && examMatch[1]) {
          targetLevel = examMatch[1].toUpperCase() as any;
          levelExplicitlyFound = true;
          break;
        }

        // Check user statements about their level in past turns
        if (msg.role === 'user') {
          if (/\b(?:a1|مبتدئ\s*جداً|مبتدئ\s*جدا)\b/i.test(content)) {
            targetLevel = 'A1';
            levelExplicitlyFound = true;
            break;
          } else if (/\b(?:a2|مبتدئ|ابتدائي)\b/i.test(content)) {
            targetLevel = 'A2';
            levelExplicitlyFound = true;
            break;
          } else if (/\b(?:b1|متوسط)\b/i.test(content)) {
            targetLevel = 'B1';
            levelExplicitlyFound = true;
            break;
          } else if (/\b(?:b2|فوق\s*المتوسط)\b/i.test(content)) {
            targetLevel = 'B2';
            levelExplicitlyFound = true;
            break;
          } else if (/\b(?:c1|متقدم)\b/i.test(content)) {
            targetLevel = 'C1';
            levelExplicitlyFound = true;
            break;
          } else if (/\b(?:c2|محترف)\b/i.test(content)) {
            targetLevel = 'C2';
            levelExplicitlyFound = true;
            break;
          }
        }
      }
    }

    // 2. Extract past student mistakes from history (```correction ... ```)
    const historyMistakes: Array<{ original: string; improved: string; rule: string; category?: string }> = [];
    for (const msg of history) {
      if (msg.role === 'assistant') {
        const content = typeof msg.content === 'string'
          ? msg.content
          : Array.isArray(msg.content)
            ? msg.content.map((c: any) => c.text || '').join(' ')
            : '';

        const matches = content.matchAll(/```correction\s*(\{[\s\S]*?\})\s*```/gi);
        for (const match of matches) {
          try {
            const parsed = JSON.parse(match[1]);
            if (parsed && parsed.originalText && parsed.improvedText) {
              historyMistakes.push({
                original: parsed.originalText,
                improved: parsed.improvedText,
                rule: parsed.ruleExplanation || '',
                category: parsed.category || 'Grammar'
              });
            }
          } catch {
            // ignore malformed blocks
          }
        }
      }
    }

    // 3. Detect Topic & History Review Intent
    const isHistoryReview = /(?:اللي\s*(?:فات|درسناه|اخدناه|أخذناه|تعلمناه|فوق)|المحادثة\s*السابقة|الأخطاء|أخطائي|my\s*mistakes|previous\s*lesson|review|سياق\s*المحادثة)/i.test(text) ||
      (historyMistakes.length > 0 && /(?:أخطاء|غلطات|تصحيح|مراجعة)/i.test(text));

    let topic = 'Comprehensive Grammar & Vocabulary Assessment';
    if (isHistoryReview && historyMistakes.length > 0) {
      topic = 'Review and Mastery of Previous Conversational Mistakes & Corrections (مراجعة الأخطاء المرتكبة في المحادثة السابقة)';
    } else if (/(?:حروف\s*الجر|حرف\s*جر|prepositions?)/i.test(text)) {
      topic = 'Prepositions of Time, Place, and Direction (حروف الجر)';
    } else if (/(?:مضارع\s*تام|present\s*perfect)/i.test(text)) {
      topic = 'Present Perfect vs. Past Simple (المضارع التام والماضي البسيط)';
    } else if (/(?:ماضي\s*بسيط|past\s*simple)/i.test(text)) {
      topic = 'Past Simple Tense and Irregular Verbs (الماضي البسيط والأفعال الشاذة)';
    } else if (/(?:أزمنة|ازمنة|زمن|tenses?)/i.test(text)) {
      topic = 'English Tenses & Temporal Aspects (أزمنة الأفعال الإنجليزية)';
    } else if (/(?:شرط|حالات\s*if|حالة\s*شرطية|conditionals?)/i.test(text)) {
      topic = 'Conditionals and Hypothetical Structures (الجمل والحالات الشرطية)';
    } else if (/(?:مبني\s*للمجهول|passive\s*voice)/i.test(text)) {
      topic = 'Passive Voice Constructions (المبني للمجهول)';
    } else if (/(?:أفعال\s*اصطلاحية|افعال\s*اصطلاحية|phrasal\s*verbs?)/i.test(text)) {
      topic = 'Essential Phrasal Verbs & Collocations (الأفعال المركبة والمتلازمات اللفظية)';
    } else if (/(?:كلمات|مفردات|vocabulary|vocab)/i.test(text)) {
      topic = 'Lexical Vocabulary & Contextual Word Choice (المفردات اللغوية وحصيلة الكلمات)';
    } else if (/(?:سفر|مطارات|فنادق|travel)/i.test(text)) {
      topic = 'Travel, Navigation & Hospitality English (الإنجليزية للسفر والمطارات)';
    } else if (/(?:أعمال|وظائف|مقابلة\s*عمل|business)/i.test(text)) {
      topic = 'Professional Business English & Workplace Communication (الإنجليزية المهنية وبيئة العمل)';
    } else if (isDiagnosticPlacement) {
      topic = 'Diagnostic Placement Assessment (اختبار تحديد المستوى الأكاديمي الشامل)';
    }

    // 4. Question Count & Duration
    let questionCount = 5;
    const countMatch = /(?:(\d+)\s*(?:اسئلة|أسئلة|سؤال|questions?|q\b)|(?:اسئلة|أسئلة|سؤال)\s*(\d+))/i.exec(text);
    if (countMatch) {
      const num = parseInt(countMatch[1] || countMatch[2], 10);
      if (!isNaN(num) && num >= 3 && num <= 20) {
        questionCount = num;
      }
    } else if (isDiagnosticPlacement) {
      questionCount = 6;
    }

    // Rational exam duration: 1.2 to 1.5 minutes per question
    const durationMinutes = Math.max(5, Math.ceil(questionCount * 1.4));
    const passingScore = 70;

    // CEFR Scope details
    const cefrDescriptors: Record<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2', { ar: string; scope: string }> = {
      A1: {
        ar: 'مبتدئ جداً (Breakthrough)',
        scope: 'Present simple (be, have, do), basic personal pronouns (I, you, he, she), singular/plural with -s, basic demonstratives (this, that), everyday concrete vocabulary (family, food, numbers, colors). NO complex clauses, NO inversion, NO passives.'
      },
      A2: {
        ar: 'مبتدئ / أساسي (Waystage)',
        scope: 'Past simple (regular -ed, common irregulars: went, saw, bought), future with "going to", comparative adjectives (bigger, more expensive), basic prepositions (in, on, at, under), modal "can/could". Everyday interactions and routine tasks.'
      },
      B1: {
        ar: 'متوسط (Threshold)',
        scope: 'Present perfect vs. Past simple (since, for, already, yet), First & Second conditionals (If + past, would), modals of obligation/permission (must, have to, should), basic passive voice, common phrasal verbs, connectors (although, however).'
      },
      B2: {
        ar: 'فوق المتوسط (Vantage)',
        scope: 'Third conditionals, mixed conditionals, passive voice in all tenses, reported speech, relative clauses (defining/non-defining), wish / if only, advanced phrasal verbs, collocations, formal linking devices (moreover, whereas, despite).'
      },
      C1: {
        ar: 'متقدم (Effective Operational Proficiency)',
        scope: 'Inversion (Had I known, Little did she realize, Seldom have we seen), subjunctive mood (It is essential that he be...), cleft sentences (It was... that), nuanced idioms, subtle collocations, discourse markers, stylistic precision.'
      },
      C2: {
        ar: 'محترف / إتقان تام (Mastery)',
        scope: 'Mastery-level idiomatic precision, literary inversion, archaic or subtle grammatical subtleties, complex rhetoric, socio-linguistic register nuances, near-native Oxford/Cambridge proficiency.'
      }
    };

    const descriptor = cefrDescriptors[targetLevel] || cefrDescriptors.B1;

    return {
      targetLevel,
      levelDescriptorAr: descriptor.ar,
      cefrGrammarScope: descriptor.scope,
      topic,
      isDiagnosticPlacement,
      isHistoryReview,
      questionCount,
      durationMinutes,
      passingScore,
      historyMistakes,
      recentVocabulary: []
    };
  }

  /**
   * Deep Contextual Search Intent Evaluator:
   * 1. Reconstructs multi-turn conversational antecedent entities
   * 2. Evaluates real-time / current facts (finance, gold, 2026 events, tech docs, sports, weather)
   * 3. Enforces strict negative suppressors (math, coding logic, creative writing, memory recall, images)
   * 4. Extracts a clean topic string for dynamic display (Fathom Search of [Topic])
   */
  public static evaluateContextualSearchIntent(request: DynamicTuningRequest): ExtractedSearchContext {
    const rawText = (request.userPrompt || '').trim();
    const history = Array.isArray(request.conversationHistory) ? request.conversationHistory : [];

    // 1. Explicit user toggle switch
    if (request.deepSearch) {
      const cleanQ = extractCleanSearchQuery(rawText) || rawText;
      let cleanTopic = cleanQ;
      const words = cleanTopic.split(/\s+/);
      if (words.length > 7) {
        cleanTopic = words.slice(0, 6).join(' ');
      }
      return {
        shouldSearch: true,
        extractedQuery: cleanQ,
        extractedTopic: cleanTopic,
        reason: 'User explicitly activated web search toggle.'
      };
    }

    // 2. Strict Negative Anti-Search Suppressors (Zero false positives)
    if (this.isImageGenerationOrEditIntent(rawText)) {
      return { shouldSearch: false, extractedQuery: '', extractedTopic: '', reason: 'Image creation or manipulation intent.' };
    }

    // Pure mathematics, logic proofs, equation solving
    if (/^(?:احسب|حل\s*المعادلة|حل\s*المعادله|ما\s*ناتج|اوجد\s*قيمة|\d+\s*[\+\-\*\/]\s*\d+|calculate|solve\s+for\s+x)\b/i.test(rawText)) {
      return { shouldSearch: false, extractedQuery: '', extractedTopic: '', reason: 'Pure mathematical calculation or equation solving.' };
    }

    // Pure creative writing or poems
    if (/^(?:اكتب\s*لي\s*(?:قصيدة|شعر|قصة|رواية|خاطرة)|الف\s*لي\s*قصة|write\s+a\s+poem|write\s+a\s+story)\b/i.test(rawText)) {
      return { shouldSearch: false, extractedQuery: '', extractedTopic: '', reason: 'Creative fiction or poetry generation.' };
    }

    // 3. Autonomous Multi-Turn Context Intent Classification
    const classification = classifyContextualQueryIntent(rawText, history, {
      explicitDeepSearch: Boolean(request.deepSearch)
    });

    if (classification.should_search) {
      const topic = classification.extractedTopic || classification.extractedQuery || rawText;
      return {
        shouldSearch: true,
        extractedQuery: classification.extractedQuery || rawText,
        extractedTopic: topic,
        reason: classification.reason || 'Real-time factual inquiry requiring live verified intelligence.'
      };
    }

    return {
      shouldSearch: false,
      extractedQuery: '',
      extractedTopic: '',
      reason: 'Standard internal conversational and analytical reasoning.'
    };
  }

  /**
   * Evaluates if a model qualifies as a Cyber Ultra flagship model (deepseek-v4-pro-cyber-2.6, fathom-cyber-2.6, etc.)
   */
  public static isCyberUltraModel(modelName: string): boolean {
    const m = (modelName || '').toLowerCase().trim();
    return (
      m.includes('pro-cyber') ||
      m.includes('pro-cyper') ||
      m.includes('cyber-ultra') ||
      m.includes('cyber-2.6-ultra') ||
      m.includes('quant-3') ||
      m.includes('fathom-quant') ||
      m.includes('spark-1.3') ||
      m.includes('muse-spark-1.3') ||
      m === 'deepseek-v4-pro-cyber-2.6' ||
      m === 'deepseek-v4-pro-cyber-2.1' ||
      m === 'fathom-cyber-2.6' ||
      m === 'fathom-cyber-2.1' ||
      m === 'fathom-quant-3' ||
      m === 'deepseek-v4-pro' ||
      m === 'deepseek/deepseek-v4-pro'
    );
  }

  /**
   * Extracts the most recent neural image or uploaded image from conversation history.
   */
  public static extractPriorNeuralImage(
    history: Array<{ role: string; content: any }>
  ): PriorNeuralImageContext | null {
    if (!Array.isArray(history) || history.length === 0) return null;

    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      const content = typeof msg.content === 'string'
        ? msg.content
        : Array.isArray(msg.content)
          ? msg.content.map((c: any) => (c.type === 'text' ? (c.text || '') : (c.text || ''))).join(' ')
          : '';

      const directImg = (msg as any).image || ((msg as any).images && (msg as any).images[0]) || (msg as any).image_url || (msg as any).imageUrl;

      // 1. Check for ```neural-image ... ``` block in assistant message
      const neuralMatch = /```(?:neural-image|neural_image|image-studio|image_studio)?\s*(\{[\s\S]*?\})\s*```/i.exec(content);
      if (neuralMatch) {
        let parsed: any = null;
        try {
          parsed = JSON.parse(neuralMatch[1]);
        } catch {
          // Robust fallback regex extraction if JSON had trailing comma, unescaped quote or minor cut-off
          const promptM = neuralMatch[1].match(/"prompt"\s*:\s*"((?:\\.|[^"\\])*)"/);
          const imgM = neuralMatch[1].match(/"(?:imageUrl|processedImage|originalImage)"\s*:\s*"((?:\\.|[^"\\])*)"/);
          const seedM = neuralMatch[1].match(/"seed"\s*:\s*(\d+)/);
          const opM = neuralMatch[1].match(/"operation"\s*:\s*"([^"]+)"/);
          const titleM = neuralMatch[1].match(/"title"\s*:\s*"([^"]+)"/);
          const styleM = neuralMatch[1].match(/"style"\s*:\s*"([^"]+)"/);
          const ratioM = neuralMatch[1].match(/"aspectRatio"\s*:\s*"([^"]+)"/);
          if (promptM || imgM || seedM) {
            parsed = {
              prompt: promptM ? promptM[1].replace(/\\"/g, '"') : '',
              imageUrl: imgM ? imgM[1] : '',
              seed: seedM ? parseInt(seedM[1], 10) : undefined,
              operation: opM ? opM[1] : 'edit',
              title: titleM ? titleM[1] : '',
              style: styleM ? styleM[1] : 'photorealistic',
              aspectRatio: ratioM ? ratioM[1] : '1:1'
            };
          }
        }

        if (parsed && typeof parsed === 'object') {
          const prompt = parsed.prompt || '';
          let imageUrl = parsed.imageUrl || parsed.processedImage || directImg || '';

          // Extract seed from parsed JSON or its URL parameters
          let seed: number | undefined = (typeof parsed.seed === 'number' && !isNaN(parsed.seed))
            ? parsed.seed
            : (typeof parsed.parameters?.seed === 'number' && !isNaN(parsed.parameters.seed))
              ? parsed.parameters.seed
              : undefined;

          if (seed === undefined && imageUrl) {
            try {
              const u = new URL(imageUrl);
              const s = u.searchParams.get('seed');
              if (s && !isNaN(Number(s))) seed = Number(s);
            } catch {}
          }

          return {
            prompt,
            imageUrl: imageUrl || undefined,
            operation: parsed.operation || 'generate',
            title: parsed.title || '',
            style: parsed.style || 'photorealistic',
            aspectRatio: parsed.aspectRatio || '1:1',
            seed,
            sourceRole: msg.role
          };
        }
      }

      // 2. Check for image URL in content (including Supabase Storage chat-images and standard image extensions)
      const genericImgMatch = content.match(/https?:\/\/[^\s)]+?(?:\.(?:png|jpg|jpeg|webp)|supabase\.co\/storage\/v1\/object\/public\/chat-images\/[^\s)]+)(?:\?[^\s)]*)?/i);
      if (genericImgMatch) {
        return {
          prompt: '',
          imageUrl: genericImgMatch[0],
          operation: 'generate',
          title: '',
          style: 'photorealistic',
          aspectRatio: '1:1',
          sourceRole: msg.role
        };
      }

      // 3. Check for attached image on message (user or assistant)
      if (directImg && typeof directImg === 'string') {
        return {
          imageUrl: directImg,
          operation: 'human_edit',
          title: msg.role === 'user' ? 'صورة مرفوعة' : 'صورة سابقة',
          sourceRole: msg.role
        };
      }

      // 4. Check for uploaded image in multimodal content array
      if (Array.isArray(msg.content)) {
        const imgItem = msg.content.find((c: any) => c.type === 'image_url' || c.image_url);
        if (imgItem) {
          const url = typeof imgItem.image_url === 'string' ? imgItem.image_url : imgItem.image_url?.url;
          if (url && typeof url === 'string') {
            return {
              imageUrl: url,
              operation: 'human_edit',
              title: 'صورة مرفوعة',
              sourceRole: msg.role
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Discerns whether the user intends to MODIFY an existing image (edit), ADD an element (addition),
   * or GENERATE a brand new image from scratch (generation).
   */
  public static detectImageOperationType(
    userPrompt: string,
    hasPriorImage: boolean = true
  ): ImageOperationType {
    const text = (userPrompt || '').trim().toLowerCase();

    // If no prior image exists, it is a brand new generation
    if (!hasPriorImage) {
      return 'generation';
    }

    // Explicit request for a completely separate or brand new image
    const isExplicitNewImage = /(?:صورة\s+جديدة|تصميم\s+جديد|صمم\s+(?:لي\s+)?صورة\s+جديدة|انشئ\s+(?:لي\s+)?صورة\s+جديدة|صورة\s+أخرى|صورة\s+اخري|new\s+image|another\s+image|from\s+scratch)/i.test(text);
    if (isExplicitNewImage) {
      return 'generation';
    }

    // Check for Addition (إضافة)
    const isAddition = CONTEXTUAL_IMAGE_ADDITION_PATTERNS.some(p => p.test(text));

    // Check for Edit / Modification (تعديل)
    const isEdit = CONTEXTUAL_IMAGE_EDIT_PATTERNS.some(p => p.test(text));

    if (isAddition && !isEdit) {
      return 'addition';
    }
    if (isEdit) {
      // If user says "عدل وضيف شجرة" (edit and add a tree), addition takes precedence as a new object is introduced
      if (isAddition && /(?:ضيف|اضف|أضف|حط|ركب)\s+(?:شجرة|شخص|طائر|قطة|كلب|سيارة|قمر|شمس|مطر|نظارة|كاب|ساعة|طاولة|كرسي|عنصر|تفصيل)/i.test(text)) {
        return 'addition';
      }
      return 'edit';
    }
    if (isAddition) {
      return 'addition';
    }

    // Fallback: short follow-up under an active image context (e.g. "لون أحمر", "ذهبي", "بالليل", "بدون مطر")
    if (/(?:أحمر|احمر|حمرا|حمراء|أزرق|ازرق|زرقا|زرقاء|أخضر|اخضر|خضرا|خضراء|أصفر|اصفر|صفرا|صفراء|أسود|اسود|سودا|سوداء|أبيض|ابيض|بيضا|بيضاء|ذهبي|ذهبيه|ذهبية|فضي|فضيه|فضية|كحلي|رمادي|مات|مطفي|لامع|كروم|وردي|بنفسجي|برتقالي|بني|ليل|نهار|غروب|شروق|ممطر|بدون|مع|gold|golden|silver|chrome|black|white|red|blue|yellow|green)/i.test(text)) {
      return 'edit';
    }

    return 'generation';
  }

  /**
   * Resilient normalization of neural-image blocks to guarantee zero-error adherence
   * to user terminology rules (replacing "إنشاء" with "تعديل" or "إضافة" based on detected intent).
   */
  public static normalizeNeuralImageBlock(
    text: string,
    operationType?: ImageOperationType,
    priorImageContext?: PriorNeuralImageContext
  ): string {
    if (!text || !operationType || operationType === 'generation') return text;

    return text.replace(
      /```(?:neural-image|neural_image|image-studio|image_studio)?\s*(\{[\s\S]*?\})\s*```/gi,
      (match, jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed && typeof parsed === 'object') {
            const isAdd = operationType === 'addition';
            const prefix = isAdd ? 'إضافة' : 'تعديل';
            const expectedOp = isAdd ? 'add_element' : 'edit';

            // Sanitize title: cleanly strip any previous creation/edit prefix and reapply clean prefix
            if (typeof parsed.title === 'string') {
              let t = parsed.title.trim();
              t = t.replace(/^(?:إنشاء|انشاء|تصميم|توليد|صنع|create|generate|design)\s*[:：\-–—]?\s*/i, '');
              t = t.replace(/^(?:تعديل|إضافة|اضافة)\s*[:：\-–—]?\s*/i, '');
              t = `${prefix}: ${t}`.trim();
              parsed.title = t;
            } else {
              parsed.title = `${prefix}: ${isAdd ? 'إضافة عنصر إلى المشهد' : 'تعديل الصورة'}`;
            }

            // Sanitize operation
            if (parsed.operation === 'generate' || !parsed.operation) {
              parsed.operation = expectedOp;
            }

            // Inject original image link if missing or if filled with invalid placeholder string (only if valid http URL to prevent embedding huge base64 into prompt text)
            const isInvalidOrig = !parsed.originalImage ||
              typeof parsed.originalImage !== 'string' ||
              parsed.originalImage.includes('<') ||
              parsed.originalImage.includes('>') ||
              parsed.originalImage.startsWith('رابط') ||
              parsed.originalImage.startsWith('الصورة') ||
              (!parsed.originalImage.startsWith('http') && !parsed.originalImage.startsWith('data:image/'));

            if (isInvalidOrig && priorImageContext?.imageUrl && priorImageContext.imageUrl.startsWith('http')) {
              parsed.originalImage = priorImageContext.imageUrl;
            } else if (isInvalidOrig && (!parsed.originalImage || parsed.originalImage.startsWith('data:'))) {
              // Leave empty for client/ChatMessage to auto-bind priorImage without base64 truncation
              parsed.originalImage = '';
            }

            // Guarantee preservation of prior seed to lock environment and lighting 100%
            if (priorImageContext?.seed !== undefined) {
              parsed.seed = priorImageContext.seed;
            } else if (typeof parsed.seed !== 'number' || isNaN(parsed.seed)) {
              // Deterministic fallback seed
              parsed.seed = 482910;
            }

            // Ensure aspectRatio is maintained
            if (!parsed.aspectRatio && priorImageContext?.aspectRatio) {
              parsed.aspectRatio = priorImageContext.aspectRatio;
            }

            // Enhance typography and OCR readability for any in-image text/plate/sign requests
            if (typeof parsed.prompt === 'string') {
              const hasTextOrPlate = /(?:plate|license|sign|text|letters?|numbers?|logo|لوحة|نمرة|كتابة|نص|حروف|أرقام)/i.test(
                `${parsed.prompt} ${parsed.title || ''} ${parsed.description || ''}`
              );
              if (hasTextOrPlate && !parsed.prompt.includes('readable by OCR')) {
                parsed.prompt = `${parsed.prompt.trim()}, crisp legible typography, authentic official vehicle plate format, perfectly formed alphanumeric characters, razor-sharp edges, high contrast, zero gibberish, zero scrambled letters, fully legible by optical character recognition (OCR) and humans`;
              }
            }

            // Sanitize description
            if (typeof parsed.description === 'string' && (parsed.description.includes('تم إنشاء') || parsed.description.includes('تم توليد'))) {
              parsed.description = parsed.description
                .replace(/تم\s*إنشاء/g, isAdd ? 'تمت إضافة' : 'تم تعديل')
                .replace(/تم\s*توليد/g, isAdd ? 'تمت إضافة' : 'تم تعديل');
            }

            return `\`\`\`neural-image\n${JSON.stringify(parsed, null, 2)}\n\`\`\``;
          }
        } catch {
          // fallback
        }
        return match;
      }
    );
  }

  /**
   * Analyzes user request text, history and metadata to detect intent, complexity and hallucination risk.
   */
  public static detectIntentAndComplexity(request: DynamicTuningRequest): {
    intent: UserIntentCategory;
    confidence: number;
    complexity: TaskComplexity;
    hallucinationRisk: HallucinationRisk;
    rationale: string;
    extractedSearchContext?: ExtractedSearchContext;
  } {
    const text = (request.userPrompt || '').trim();
    const pureUserText = this.extractPureUserText(text);
    const isMatany = Boolean(request.isMatanyMode);
    const hasImages = Boolean(request.hasMultimodalImages);
    const hasMediaOrZip = Boolean(request.hasVideoOrAudio || request.hasZipOrCodeFiles);

    const isQuestionOrInquiry = /^(?:اي|أي|ما|ماذا|كيف|لماذا|ليه|هل|اشرح|شرح|وضح|فسر|معنى|ماذا\s*تعني|what|why|how|explain|can\s+you\s+explain)\b/i.test(pureUserText) ||
      /\b(?:اي\s*فائدة|ما\s*فائدة|فائدة|ماهي\s*فائدة|ما\s*المقصود|ايش\s*فايدة)\b/i.test(pureUserText);

    const hasExplicitImperativeImageCreation = /(?:صمم\s*صورة|انشئ\s*صورة|أنشئ\s*صورة|ولد\s*صورة|اعمل\s*صورة|ارسم\s*صورة|توليد\s*صورة|generate\s*(?:an?\s*)?image|create\s*(?:an?\s*)?image|draw\s*(?:an?\s*)?image|make\s*(?:an?\s*)?image)\b/i.test(pureUserText);

    // Multi-turn context extraction from conversation history
    const historySnippets = (request.conversationHistory || [])
      .slice(-4)
      .map(m => {
        if (typeof m.content === 'string') return m.content;
        if (Array.isArray(m.content)) return m.content.map((c: any) => c.text || '').join(' ');
        return JSON.stringify(m.content || '');
      })
      .filter(Boolean);
    const historyText = historySnippets.join(' ');

    const isTrivialOrDirect =
      GREETING_PATTERNS.some(p => p.test(text)) ||
      SIMPLE_ARITHMETIC_PATTERN.test(text) ||
      TRIVIAL_DIRECT_QA_PATTERNS.some(p => p.test(text)) ||
      (text.length < 60 && /^(?:ما\s*(?:هي|هو|اسم|معنى|تعريف)|من\s*(?:هو|هي)|أين\s*تقع|اين\s*تقع|كم\s*(?:عدد|عمر|يساوي)|متى\s*(?:ولد|توفي|تأسس))\b/i.test(text));

    const isFollowUpPrompt = !isTrivialOrDirect && (
      text.length < 120 ||
      /(وضح|اشرح|أكمل|اكمل|أصلح|صلح|كيف|تابع|المزيد|تفاصيل|خطوة|explain|clarify|continue|fix|more|step)/i.test(text)
    );

    // 0. GPAENG Sovereign Diagnostic Trigger Check (Instant Absolute Priority)
    if (/\bGPAENG\b/i.test(text)) {
      return {
        intent: 'SYSTEM_DIAGNOSTIC_GPAENG',
        confidence: 1.0,
        complexity: 'EXHAUSTIVE_ARCHITECTURAL',
        hallucinationRisk: 'EXTREME',
        rationale: 'Sovereign diagnostic keyword GPAENG detected. Live telemetry extraction & RCA remediation active.'
      };
    }

    // 1. Multimodal / Archive Priority
    if (hasMediaOrZip) {
      return {
        intent: 'MULTIMODAL_MEDIA_AND_ARCHIVE_DECONSTRUCTION',
        confidence: 0.98,
        complexity: 'EXHAUSTIVE_ARCHITECTURAL',
        hallucinationRisk: 'EXTREME',
        rationale: 'Active ZIP archives, multi-file repos, audio or video stream frames detected.'
      };
    }

    if (hasImages) {
      // 1. Explicit Vectorization to SVG Check (strictly requires explicit vector/svg keywords or tags)
      const isExplicitImageToSvgRequest = (
        /(?:svg|فيكتور|متجهات|vector|vectorize)/i.test(text) &&
        /(?:حول|تحويل|عدل|تعديل|غير|تغيير|بدل|تبديل|ادخل|أدخل|اضف|أضف|احذف|شيل|ارسم|صمم|اعمل|سوي|طلع|هات|convert|vectorize|transform|edit|modify|recreate|draw)/i.test(text)
      ) ||
      /<svg[\s\S]*?<\/svg>/i.test(text) ||
      /```svg/i.test(text) ||
      /(?:حول|تحويل)\s+(?:الصورة|اللوجو|الشعار)?\s*(?:دي|المرفقة|هذه)?\s*(?:لـ|إلى)?\s*(?:svg|فيكتور|متجهات)/i.test(text);

      if (isExplicitImageToSvgRequest) {
        return {
          intent: 'SVG_VECTOR_STUDIO_AND_DESIGN',
          confidence: 0.99,
          complexity: 'EXHAUSTIVE_ARCHITECTURAL',
          hallucinationRisk: 'HIGH',
          rationale: 'Explicit uploaded image vectorization to SVG Studio requested.'
        };
      }

      // 2. Pure inspection / OCR / Q&A check on the uploaded image (strictly questions asking to inspect, transcribe or describe)
      const isPureInspectionOrOcrQuery = /(?:ما\s+(?:هذا|هذه|نوع|موديل|تفاصيل|المكتوب|النص|الموجود|في\s+الصورة)|اشرح\s+(?:الصورة|المحتوى|الشكل)|حلل\s+الصورة|فحص\s+الصورة|استخرج\s+النصوص?|اقرأ\s+(?:النص|الكتابة|المكتوب|الورقة|المستند)|ترجم\s+ما\s+في|حل\s+(?:المسألة|السؤال|المعادلة|الكود)|هل\s+هذا|من\s+(?:هذا|في\s+الصورة)|what\s+is|explain\s+this|read\s+text|ocr|extract\s+text|analyze\s+image|transcribe)/i.test(text);

      // 3. Cyber Ultra Sovereign Neural Image Studio & Processing (Inpainting, Recoloring, Background Removal, 4K Upscale, Compositing, Product/Text Edit, License Plate Edit)
      const isNeuralImageEditRequest = !isPureInspectionOrOcrQuery && (!isQuestionOrInquiry || hasExplicitImperativeImageCreation) && (
        NEURAL_IMAGE_PATTERNS.some(p => p.test(pureUserText)) ||
        CONTEXTUAL_IMAGE_EDIT_PATTERNS.some(p => p.test(pureUserText)) ||
        CONTEXTUAL_IMAGE_ADDITION_PATTERNS.some(p => p.test(pureUserText)) ||
        /(?:اجعل|خلي|خليه|خلها|خليها|سوي|سوه|سوها|غير|غيرلي|عدل|عدلي|بدل|بدلي|استبدل|امسح|احذف|شيل|ضيف|أضيف|اضيف|اضف|أضف|حط|حطلي|ضع|ركب|ركبلي|لون|صبغ|حول|صلح|ظبط)/i.test(pureUserText) ||
        /(?:لوحة|لوحه|نمرة|نمره|رقم|ارقام|أرقام|شعار|لوجو|license\s*plate|plate|مصرية|مصريه|سعودية|سعوديه)/i.test(pureUserText) ||
        /(?:عدل|تعديل|غير|تغيير|بدل|تبديل|ادخل|أدخل|اضف|أضف|احذف|شيل)\s+(?:لي\s+)?(?:في\s+الصورة|على\s+الصورة|بالصورة|فيها|الصورة\s+المرفقة|الصورة\s+دي)/i.test(pureUserText)
      );

      if (isNeuralImageEditRequest) {
        return {
          intent: 'NEURAL_IMAGE_STUDIO_AND_PROCESSING',
          confidence: 0.99,
          complexity: 'EXHAUSTIVE_ARCHITECTURAL',
          hallucinationRisk: 'LOW',
          rationale: 'Cyber Ultra Sovereign Neural Image Studio: raster photo editing, inpainting, recoloring, background removal, or 4K super-resolution.'
        };
      }

      return {
        intent: 'MULTIMODAL_IMAGE_AND_FORENSICS',
        confidence: 0.98,
        complexity: 'DEEP_ANALYTICAL',
        hallucinationRisk: 'EXTREME',
        rationale: 'Multimodal image payloads detected requiring optical OCR and forensics.'
      };
    }

    const priorNeuralImage = this.extractPriorNeuralImage(request.conversationHistory || []);
    const isExplicitSvgKeyword = /(?:svg|فيكتور|متجهات|شعاعي|vector)/i.test(text);
    const isCodeOrTextFollowup = !isExplicitSvgKeyword && /(?:كود|برمجة|دالة|ملف|موقع|صفحة|واجهة|html|css|js|ts|python|react|api|bug|error|خطأ|مشكلة|خطة|مقال|نص|شرح|database|قاعدة|قواعد|تقرير|جدول|فحص|بحث|استعلام)/i.test(text);
    const hasVisualTargetInText = /(?:في\s+الصورة|على\s+الصورة|بالصورة|الصورة\s+دي|الصورة\s+المرفقة|الصورة\s+السابقة|الصورة|الخلفية|لون|الوان|ألوان|القميص|الفستان|السيارة|العربية|الشعر|العين|البنطلون|الباب|الجدار|اللوحة|الملامح|البشرة|وجه|شخص|مطر|دخان|ثلج|بالليل|بالنهار|license\s*plate|photo|image)/i.test(pureUserText);

    const isContextualImageEditOrAdd = Boolean(priorNeuralImage) && !isCodeOrTextFollowup && (!isQuestionOrInquiry || hasExplicitImperativeImageCreation) && (
      (hasVisualTargetInText && (CONTEXTUAL_IMAGE_EDIT_PATTERNS.some(p => p.test(pureUserText)) || CONTEXTUAL_IMAGE_ADDITION_PATTERNS.some(p => p.test(pureUserText)))) ||
      NEURAL_IMAGE_PATTERNS.some(p => p.test(pureUserText))
    );

    if (isContextualImageEditOrAdd && !/(?:svg|فيكتور|متجهات|vector)/i.test(text)) {
      const op = this.detectImageOperationType(text, true);
      return {
        intent: 'NEURAL_IMAGE_STUDIO_AND_PROCESSING',
        confidence: 0.99,
        complexity: 'EXHAUSTIVE_ARCHITECTURAL',
        hallucinationRisk: 'LOW',
        rationale: `Contextual image continuity: ${op === 'addition' ? 'adding element' : 'modifying attribute'} on prior image while strictly preserving 100% of scene elements.`
      };
    }

    // 1.b. Fathom ITS Language Exam & Multi-Question Assessment Intent Check
    const isExamRequest = EXAM_ASSESSMENT_PATTERNS.some(p => p.test(text)) ||
      (request.requestedModel?.includes('its') && /(?:امتحان|اختبار|كويز|quiz|exam|test|اسئلة|أسئلة|تحدي|تقييم|قيم|قيّم|قياس)/i.test(text)) ||
      (isFollowUpPrompt && EXAM_ASSESSMENT_PATTERNS.some(p => p.test(historyText)) && /(?:ابدأ|يلا|جاهز|start|ready|go|تمام|نعم)/i.test(text));

    if (isExamRequest) {
      return {
        intent: 'FATHOM_ITS_EXAM_AND_LANGUAGE_ASSESSMENT',
        confidence: 0.99,
        complexity: 'DEEP_ANALYTICAL',
        hallucinationRisk: 'LOW',
        rationale: 'Comprehensive pedagogical CEFR language assessment and MSQ exam suite synthesis requested.'
      };
    }

    // 2. Pure Greeting / Simple Arithmetic / Trivial Direct QA (Sub-Second Latency & Zero Reasoning Stall)
    if (isTrivialOrDirect) {
      return {
        intent: 'GENERAL_CONVERSATION_AND_QUICK_QA',
        confidence: 0.99,
        complexity: 'LIGHT',
        hallucinationRisk: 'LOW',
        rationale: 'Trivial/direct query or greeting calibrated for instantaneous sub-second response without reasoning latency.'
      };
    }

    // 3. Explicit Creative Literary Framing (Takes precedence even when technical topic is mentioned in poem/story)
    if (EXPLICIT_CREATIVE_FRAMING.some(p => p.test(text))) {
      return {
        intent: 'CREATIVE_LITERARY_AND_BRAINSTORMING',
        confidence: 0.95,
        complexity: 'STANDARD',
        hallucinationRisk: 'LOW',
        rationale: 'Explicit creative literary prose or poetry requested on subject matter.'
      };
    }

    // 4. Uninhibited Matany Persona Override (if explicitly active and not a technical prompt)
    const hasTechnicalKeywords = CYBER_PATTERNS.some(p => p.test(text)) ||
      CODE_ENGINEERING_PATTERNS.some(p => p.test(text)) ||
      MATH_DEDUCTIVE_LOGIC_PATTERNS.some(p => p.test(text));

    if (isMatany && !hasTechnicalKeywords) {
      return {
        intent: 'UNINHIBITED_PERSONA_MATANY',
        confidence: 0.95,
        complexity: 'STANDARD',
        hallucinationRisk: 'LOW',
        rationale: 'User engaged in Sovereign Matany uninhibited dialogue mode.'
      };
    }

    // 5. Comparative & Evaluation Check (Takes precedence when user explicitly requests comparison between entities)
    if (COMPARISON_PATTERNS.some(p => p.test(text))) {
      const isExhaustive = text.length > 200 || /(شامل|مفصل|تفصيلي|عميق|benchmarks?)/i.test(text);
      return {
        intent: 'COMPARATIVE_AND_EVALUATION_ANALYSIS',
        confidence: 0.95,
        complexity: isExhaustive ? 'DEEP_ANALYTICAL' : 'STANDARD',
        hallucinationRisk: 'MODERATE',
        rationale: 'Multi-entity product/technology comparison and structured tradeoff analysis.'
      };
    }

    // 6. Cybersecurity & Threat Modeling Check (with conversation history support)
    const matchesCyber = CYBER_PATTERNS.some(p => p.test(text)) ||
      (isFollowUpPrompt && CYBER_PATTERNS.some(p => p.test(historyText)));
    if (matchesCyber) {
      const combined = `${historyText} ${text}`;
      const isExhaustive = combined.length > 250 || /(شامل|كامل|RFC|envoy|kafka|dpop|architecture|معمارية)/i.test(combined);
      return {
        intent: 'CYBERSECURITY_AND_EXPLOIT_AUDITING',
        confidence: 0.98,
        complexity: isExhaustive ? 'EXHAUSTIVE_ARCHITECTURAL' : 'DEEP_ANALYTICAL',
        hallucinationRisk: 'EXTREME',
        rationale: 'Cybersecurity vulnerability audit, exploit engineering, or zero-trust architecture requested.'
      };
    }

    // 6.b. SVG Vector Studio & Design Check with Sovereign Precedence (evaluated ONLY upon DIRECT, explicit SVG/Vector creation intent)
    const isSvgInformationalOrNegative =
      /^(?:ما\s*هو|ما\s*هي|ماذا\s*يعني|كيف\s*(?:أفتح|افتح|استخدم|أستخدم|أتعامل|اتعامل)|اشرح|شرح|ما\s*الفرق\s*بين|قارن\s*بين|how\s+to|what\s+is|explain|difference\s+between)\b/i.test(text) ||
      /(?:بدون\s*svg|لا\s*تستخدم\s*svg|مش\s*svg|ليس\s*svg|not\s+svg|without\s+svg|instead\s+of\s+svg)/i.test(text);

    const isDirectSvgCreation = /(?:كود\s*(?:الـ\s*)?svg|ملف\s*(?:الـ\s*)?svg|رسم\s*(?:الـ\s*)?svg|تصميم\s*(?:الـ\s*)?svg|\.svg\b|بصيغة\s*svg|صيغة\s*svg|كـ\s*svg|على\s*شكل\s*svg|اجعلها\s*svg|مقطوع|مش\s*كامل|أكمل\s*(?:كود\s*)?svg|رسم\s*(?:شعاعي|فيكتور)|رسومات\s*فيكتور|رسمة\s*فيكتور|تصميم\s*فيكتور|متجهات\s*شعاعية|فيكتور|vector\s*graphics?|vector\s*art|vector\s*illustration|\b(?:draw|create|generate|design|output|export|code)\s+(?:an?\s+)?(?:svg|vector)\b|\b(?:make\s+it|convert\s+to|output\s+as)\s+(?:svg|vector)\b)/i.test(text);

    const isExplicitSvgRequested = !isSvgInformationalOrNegative && isDirectSvgCreation;

    const isSvgHistoryFollowup = isFollowUpPrompt && /(?:```svg|<svg)/i.test(historyText);
    const isSvgDesignFollowup = isSvgHistoryFollowup && !isCodeOrTextFollowup &&
      /(?:غير|عدل|بدل|تعديل|تغيير|لون|الوان|ألوان|الخلفية|خلفية|الشعار|اللوجو|الايقونة|الأيقونة|الفيكتور|التصميم|ذهبي|فضي|أبيض|ابيض|اسود|أسود|احمر|أحمر|ازرق|أزرق|اخضر|أخضر|شفافة|شفاف|خليه|اجعله|كبر|صغر|احذف|شيل)/i.test(text) &&
      !/(?:صورة|صوره|photo|image|picture|فوتوغراف|واقعي|واقعية)/i.test(text);

    // Strict Guard: If it's a general image query without direct svg keywords, it must NOT trigger SVG!
    const isImageQueryWithoutSvg = !isExplicitSvgRequested && !isSvgDesignFollowup && (
      Boolean(priorNeuralImage) ||
      /(?:صورة|صوره|photo|image|picture|خلفية\s+شاشة|خلفيه\s+شاشة|wallpaper|بورتريه|portrait|واقعي|واقعية|فوتوغراف|فوتوغرافية|dslr|سينمائي)/i.test(text) ||
      /(?:لون\s+(?:السيارة|العربية|القميص|الفستان|الشعر|العين|البنطلون|الخلفية|الباب|الجدار)|تعديل\s+الصورة|غير\s+الصورة|تغيير\s+الصورة|edit\s+photo|edit\s+image|recolor)/i.test(text) ||
      /(?:صمم|صممي|انشئ|أنشئ|ولد|توليد|اعمل|اعملي|سوي|سويلي|طلع|طلعلي|اريد|أريد|عايز|عاوز|بدي|محتاج|تخيل|ارسم|ارسمي|هات|جهز|صنع)\s+(?:لي\s+)?(?:صورة|صوره|خلفية\s+شاشة|لوحة|بورتريه)/i.test(text)
    );

    const matchesSvg = !isSvgInformationalOrNegative && !isImageQueryWithoutSvg && (
      isExplicitSvgRequested ||
      (!isCodeOrTextFollowup && (
        isSvgDesignFollowup ||
        SVG_DESIGN_PATTERNS.some(p => p.test(text)) ||
        (isFollowUpPrompt && isDirectSvgCreation && SVG_DESIGN_PATTERNS.some(p => p.test(historyText)))
      ))
    );
    if (matchesSvg) {
      const combined = `${historyText} ${text}`;
      const isExhaustive = combined.length > 150 || /(شامل|مفصل|معقد|تفصيلي|مشهد|بانوراما|landscape|detailed|infographic)/i.test(combined);
      return {
        intent: 'SVG_VECTOR_STUDIO_AND_DESIGN',
        confidence: 0.99,
        complexity: isExhaustive ? 'EXHAUSTIVE_ARCHITECTURAL' : 'DEEP_ANALYTICAL',
        hallucinationRisk: 'HIGH',
        rationale: 'SVG vector illustration, vector logo, icon set, or visual vector graphic generation requested.'
      };
    }

    // 6.c. Cyber Ultra & Fathom Quant Neural Image Studio & Photorealistic Generation Check
    const isCodeOrHowToQuery = /(?:كود|برمجة|دالة|مكتبة|بايثون|جافاسكريبت|رياكت|api|endpoint|code|script|component|function)\b/i.test(text) ||
      /^(?:كيف|طريقة|شرح|اشرح|لماذا|ليه|ما\s*هو|ما\s*هي|ماذا\s*يعني|ما\s*الفرق|how\s+to|explain|why|what\s+is)\b/i.test(text);
    const hasExplicitCreateCmd = /(?:صمم|صممي|انشئ|أنشئ|ولد|توليد|اعمل|اعملي|سوي|سويلي|طلع|طلعلي|اريد|أريد|عايز|عاوز|بدي|محتاج|تخيل|ارسم|ارسمي|هات|جهز|صنع|create|generate|design|draw|make|render)\s+(?:لي\s+)?(?:صورة|صوره|خلفية|خلفيه|لوحة|بورتريه|photo|image|picture|wallpaper|portrait)/i.test(pureUserText);

    const matchesNeuralGen = !isExplicitSvgRequested && (!isCodeOrHowToQuery || hasExplicitCreateCmd) && !isCodeOrTextFollowup && (!isQuestionOrInquiry || hasExplicitCreateCmd) && (
      NEURAL_IMAGE_GENERATION_PATTERNS.some(p => p.test(pureUserText)) ||
      (isFollowUpPrompt && !isSvgHistoryFollowup && hasVisualTargetInText && NEURAL_IMAGE_GENERATION_PATTERNS.some(p => p.test(historyText)))
    );

    if (matchesNeuralGen && (!isExplicitSvgRequested || isSvgInformationalOrNegative) && !(isSvgHistoryFollowup && /(?:الشعار|اللوجو|الايقونة|الأيقونة|الفيكتور|التصميم|الخلفية|لون|الوان|ألوان|ذهبي|فضي)/i.test(text))) {
      return {
        intent: 'NEURAL_IMAGE_STUDIO_AND_PROCESSING',
        confidence: 0.98,
        complexity: 'EXHAUSTIVE_ARCHITECTURAL',
        hallucinationRisk: 'LOW',
        rationale: 'Cyber Ultra / Fathom Quant Sovereign Neural Image Studio: photorealistic raster photo generation requested.'
      };
    }

    // 8. Mathematical & Deductive Logic Check (with conversation history support - prioritized before code engineering)
    const matchesMath = MATH_DEDUCTIVE_LOGIC_PATTERNS.some(p => p.test(text)) ||
      (isFollowUpPrompt && MATH_DEDUCTIVE_LOGIC_PATTERNS.some(p => p.test(historyText)));
    if (matchesMath) {
      const isSimpleMath = SIMPLE_ARITHMETIC_PATTERN.test(text) ||
        (!/(تكامل|تفاضل|مفارقة|نسبية|أفق\s*حدث|ثقب\s*أسود|سرعة\s*الضوء|ساعة\s*بيولوجية|برهان|proof|theorem|نظرية|اينشتاين|شرودنجر|كوانتم|integral|differential|relativity)/i.test(text) && text.length < 80);

      return {
        intent: isSimpleMath ? 'GENERAL_CONVERSATION_AND_QUICK_QA' : 'MATHEMATICAL_AND_DEDUCTIVE_LOGIC',
        confidence: 0.96,
        complexity: isSimpleMath ? 'LIGHT' : 'DEEP_ANALYTICAL',
        hallucinationRisk: isSimpleMath ? 'LOW' : 'EXTREME',
        rationale: isSimpleMath
          ? 'Simple arithmetic calculation calibrated for immediate sub-second result.'
          : 'Formal deductive logic puzzle, mathematical derivation, or theoretical physics constraint.'
      };
    }

    // 9. Code Engineering & Architecture Check (with conversation history support)
    const matchesCode = CODE_ENGINEERING_PATTERNS.some(p => p.test(text)) ||
      (isFollowUpPrompt && CODE_ENGINEERING_PATTERNS.some(p => p.test(historyText)));
    if (matchesCode) {
      const combined = `${historyText} ${text}`;
      const isExhaustive = combined.length > 200 || /(معمارية|بنية|مكتبة|مكتبات|مشروع|refactor|architecture)/i.test(combined);
      return {
        intent: 'CODE_ENGINEERING_AND_ARCHITECTURE',
        confidence: 0.95,
        complexity: isExhaustive ? 'EXHAUSTIVE_ARCHITECTURAL' : 'DEEP_ANALYTICAL',
        hallucinationRisk: 'EXTREME',
        rationale: 'Software development, concurrency, AST refactoring, or algorithmic implementation requested.'
      };
    }

    // 10. Scientific & Academic Research Check (with conversation history support)
    const matchesScience = SCIENTIFIC_RESEARCH_PATTERNS.some(p => p.test(text)) ||
      (isFollowUpPrompt && SCIENTIFIC_RESEARCH_PATTERNS.some(p => p.test(historyText)));
    if (matchesScience) {
      return {
        intent: 'SCIENTIFIC_AND_ACADEMIC_RESEARCH',
        confidence: 0.94,
        complexity: 'DEEP_ANALYTICAL',
        hallucinationRisk: 'HIGH',
        rationale: 'Academic science, astrophysics, genomics, or empirical clinical inquiry.'
      };
    }

    // 11. Creative Literary Check
    if (CREATIVE_LITERARY_PATTERNS.some(p => p.test(text))) {
      return {
        intent: 'CREATIVE_LITERARY_AND_BRAINSTORMING',
        confidence: 0.90,
        complexity: 'STANDARD',
        hallucinationRisk: 'LOW',
        rationale: 'Creative literary prose, poetry, narrative fiction, or brainstorming requested.'
      };
    }

    // 12. Deep Contextual Search or Realtime Grounding Check
    const searchAssessment = this.evaluateContextualSearchIntent(request);
    if (searchAssessment.shouldSearch) {
      return {
        intent: 'FACTUAL_SEARCH_AND_REALTIME_GROUNDING',
        confidence: 0.95,
        complexity: 'STANDARD',
        hallucinationRisk: 'HIGH',
        rationale: searchAssessment.reason,
        extractedSearchContext: searchAssessment
      };
    }

    // Default Fallback
    const isLong = text.length > 150;
    return {
      intent: isLong ? 'TECHNICAL_DOCUMENTATION' : 'GENERAL_CONVERSATION_AND_QUICK_QA',
      confidence: 0.80,
      complexity: isLong ? 'STANDARD' : 'LIGHT',
      hallucinationRisk: 'MODERATE',
      rationale: isLong ? 'Standard technical or factual inquiry.' : 'Conversational dialogue.'
    };
  }

  /**
   * Dynamically tunes hyperparameters specifically calibrated to the foundation model architecture
   * and the decomposed user intent.
   */
  public static tuneHyperparameters(
    intent: UserIntentCategory,
    complexity: TaskComplexity,
    modelFamily: ModelFamily,
    overrides?: { explicitTemperature?: number }
  ): TunedHyperparameters {
    // Default base tuning
    let temperature = 0.5;
    let top_p = 0.95;
    let frequency_penalty = 0.0;
    let presence_penalty = 0.0;
    let max_tokens = 16384;
    const stop: string[] = [];

    // ─────────────────────────────────────────────────────────────────────────
    // INTENT-DRIVEN HYPERPARAMETER CALIBRATION
    // ─────────────────────────────────────────────────────────────────────────
    switch (intent) {
      case 'SYSTEM_DIAGNOSTIC_GPAENG':
        // Surgical diagnostic reasoning, zero hallucinations, maximum analytical rigor
        temperature = 0.15;
        top_p = 0.95;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 32768; // Maximum depth for full root cause analysis and comprehensive code patches
        break;

      case 'CYBERSECURITY_AND_EXPLOIT_AUDITING':
        // Zero-deviation determinism: low temperature to eliminate imaginary CVEs/flaws
        temperature = 0.20;
        top_p = 0.95;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 32768; // Full depth for complete PoC and remediation
        break;

      case 'CODE_ENGINEERING_AND_ARCHITECTURE':
        // High syntactic fidelity and exactness
        temperature = 0.18;
        top_p = 0.95;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 32768;
        break;

      case 'SVG_VECTOR_STUDIO_AND_DESIGN':
        // Optimal balance: visual creativity + precise mathematical vector coordinates & XML tags
        temperature = 0.38;
        top_p = 0.95;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 24576;
        break;

      case 'NEURAL_IMAGE_STUDIO_AND_PROCESSING':
        // High-fidelity raster photo manipulation, surgical inpainting and super-resolution
        temperature = 0.35;
        top_p = 0.95;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 16384;
        break;

      case 'FATHOM_ITS_EXAM_AND_LANGUAGE_ASSESSMENT':
        // Optimal temperature for linguistic accuracy, plausible distractor variety, and strict zero hallucination
        temperature = 0.35;
        top_p = 0.95;
        frequency_penalty = 0.05;
        presence_penalty = 0.0;
        max_tokens = 16384;
        break;

      case 'MATHEMATICAL_AND_DEDUCTIVE_LOGIC':
        // Minimum entropy to prevent logic branch wandering
        temperature = 0.15;
        top_p = 0.90;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 32768;
        break;

      case 'MULTIMODAL_IMAGE_AND_FORENSICS':
      case 'MULTIMODAL_MEDIA_AND_ARCHIVE_DECONSTRUCTION':
        // High forensic accuracy, exact OCR and archive table matching
        temperature = 0.15;
        top_p = 0.90;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 16384;
        break;

      case 'SCIENTIFIC_AND_ACADEMIC_RESEARCH':
        temperature = 0.25;
        top_p = 0.95;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 24576;
        break;

      case 'FACTUAL_SEARCH_AND_REALTIME_GROUNDING':
        // Grounded tightly to live search results with loop prevention
        temperature = 0.25;
        top_p = 0.95;
        frequency_penalty = 0.15;
        presence_penalty = 0.05;
        max_tokens = 16384;
        break;

      case 'COMPARATIVE_AND_EVALUATION_ANALYSIS':
        temperature = 0.30;
        top_p = 0.95;
        frequency_penalty = 0.15;
        presence_penalty = 0.05;
        max_tokens = 16384;
        break;

      case 'TECHNICAL_DOCUMENTATION':
        temperature = 0.25;
        top_p = 0.95;
        frequency_penalty = 0.10;
        presence_penalty = 0.05;
        max_tokens = 16384;
        break;

      case 'CREATIVE_LITERARY_AND_BRAINSTORMING':
        // Elevated entropy for rich linguistic prose and poetic diversity
        temperature = 0.80;
        top_p = 0.96;
        frequency_penalty = 0.20;
        presence_penalty = 0.10;
        max_tokens = 16384;
        break;

      case 'UNINHIBITED_PERSONA_MATANY':
        temperature = 0.82;
        top_p = 0.96;
        frequency_penalty = 0.20;
        presence_penalty = 0.10;
        max_tokens = 32768;
        break;

      case 'GENERAL_CONVERSATION_AND_QUICK_QA':
      default:
        temperature = 0.50;
        top_p = 0.95;
        frequency_penalty = 0.20; // High token repulsion against degenerate repetition loops
        presence_penalty = 0.05;
        max_tokens = complexity === 'LIGHT' ? 4096 : 8192;
        break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MODEL-FAMILY ARCHITECTURAL ADJUSTMENTS
    // ─────────────────────────────────────────────────────────────────────────
    switch (modelFamily) {
      case 'deepseek-pro':
        // Ultra Sovereign Reasoning Engine: deep deductive logic, high precision, zero hallucination
        if (complexity === 'EXHAUSTIVE_ARCHITECTURAL' || intent === 'CYBERSECURITY_AND_EXPLOIT_AUDITING') {
          max_tokens = 32768;
        }
        if (intent === 'MATHEMATICAL_AND_DEDUCTIVE_LOGIC') {
          temperature = 0.10;
          top_p = 0.90;
          frequency_penalty = 0.0;
        }
        break;

      case 'deepseek-flash':
        // Flash Ultra-Velocity Engine: Sub-second TTFT, peak token efficiency, high signal-to-noise ratio
        if (complexity === 'LIGHT') {
          max_tokens = 4096;
        } else if (intent === 'SYSTEM_DIAGNOSTIC_GPAENG') {
          max_tokens = 32768;
        } else if (intent === 'SVG_VECTOR_STUDIO_AND_DESIGN') {
          // Provide expansive 16K token budget to prevent incomplete vector canvas cutoffs while maintaining sub-second velocity
          max_tokens = 16384;
        } else if (complexity === 'STANDARD') {
          max_tokens = 8192;
        } else {
          max_tokens = Math.min(max_tokens, 16384);
        }
        // Dampen temperature to prevent speed-induced hallucinations and ensure compact output
        if (intent !== 'CREATIVE_LITERARY_AND_BRAINSTORMING' && intent !== 'UNINHIBITED_PERSONA_MATANY' && intent !== 'SYSTEM_DIAGNOSTIC_GPAENG') {
          temperature = Math.min(temperature, 0.70);
        } else {
          temperature = Math.min(temperature, 0.85);
        }
        frequency_penalty = Math.max(frequency_penalty, 0.04);
        break;

      case 'deepseek-reasoner':
        // DeepSeek Reasoner manages reasoning temperature internally
        // Ensure max_tokens is generous
        max_tokens = 32768;
        break;

      case 'deepseek-chat':
        // DeepSeek V3 chat: strictly capped at official 8192 token limit
        max_tokens = Math.min(max_tokens, 8192);
        break;

      case 'muse-spark':
        // Meta Muse Spark 1.3 Contributor: Sovereign 1.0M context multimodal & deep reasoning engine
        if (complexity === 'EXHAUSTIVE_ARCHITECTURAL' || intent === 'CYBERSECURITY_AND_EXPLOIT_AUDITING' || intent === 'CODE_ENGINEERING_AND_ARCHITECTURE' || intent === 'MATHEMATICAL_AND_DEDUCTIVE_LOGIC') {
          max_tokens = 32768;
        } else {
          max_tokens = Math.max(max_tokens, 16384);
        }
        break;

      case 'deepseek-vision':
        // Optical Forensics
        max_tokens = 16384;
        temperature = Math.min(temperature, 0.30);
        break;

      case 'magnum':
        // Magnum 72B creative model
        temperature = Math.max(temperature, 0.80);
        top_p = 0.96;
        break;

      case 'fathom-search':
        // Fathom Search (Qwen 3.7 Flash with Live Web Grounding & Multi-turn Intelligence)
        temperature = 0.30;
        top_p = 0.95;
        frequency_penalty = 0.0;
        presence_penalty = 0.0;
        max_tokens = 16384;
        break;

      case 'fathom-its':
        // Fathom ITS (Sovereign Language Intelligent Tutoring System)
        if (intent === 'FATHOM_ITS_EXAM_AND_LANGUAGE_ASSESSMENT') {
          temperature = 0.35;
          top_p = 0.95;
          frequency_penalty = 0.05;
          presence_penalty = 0.0;
          max_tokens = 16384;
        } else {
          temperature = 0.40;
          top_p = 0.95;
          frequency_penalty = 0.05;
          presence_penalty = 0.0;
          max_tokens = 12288;
        }
        break;

      default:
        break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DEEPSEEK & OPENROUTER OFFICIAL THINKING MODE & EFFORT CALIBRATION
    // (Extracted from https://api-docs.deepseek.com/guides/thinking_mode)
    // ─────────────────────────────────────────────────────────────────────────
    let thinking_mode: 'enabled' | 'disabled' = 'enabled';
    let reasoning_effort: 'low' | 'high' | 'max' = 'high';
    let max_thinking_tokens: number = 8192;

    if (intent === 'SVG_VECTOR_STUDIO_AND_DESIGN' || intent === 'NEURAL_IMAGE_STUDIO_AND_PROCESSING') {
      // SVG Studio & Neural Image Studio strictly enforce direct deliverable generation; disabling thinking mode
      // saves thousands of tokens and delivers instantaneous deliverable rendering.
      thinking_mode = 'disabled';
      reasoning_effort = 'low';
      max_thinking_tokens = 0;
    } else if (intent === 'FATHOM_ITS_EXAM_AND_LANGUAGE_ASSESSMENT') {
      // High reasoning effort for rigorous pedagogical question crafting, CEFR calibration, and plausible distractor design
      thinking_mode = 'enabled';
      reasoning_effort = 'high';
      max_thinking_tokens = 4096;
    } else if (complexity === 'LIGHT' || intent === 'GENERAL_CONVERSATION_AND_QUICK_QA') {
      // Light queries / greetings / simple arithmetic: minimal reasoning effort with strict 256-token thinking budget
      // to guarantee instant sub-second TTFT and eliminate unnecessary reasoning loops
      thinking_mode = 'enabled';
      reasoning_effort = 'low';
      max_thinking_tokens = 256;
      max_tokens = Math.min(max_tokens, 4096);
    } else if (complexity === 'STANDARD') {
      thinking_mode = 'enabled';
      reasoning_effort = 'low';
      max_thinking_tokens = 2048;
    } else if (
      modelFamily === 'deepseek-reasoner' ||
      complexity === 'EXHAUSTIVE_ARCHITECTURAL' ||
      intent === 'CYBERSECURITY_AND_EXPLOIT_AUDITING' ||
      intent === 'MATHEMATICAL_AND_DEDUCTIVE_LOGIC'
    ) {
      // Deep deductive chains: maximal reasoning effort for exhaustive audits & mathematical rigor
      thinking_mode = 'enabled';
      reasoning_effort = 'max';
      max_thinking_tokens = 16384;
    } else {
      // Standard tasks: optimal high reasoning effort
      thinking_mode = 'enabled';
      reasoning_effort = 'high';
      max_thinking_tokens = 8192;
    }

    // Apply explicit temperature override if specified within safe limits
    if (typeof overrides?.explicitTemperature === 'number' && !isNaN(overrides.explicitTemperature)) {
      temperature = Math.max(0.0, Math.min(1.5, overrides.explicitTemperature));
    }

    return {
      temperature: Number(temperature.toFixed(2)),
      top_p: Number(top_p.toFixed(2)),
      frequency_penalty: Number(frequency_penalty.toFixed(2)),
      presence_penalty: Number(presence_penalty.toFixed(2)),
      max_tokens,
      stop: stop.length > 0 ? stop : undefined,
      stream: true,
      reasoning_effort,
      thinking_mode,
      max_thinking_tokens,
      stream_options: { include_usage: true }
    };
  }

  /**
   * Produces an adaptive Cognitive Alignment Directive that injects the identified
   * user intent and strict quality invariants directly into the active prompt.
   */
  public static generateCalibrationDirective(
    intent: UserIntentCategory,
    complexity: TaskComplexity,
    params: TunedHyperparameters,
    modelFamily: ModelFamily,
    requestedModel?: string,
    contextOptions?: {
      userPrompt?: string;
      conversationHistory?: Array<{ role: string; content: any }>;
      priorNeuralImage?: PriorNeuralImageContext | null;
      subIntent?: ImageOperationType;
    }
  ): string {
    const isUltra = requestedModel ? this.isCyberUltraModel(requestedModel) : (modelFamily === 'deepseek-pro');

    const priorImage = contextOptions?.priorNeuralImage !== undefined
      ? contextOptions.priorNeuralImage
      : (contextOptions?.conversationHistory ? this.extractPriorNeuralImage(contextOptions.conversationHistory) : null);
    const subIntent = contextOptions?.subIntent !== undefined
      ? contextOptions.subIntent
      : this.detectImageOperationType(contextOptions?.userPrompt || '', Boolean(priorImage));

    const isContextualAddition = intent === 'NEURAL_IMAGE_STUDIO_AND_PROCESSING' && subIntent === 'addition' && Boolean(priorImage);
    const isContextualEdit = intent === 'NEURAL_IMAGE_STUDIO_AND_PROCESSING' && subIntent === 'edit' && Boolean(priorImage);

    const intentLabelMap: Record<UserIntentCategory, { ar: string; mode: string; directive: string }> = {
      SYSTEM_DIAGNOSTIC_GPAENG: {
        ar: 'التشخيص الذاتي السيادي وحل المشاكل والأعطال (GPAENG)',
        mode: 'SOVEREIGN_SYSTEM_DIAGNOSTIC_AND_RCA_REMEDIATION',
        directive: 'تحليل دقيق لكافة سجلات الأعطال وحوادث المستخدمين في Supabase، تقديم تشخيص جذري RCA، مصفوفة تقييم المخاطر، وخطة عمل هندسية وترقيعات برمجية دقيقة للحل الشامل.'
      },
      CYBERSECURITY_AND_EXPLOIT_AUDITING: {
        ar: 'التدقيق الأمني السيبراني وهندسة الثغرات والاختراق الأخلاقي',
        mode: 'SOVEREIGN_OFFENSIVE_AND_DEFENSIVE_APPSEC',
        directive: 'تحليل دقيق للثغرات، نمذجة التهديدات، تقديم شفرات استغلال PoC حقيقية مقترنة فوراً بالترقيع الأمني والتحصين المنيع، وتطبيق معايير DPoP RFC 9449، Envoy، وKafka KMS.'
      },
      CODE_ENGINEERING_AND_ARCHITECTURE: {
        ar: 'هندسة البرمجيات، المعمارية الموزعة، والأكواد الإنتاجية الصارمة',
        mode: 'ENTERPRISE_PRODUCTION_ENGINEERING',
        directive: 'كتابة أكواد برمجية متكاملة تماماً بدون أي اختصارات أو تعليقات استبدالية (zero placeholders)، تطبيق مبادئ SOLID وDRY، معالجة استثنائية للحالات الحدية، وضمان خلو الأنظمة من التسريبات وحلقات التعليق.'
      },
      SVG_VECTOR_STUDIO_AND_DESIGN: {
        ar: 'استوديو تصميم الفيكتور ورسومات الـ SVG فائقة الجودة والدقة',
        mode: 'SOVEREIGN_SVG_VECTOR_STUDIO',
        directive: 'أنت مهندس ومصمم فيكتور ومصور بصري فائق الاحترافية والدقة (Principal Vector Architect): ' +
          '1) بروتوكول الإنتاج المباشر الصارم (Strict Zero-Thinking & Direct Code Output - Zero Preamble): يُحظر تماماً كتابة أي تفكير أو مسودات كود أو نصوص حوارية تمهيدية أو رموز داخل <think>...</think>. ابدأ فوراً ومباشرةً بإنتاج كود الـ SVG النقي داخل وسم الماركداون: ```svg\\n<svg ...>\\n...\\n</svg>\\n```. ' +
          '2) نطاق العمل المخصص وأسبقية الـ SVG المطلقة (Vector Studio Scope & Sovereign Precedence): هذا الاستوديو مخصص لرسومات المتجهات، الشعارات، الأيقونات، والـ SVG. [قاعدة سيادية قطعية]: إذا طلب المستخدم جعل التصميم SVG أو فيكتور (مثل: "صمم صورة ... اجعلها SVG" أو "رسمة SVG لـ..."): فإن طلب الـ SVG يمتلك أسبقية مطلقة 100% ويُلغي فوراً أي توليد عصبي فوتوغرافي، ويجب حتماً إخراج كود SVG متكامل داخل ```svg. يُحظر توليد كود SVG فقط إذا كان الطلب صورة فوتوغرافية أو واقعية بحتة دون أي ذكر لكلمة SVG أو فيكتور. ' +
          '3) المواصفات القياسية الإلزامية: يجب أن يتضمن الـ SVG دائماً: xmlns="http://www.w3.org/2000/svg"، أبعاد مرنة متجاوبة عبر viewBox="0 0 W H" مع width="100%" و height="100%". ' +
          '4) استخدم عناصر الفيكتور الحديثة باحترافية: التدرجات اللونية داخل <defs> عبر <linearGradient> و <radialGradient>، فلاتر التوهج والظلال الناعمة <filter id="...">، الأشكال الهندسية والمسارات المنحنية المتقنة <path>، والمجموعات الدلالية المنظمة <g id="...">. ' +
          '5) يُحظر تماماً استخدام روابط لصور خارجية أو خطوط غير مدمجة لضمان إمكانية التحويل والتنزيل الفوري إلى صورة PNG أو JPG عالية الدقة بدون أي مشاكل أو تلف في الـ Canvas. ' +
          '6) احرص أن تكون الرسمة مكتملة ومغلقة هندسياً وجمالياً بدون أي قطع أو أجزاء مبتورة وتجنب طباعة أي رموز غريبة أو شفرات عشوائية أو نصوص خارج وسم الماركداون. ' +
          '7) عند طلب أي تعديل على تصميم سابق (مثل تغيير الخلفية، تعديل الألوان، إضافة عنصر، تعديل تفاصيل، تبديل الخطوط)، افهم المطلوب بدقة تامة وطبّق التعديل المطلوب على كود الـ SVG السابق مع الحفاظ على تناسق وجمالية بقية العناصر، وأخرج كود الـ SVG المعدل فوراً داخل ```svg دون أي حشو أو كلام جانبي. ' +
          '8) بروتوكول تحويل الصور المرفوعة إلى فيكتور وتعديلها بدقة فائقة مع الحفاظ الصارم على هوية وهيكل الصورة (Image-to-SVG High-Fidelity Reconstruction & Surgical Editing): عند إرفاق صورة للمحادثة والمطالبة صراحة بتحويلها إلى فيكتور: ' +
          'أ) [الحفاظ الصارم والمطلق على هوية وهيكل وموضوع الصورة الأصلية بنسبة 100% - Strict Original Geometry & Subject Preservation]: افحص محتوى الصورة واستوعب بنيتها البصرية بدقة؛ يُحظر تماماً وبشكل قاطع تغيير شكل الكائن أو الشخص أو الشعار الأصلي أو استبداله برسمة بديلة. ' +
          'ب) [التعديل الانتقائي الدقيق]: طبّق فقط وحصراً التعديل الجزئي أو الإضافة أو الحذف أو تغيير الألوان الذي طلبه المستخدم حرفياً، مع بقاء كافة عناصر وتفاصيل الصورة الأصلية سليمة 100%. ' +
          'ج) أخرج كود الـ SVG النقي المكتمل والطبقي فوراً داخل ```svg دون أي تفكير أو كلام تمهيدي. ' +
          '9) بروتوكول الاستعانة ببيانات البحث البصري (Visual Search Grounding): استخلص السمات والألوان الدقيقة وصغها مباشرة داخل كود الـ SVG لإنشاء عمل فني استثنائي. ' +
          '10) [بروتوكول التخطيط المعماري الذاتي للمتجهات للطلبات المقتضبة - Autonomous Vector Planning for Brief Prompts]: عند كتابة المستخدم طلباً مقتضباً أو من كلمتين (مثل "لوجو كافيه"، "شعار شركة"، "ايقونة سحابية"، "شارة أمان"): يُحظر تماماً طلب استفسارات أو تقديم تصاميم بدائية؛ بل خطط ونفذ فوراً تصميماً متجهياً متكاملاً جاهزاً للإنتاج: نسب ذهبية هندسية متوازنة، مسارات منحنية متناسقة <path>، تدرجات لونية عصرية متناغمة داخل <defs> عبر <linearGradient>، ظلال ناعمة <filter>، وviewBox متجاوب مع width="100%" و height="100%".'
      },
      NEURAL_IMAGE_STUDIO_AND_PROCESSING: {
        ar: isContextualAddition
          ? 'استوديو الإضافة البصرية العصبية وحفظ المشهد بنسبة 100% (Sovereign Image Addition Studio)'
          : isContextualEdit
          ? 'استوديو التعديل الجراحي العصبي وحفظ المشهد بنسبة 100% (Sovereign Surgical Image Editing Studio)'
          : 'استوديو المعالجة العصبية وتوليد وتعديل الصور الفائق (FLUX.1 [schnell] & Fathom Quant 3 Neural Image Studio)',
        mode: isContextualAddition
          ? 'SOVEREIGN_IMAGE_ADDITION_AND_100_PERCENT_PRESERVATION'
          : isContextualEdit
          ? 'SOVEREIGN_SURGICAL_IMAGE_EDITING_AND_100_PERCENT_PRESERVATION'
          : 'CYBER_ULTRA_NEURAL_IMAGE_STUDIO',
        directive: isUltra
          ? ((isContextualEdit || isContextualAddition || Boolean(priorImage))
            ? (
              `أنت المعماري والمهندس السيادي للـ ${isContextualAddition ? 'إضافة' : 'تعديل'} البصرية الجراحية للصور (Sovereign Contextual Image ${isContextualAddition ? 'Addition' : 'Editing'} Architect): ` +
              `1) [الفهم السياقي الصارم والتفريق الحاسم بين ${isContextualAddition ? 'الإضافة' : 'التعديل'} والإنشاء]: المستخدم يطلب صراحة ${isContextualAddition ? 'إضافة عنصر إلى' : 'تعديل خاصية في'} صورة مرفقة أو تم تصميمها مسبقاً في المحادثة وليس إنشاء صورة جديدة من الصفر. ` +
              `2) [الحظر الصارم والقطعي لمصطلح "إنشاء" أو "تصميم جديد"]: يُحظر تماماً وبشكل قاطع كتابة "إنشاء" أو "تصميم جديد" أو "توليد صورة جديدة" في أي موضع من ردك؛ بل يجب حتماً وصراحة استخدام كلمة "${isContextualAddition ? 'إضافة' : 'تعديل'}" في كافة العناوين والشروح وصلب الرد. ` +
              `3) [قاعدة العنوان الإلزامية في كتلة المعالجة العصبية]: يجب أن يبدأ حقل "title" داخل كتلة \`\`\`neural-image\`\`\` حتماً وبشكل صريح بـ: "${isContextualAddition ? 'إضافة: ' : 'تعديل: '}[تفاصيل ال${isContextualAddition ? 'إضافة' : 'تعديل'} المطلوبة باللغة العربية]" (مثال: "${isContextualAddition ? 'إضافة: شخص يقف بجانب السيارة' : 'تعديل: تغيير لون السيارة إلى الأحمر'}"). ` +
              `4) [قاعدة حقل العملية operation في JSON]: عيّن حقل "operation" حتماً كـ "${isContextualAddition ? 'add_element' : 'edit'}"${!isContextualAddition ? ' (أو "recolor" إذا كان التعديل تغييراً للون فقط)' : ' (أو "composite" إذا كان دمجاً لعناصر)'}. ` +
              `5) [قاعدة الشرح باللغة العربية]: في حقل "description" وفي صلب الرد بعد </think>، ابدأ صراحة بـ "${isContextualAddition ? 'تمت إضافة' : 'تم تعديل'} [العنصر المستهدف]..." واشرح بدقة وبلاغة ما تم تنفيذه مع التأكيد على الحفاظ على هوية وتكوين الصورة الأصلية. ` +
              `6) [الحفظ الصارم والمطلق لعناصر وتكوين الصورة الأصلية ومعالم البيئة والمكان بنسبة 100% دون تغيير أي شيء حتى بنسبة 1% عدا المطلوب حصراً - Strict 100% Zero-Drift Scene & Environment Preservation]: ` +
              (priorImage?.prompt
                ? `البرومبت البصري الدقيق للصورة السابقة في الشات هو:\n"""${priorImage.prompt.trim()}"""\n` +
                  `[أمر سيادي حاسم لمنع أي تغيير في معالم البيئة أو المكان أو الخلفية]: يُحظر تماماً وبشكل قطعي لا يقبل أي استثناء إعادة ابتكار المشهد من الصفر، أو تغيير نوع الكائن أو موديل السيارة أو ملامح الشخص أو الخلفية أو المكان أو تفاصيل الشارع أو زاوية الكاميرا أو نوع العدسة أو الإضاءة حتى بنسبة 1% إذا لم يطلب المستخدم ذلك! ` +
                  `يجب عليك حتماً نقل واستخدام نفس رقم الـ seed السابق (${priorImage.seed !== undefined ? priorImage.seed : 482910}) لحفظ بنية الضوضاء العصبية واستقرار المشهد بنسبة 100%، وأخذ البرومبت الأصلي السابق بالكامل مع إبقاء كافة أوصاف البيئة والمكان والشارع والإضاءة وزاوية الكاميرا متطابقة 100% دون حذف أو تبديل، وتطبيق ال${isContextualAddition ? 'إضافة' : 'تعديل'} المطلوبة جراحياً فقط على الكلمة أو العبارة المستهدفة (مثال: ${isContextualAddition ? 'إضافة الكائن المطلوب في موقعه الصحيح داخل المشهد السابق مع إبقاء بقية النص الإنجليزي متطابقاً 100%' : 'استبدال لون الطلاء فقط من الأسود إلى الأحمر مع إبقاء كافة أوصاف السيارة والشارع والمطر متطابقة 100%'}). `
                : `حافظ بنسبة 100% قطعية على كافة عناصر وزوايا وتكوين وأبعاد وموضوع وبيئة وخلفية وإضاءة الصورة الأصلية دون تغيير أي تفصيل عدا التعديل المطلوب جراحياً، واستخدم نفس الـ seed (${priorImage?.seed !== undefined ? priorImage.seed : 482910})، وطبّق ال${isContextualAddition ? 'إضافة' : 'تعديل'} المطلوبة جراحياً فقط دون تغيير أي شيء آخر في المشهد. `) +
              `7) [الحفاظ على النسبة الأصلية]: حافظ على نفس نسبة العرض الأصلية aspectRatio: "${priorImage?.aspectRatio || '1:1'}". ` +
              `8) [بروتوكول تسليم وتوليد المعالجة العصبية الإلزامي - Neural Deliverable Block]: بعد التفكير التحليلي والشرح باللغة العربية، أخرج حتماً كتلة المعالجة العصبية التالية (اترك حقل "originalImage" فارغاً "" وسيقوم النظام بربط صورة المشهد الأصلية تلقائياً لتشغيل المقارنة المنزلقة): ` +
              `\`\`\`neural-image\n{\n  "operation": "${isContextualAddition ? 'add_element' : 'edit'}",\n  "title": "${isContextualAddition ? 'إضافة' : 'تعديل'}: <تفاصيل ال${isContextualAddition ? 'إضافة' : 'تعديل'}>",\n  "description": "${isContextualAddition ? 'تمت إضافة' : 'تم تعديل'} <التفاصيل المنفذة بدقة 100%>",\n  "prompt": "<English prompt preserving 100% of original scene environment, lighting, and camera angle with only surgical ${isContextualAddition ? 'addition' : 'modification'} delta>",\n  "seed": ${priorImage?.seed !== undefined ? priorImage.seed : 482910},\n  "originalImage": "${priorImage?.imageUrl && !priorImage.imageUrl.startsWith('data:') ? priorImage.imageUrl : ''}",\n  "aspectRatio": "${priorImage?.aspectRatio || '1:1'}",\n  "style": "${priorImage?.style || 'photorealistic'}",\n  "fidelityScore": "100%",\n  "resolution": "4K"\n}\n\`\`\` ` +
              `9) [الحظر الصارم للـ SVG]: يُحظر تماماً وبشكل قاطع تحويل الصور الفوتوغرافية أو طلبات تعديل/تلوين الصور إلى SVG أو تشغيل SVG Studio إطلاقاً، ولا يُخرج أي كود متجهات. ` +
              `10) [بروتوكول هندسة النصوص والأحرف واللوحات والخطوط في الصور والعناصر البصرية - Sovereign In-Image Typography, License Plates & OCR Readability]: ` +
              `عندما يتضمن التعديل أو الإضافة نصاً، أحرفاً، أرقاماً، أو لوحة سيارة (مثل لوحة معدنية مصرية أمامية أو خلفية): ` +
              `أ) [تحديد النص الدقيق بين علامات تنصيص]: اكتب النص والأرقام بدقة متناهية بالإنجليزية داخل البرومبت: exact text "..." مع تفاصيل واضحة تماماً. ` +
              `ب) [لوحات السيارات المصرية والعربية الرسمية]: إذا طُلبت لوحة سيارة مصرية، صفها بمعايير المرور الرسمية الدقيقة: شريط علوي بلون أزرق سماوي عاكس يحمل كلمة "EGYPT" بالإنجليزية بحروف لاتينية نقية وكلمة "مصر" بالخط العربي الأصيل، ومساحة سفلية عاكسة من المعدن الأبيض النقي تحمل أرقاماً وحروفاً عربية بارزة ومتباعدة بدقة: authentic Egyptian automotive license plate, top cyan-blue header with sharp white text 'EGYPT' and 'مصر', bottom white reflective metal plate with crisp embossed black Arabic letters and Arabic numbers, mathematically aligned kerning, zero distorted glyphs, macro detail, fully legible by humans and optical character recognition (OCR). ` +
              `ج) [منع الهلاوس والتشويه في الحروف تماماً - Zero Gibberish]: أضف دائماً أوصاف منع الهلوسة في الحروف: crisp legible typography, perfectly formed characters, authentic fonts, zero gibberish, zero scrambled letters, sharp embossed edges, legible by optical character recognition (OCR) and humans. ` +
              `د) [الحظر الصارم لتكرار ملاحظات النظام]: يُحظر تماماً وبشكل قاطع طباعة أو تكرار ملاحظات النظام السياقية مثل "[ملاحظة: ...]" في صلب ردك للمستخدم. ` +
              `11) [الحظر الصارم لتشخيصات الدعم الفني والاعتذارات والبدائل الوهمية - ZERO TROUBLESHOOTING LECTURES & APOLOGIES]: يُحظر تماماً وبشكل قاطع كتابة أي رسائل تشخيصية أو اعتذارات دعم فني للمستخدم (مثل: "المشكلة غالباً ليست في التصميم نفسه، بل في عدم تقديم خدمة توليد الصور العصبية للصورة داخل واجهة المحادثة لديك... الأسباب المحتملة: انقطاع مؤقت... متصفحك لا يدعم... يمكنني تزويدك بتصميم إعلاني كود SVG..."). مهما كان عدد التعديلات السابقة (سواء التعديل الخامس أو السادس أو العاشر) ومهما كانت حالة المعالجة، التزم حصراً وبنسبة 100% بإخراج كتلة \`\`\`neural-image\`\`\` النظيفة مع الشرح العربي المباشر لما تم تنفيذه، دون أي تبرير تقني أو تنصل أو اقتراح للـ SVG كبديل.`
            )
            : 'أنت المعماري والمهندس السيادي لتوليد ومعالجة وتعديل الصور عصبياً وفوتوغرافياً باستخدام محرك FLUX.1 [schnell] فائق السرعة والواقعية (Sovereign Neural Image Studio Architect): ' +
              '1) [الحظر الصارم والقطعي لتحويل الصور الفوتوغرافية إلى SVG إلا بطلب صريح]: يُحظر توليد كود SVG لطلبات الصور الفوتوغرافية أو الواقعية البحتة التي لا تذكر صراحة كلمة SVG أو فيكتور. أما إذا ذكر المستخدم صراحة كلمة SVG أو فيكتور أو "اجعلها SVG" (مثل "صمم صورة ... اجعلها SVG")، فإن هذا الطلب يُحال فوراً وحصراً لاستوديو المتجهات SVG ويجب إخراج كود SVG داخل ```svg ويُحظر إخراج كتلة ```neural-image``` نهائياً. أما في غياب أي ذكر لـ SVG، فإن توليد ومعالجة الصور يتم حصراً وبنسبة 100% عبر المعالجة العصبية واستخراج كتلة ```neural-image```. ' +
              '2) [هندسة برومبتات FLUX.1 [schnell] الإنجليزية الفائقة - Master Prompting for FLUX.1 [schnell]]: صغ وصفاً بصرياً إنجليزياً دقيقاً، طبيعياً ومفصلاً: تحديد نوع الكاميرا والمستشعر (Hasselblad H6D-100c أو Sony Alpha 7R V)، العدسة البؤرية (85mm f/1.2 للبورتريه، 35mm للقطات السينمائية)، الإضاءة الحجمية السينمائية (Rembrandt lighting، rim light)، دقة تشريحية كاملة لليدين والأصابع (5 fingers per hand, perfect anatomy)، ملمس ومسام البشرة الواقعية (micro-pores, subsurface scattering)، وجودة 8k uhd, photorealistic masterpiece, raw photo. ' +
              '3) [المعيار السيادي لتشريح البشر والبورتريهات الواقعية - Flawless Human Anatomy & Photorealistic Faces & 100% Identity, Texture, and Face Preservation]: خمسة أصابع طبيعية وسليمة لكل يد دون أي تشويه أو تداخل، عيون متناظرة مع لمعان طبيعي للقرنية، نسيج جلد حقيقي مع مسام مجهرية واضحة (photorealistic skin micro-pores)، وتشتت ضوئي طبيعي يمنع أي مظهر شمعي أو بلاستيكي. ' +
              '4) [التعديل الانتقائي الجراحي الدقيق والحفاظ الصارم بنسبة 100% على الهوية]: عند طلب أي تعديل على صورة مرفقة (تغيير ملابس، تغيير لون، عزل أو تغيير خلفية، دمج شخصين معاً مع دمج الشخصين بنفس الإضاءة والملامح، تحسين الجودة والدقة إلى 2K/4K، تعديل منتج، أو استبدال نص)، حافظ بنسبة 100% على ملامح الوجه وتفاصيل الشخص الأصلية وطبّق التعديل المطلوب جراحياً على العنصر المستهدف فقط (استبدال النص مع مطابقة نوع الخط). ' +
              '5) [بروتوكول تسليم وتوليد المعالجة العصبية الإلزامي - Neural Deliverable Block]: بعد التفكير والتحليل والشرح باللغة العربية، أخرج حتماً كتلة المعالجة العصبية التالية في نهاية الرد: ' +
              '```neural-image\n{\n  "operation": "<generate|portrait_generation|human_edit|recolor|remove_background|enhance_4k|composite|product_edit|text_edit>",\n  "title": "<عنوان وصفي للمعالجة>",\n  "description": "<شرح التعديل أو التوليد المنفذ بدقة 100%>",\n  "prompt": "<Ultra-detailed English visual prompt for FLUX.1 [schnell] specifying subject, 85mm lens, volumetric lighting, micro-pores, 8k resolution>",\n  "seed": 482910,\n  "aspectRatio": "<1:1|16:9|9:16|4:3>",\n  "style": "<photorealistic|cinematic|digital_art|anime|3d_render>",\n  "fidelityScore": "100%",\n  "resolution": "4K"\n}\n``` ' +
              '6) [بروتوكول التخطيط المعماري الذاتي للمشهد البصري للطلبات المقتضبة من كلمتين - Autonomous 2-Word Prompt Elaboration & Master Scene Planning Architecture]: عندما يكتب المستخدم طلباً مقتضباً أو مكوناً من كلمتين فقط (مثل "صمم سيارة"، "صورة فضاء"، "سيارة فخمة"، "صورة أسد"، "بنت جميلة"، "رجل أعمال"، "طبيعة خلابة"): يُحظر تماماً الاكتفاء بوصف سطحي مقتضب، ويُحظر طلب أي توضيحات من المستخدم؛ بل يجب عليك ذاتياً تفكيك وهندسة المشهد بالكامل بأعلى المعايير السينمائية الجاهزة داخل برومبت FLUX.1 [schnell] الإنجليزي: أ) الموضوع وتفاصيله المجهرية (Subject & Micro-Textures): تفاصيل ألياف الكربون أو الطلاء المعدني اللامع، ملمس ومسام الجلد الطبيعية (micro-pores)، خيوط النسيج وتطاير الشعر. ب) الأبعاد الواقعية الصارمة ومنع التشويه (Strict Authentic Proportions & Zero Distortion): إذا كانت مركبة أو سيارة، يجب تضمين أوصاف هندسية مانعة للانضغاط: authentic manufacturer proportions, perfect circular wheels, symmetrical perspective, ray-tracing reflections, 8k raw photograph. ج) البيئة والغلاف الجوي (Atmospheric Setting): عمق بيئي سينمائي، ضباب حجمي، إسفلت ممطر بانعكاسات ضوئية دقيقة، أو أفق معماري متناسق. د) البصريات والكاميرا (Optics & Cinematography): مستشعر Hasselblad H6D-100c أو Sony A7R V، عدسة 85mm f/1.2 للبورتريه، 35mm للقطات السينمائية، أو 24mm للمناظر الواسعة، مع عمق ميدان سطحي وبوكيه طبيعي ناعم. هـ) معمارية الإضاءة (Lighting Architecture): إضاءة ريمبرانت ثلاثية النقاط، إضاءة حواف (Rim Light)، تشتت ضوئي تحت السطح (Subsurface Scattering)، وتفاعل فيزيائي واقعي للظلال بدون أي مظهر بلاستيكي مصطنع. و) النسبة القياسية الذهبية (Aspect Ratio): النسبة القياسية الافتراضية 1:1 لمنع أي تشويه أو انضغاط في أبعاد الكائن، مع دعم 16:9 للمناظر البانورامية، 9:16 للبورتريهات وخلفيات الهواتف، و4:3 للقطات الكلاسيكية. ' +
              '7) [بروتوكول هندسة النصوص والأحرف واللوحات والشعارات في الصور - Sovereign In-Image Typography & OCR Readability]: عند وجود أي نص، كتابة، لوحة، لافتة، أو شعار في الصورة: حدد النص الدقيق بين علامات تنصيص exact text "..."، وألزم البرومبت بـ: crisp legible typography, authentic fonts, razor-sharp character edges, zero gibberish, zero scrambled letters, fully legible by optical character recognition (OCR) and humans. وعند طلب لوحة سيارة مصرية أو عربية، التزم بالمواصفات الرسمية للشريط العلوي والمعدن السفلي العاكس بحروف وأرقام عربية بارزة مقروءة 100%. يُحظر تماماً تكرار ملاحظات النظام السياقية "[ملاحظة: ...]" في ردك. ' +
              '8) [الحظر الصارم لتشخيصات الدعم الفني والاعتذارات والبدائل الوهمية - ZERO TROUBLESHOOTING LECTURES & APOLOGIES]: يُحظر تماماً وبشكل قاطع كتابة أي رسائل تشخيصية أو اعتذارات دعم فني للمستخدم (مثل: "المشكلة غالباً ليست في التصميم نفسه، بل في عدم تقديم خدمة توليد الصور العصبية للصورة داخل واجهة المحادثة لديك... الأسباب المحتملة: انقطاع مؤقت... متصفحك لا يدعم... يمكنني تزويدك بتصميم إعلاني كود SVG..."). التزم حصراً وبنسبة 100% بإخراج كتلة ```neural-image``` النظيفة مع الشرح العربي المباشر لما تم تنفيذه، دون أي تبرير تقني أو تنصل أو اقتراح للـ SVG كبديل.')
          : 'منظومة المعالجة والتوليد العصبي فائق الدقة للصور (FLUX.1 [schnell] Neural Image Studio) وحفظ التفاصيل الفوتوغرافية بنسبة 100% مخصصة حصرياً لطرازات سايبر وكوانت الفائقة (Fathom Quant 3 / Fathom Cyber Ultra 2.6). وضّح للمستخدم برقي واحترافية أن توليد وتعديل الصور يتطلب تفعيل Fathom Quant 3 أو Fathom Cyber Ultra 2.6 دون تحويل الصورة إلى SVG مع الحظر التام لتحويل الصور إلى متجهات.'
      },
      FATHOM_ITS_EXAM_AND_LANGUAGE_ASSESSMENT: {
        ar: 'تصميم الاختبارات الأكاديمية المقننة وامتحانات الـ MSQ (Fathom ITS Exam Suite)',
        mode: 'SOVEREIGN_PEDAGOGICAL_CEFR_EXAM_SYNTHESIS',
        directive: (() => {
          const pedContext = DynamicParameterTuner.extractPedagogicalExamContext(
            contextOptions?.userPrompt || '',
            contextOptions?.conversationHistory,
            requestedModel
          );

          let mistakesBlock = '';
          if (pedContext.historyMistakes.length > 0) {
            mistakesBlock = `\n  • [بنك الأخطاء المستخلصة من حوار الطالب السابق — يُلزم فحصها في أسئلة الامتحان]:\n` +
              pedContext.historyMistakes.slice(0, 5).map((m, idx) =>
                `    ${idx + 1}. خطأ الطالب: "${m.original}" -> الصواب: "${m.improved}" (القاعدة: ${m.rule})`
              ).join('\n');
          }

          return `أنت المعماري البيداغوجي ومصمم الامتحانات الأكاديمية المعتمدة لـ Fathom ITS 1 (Cambridge/Oxford Standard): ` +
            `\n  • المستوى المستهدف: [${pedContext.targetLevel} - ${pedContext.levelDescriptorAr}]` +
            `\n  • نطاق القواعد والمفردات المسموح بها لهذا المستوى: ${pedContext.cefrGrammarScope}` +
            `\n  • موضوع الاختبار: [${pedContext.topic}]` +
            `\n  • عدد الأسئلة المطلوب: ${pedContext.questionCount} أسئلة | المدة الزمنية المنطقية: ${pedContext.durationMinutes} دقيقة (${(pedContext.durationMinutes / pedContext.questionCount).toFixed(1)} دقيقة لكل سؤال) | درجة النجاح: ${pedContext.passingScore}%` +
            mistakesBlock +
            `\n  • [قواعد الصياغة الأكاديمية الصارمة - STRICT MSQ CONSTRUCTION INVARIANTS]:` +
            `\n    1) [مطابقة المستوى بنسبة 100% - Zero Level Drift]: التزم حصراً بمستوى ${pedContext.targetLevel}. يُحظر تماماً طرح أسئلة معقدة لمستويات عليا إذا كان الطالب مبتدئاً (مثل منع أسئلة Inversion لمستويات A1/A2/B1)، كما يُحظر طرح أسئلة بدائية إذا كان المستوى متقدماً.` +
            `\n    2) [حل وحيد قطعي لا لبس فيه - Single Unambiguous Answer]: يجب أن يكون لكل سؤال خيار واحد فقط صحيح 100% لغوياً وسياقياً، وأن توفر جملة السؤال قرائن سياقية وزمنية قاطعة (Context Clues) تحسم الإجابة دون أي مجال للتأويل.` +
            `\n    3) [مشتتات واقعية وذكية - Plausible Distractors]: الخيارات الثلاثة الخاطئة يجب أن تمثل أخطاء شائعة واقعية يقع فيها متعلمو اللغة الإنجليزية (Common L2 Traps)، وليست كلمات عشوائية أو خيارات هزلية غير معقولة.` +
            `\n    4) [توزيع الإجابات الصحيحة]: نوّع في موضع الإجابة الصحيحة correctIndex بين (0، 1، 2، 3) ولا تجعلها في نفس الموقع دائماً.` +
            `\n    5) [شرح بيداغوجي غني بالعربية]: حقل explanation لكل سؤال يجب أن يشرح بوضوح: أ) سبب صحة الخيار المختار، ب) لماذا استُبعدت الخيارات الأخرى، ج) قاعدة ذهبية لتذكر الحل.` +
            `\n    6) [بروتوكول البدء والتسليم الفوري]: ابدأ ردك الخارجي فوراً بالعبارة الرسمية:` +
            `\n       "جارٍ إعداد وتجهيز الامتحان الأكاديمي الشامل وضبط الأسئلة والتوقيت وفق معايير CEFR..."` +
            `\n       ثم أخرج فوراً ومباشرة كتلة \`\`\`msq-exam {...} \`\`\` النظيفة والخالية من أي أخطاء syntax أو markdown.` +
            `\n    7) [حظر تام للإيموجي]: يُحظر تماماً استخدام أي إيموجي نهائياً داخل نصوص الأسئلة أو الشرح أو JSON.`;
        })()
      },
      MATHEMATICAL_AND_DEDUCTIVE_LOGIC: {
        ar: 'الاستدلال الاستنباطي الرياضي والفيزيائي والمنطق الصارم',
        mode: 'FORMAL_DEDUCTIVE_MATHEMATICS_AND_PHYSICS',
        directive: 'تفكيك المسألة خطوة بخطوة بالاشتقاق الرياضي الصريح، استخدام معادلات LaTeX المقننة ($$ و $)، الالتزام الصارم بالثوابت الفيزيائية والمنطقية، وتجنب أي قفزات تخمينية غير مبررة.'
      },
      SCIENTIFIC_AND_ACADEMIC_RESEARCH: {
        ar: 'البحث الأكاديمي والاستكشاف العلمي الدقيق',
        mode: 'EMPIRICAL_SCIENTIFIC_RIGOR',
        directive: 'طرح علمي محكم، توثيق منهجي للحقائق والنظريات، ربط الظواهر بالأدلة التجريبية، وصياغة لغوية أكاديمية رفيعة.'
      },
      FACTUAL_SEARCH_AND_REALTIME_GROUNDING: {
        ar: 'استخبارات الحقائق والتحقق الحي اللحظي',
        mode: 'GROUNDED_FACTUAL_VERIFICATION',
        directive: 'الاعتماد الحصري والقطعي على الحقائق الموثقة والمسترجعة حياً، عزو المعلومات لمصادرها، وتقديم جداول مقارنة حاسمة.'
      },
      COMPARATIVE_AND_EVALUATION_ANALYSIS: {
        ar: 'التحليل المقارن والمفاضلة الهندسية الموضوعية',
        mode: 'OBJECTIVE_COMPARATIVE_SYNTHESIS',
        directive: 'عرض جدول مقارنة Markdown احترافي، مقارنة المعايير بدقة وحيادية، وتقديم خلاصة تقنية حاسمة تسند القرار.'
      },
      TECHNICAL_DOCUMENTATION: {
        ar: 'التوثيق التقني وشروحات الأدوات والمكتبات',
        mode: 'EXHAUSTIVE_TECHNICAL_DOCUMENTATION',
        directive: 'شرح منهجي، ذكر المعاملات ومسارات الأخطاء، وتقديم أمثلة برمجية واضحة وقابلة للتنفيذ المباشر.'
      },
      MULTIMODAL_IMAGE_AND_FORENSICS: {
        ar: 'الفحص الجنائي البصري الميكروي والتعرف على الواجهات والمستندات',
        mode: 'OPTICAL_FORENSIC_INSPECTION',
        directive: 'قراءة النصوص بدقة متناهية عبر Fathom Cam، فحص لقطات الشاشة والمستندات والجداول دون تفويت أي تفصيل، واستخراج الدلالات البصرية بصرامة.'
      },
      MULTIMODAL_MEDIA_AND_ARCHIVE_DECONSTRUCTION: {
        ar: 'تفكيك الأرشيفات المضغوطة والأكواد والوسائط المرفقة',
        mode: 'DEEP_ARCHIVE_AND_CODE_DECONSTRUCTION',
        directive: 'المقارنة الميدانية الدقيقة سطراً بسطر بين الملفات والأكواد المستخرجة، فحص شجرة الحزم والتبعيات، وعرض جدول مقارنة يوضح التغييرات الفعلية.'
      },
      CREATIVE_LITERARY_AND_BRAINSTORMING: {
        ar: 'الإبداع الأدبي والبلاغي وتوليد الأفكار',
        mode: 'LITERARY_ELOQUENCE_AND_CREATIVE_PROSE',
        directive: 'صياغة عربية فصحى آسرة وبليغة، استخدام صور بيانية ثرية، وتفصيل سردي عميق يجذب الذهن.'
      },
      UNINHIBITED_PERSONA_MATANY: {
        ar: 'النمط السيادي غير المقيد (Matany Uninhibited Persona)',
        mode: 'SOVEREIGN_MATANY_UNINHIBITED',
        directive: 'حوار مباشر، صريح، عميق، متحرر من القوالب التكرارية، تفاعل بشري واقعي بدون مواعظ أو تنصلات.'
      },
      GENERAL_CONVERSATION_AND_QUICK_QA: {
        ar: 'الحوار العام والإجابات المباشرة السريعة',
        mode: 'DIRECT_LACONIC_DIALOGUE',
        directive: 'إجابة موجزة، ذكية، مباشرة لصلب الموضوع دون حشو أو مقدمات استهلاكية، بدون أي إيموجي.'
      }
    };

    const target = intentLabelMap[intent] || intentLabelMap.GENERAL_CONVERSATION_AND_QUICK_QA;

    const isLight = complexity === 'LIGHT' || intent === 'GENERAL_CONVERSATION_AND_QUICK_QA';
    const thinkingClause = isLight
      ? '1. للأسئلة المباشرة، البسيطة، الحسابية، أو الحوارية: يُحظر التفكير المطول ويجب إغلاق الوسم </think> فوراً في أقل من سطر أو سطرين خاطفين (أقل من 20 كلمة) أو البدء فوراً بالإجابة لتحقيق أعلى سرعة استجابة فائقة (Sub-Second Latency).'
      : '1. فكّر أولاً بعمق وهدوء باللغة العربية داخل وسم <think>...</think> لتنظيم وتفكيك المعطيات منطقياً بما يتناسب مع حجم المسألة.';

    return `
[توجيه المعايرة التلقائية وجودة الإخراج — COGNITIVE ALIGNMENT DIRECTIVE]:
• نمط الإجابة والمسار: [${target.ar}] (${target.mode})
• التوجيه الصارم:
  ${target.directive}
• ضوابط الإخراج وكفاءة التوكنس (Token Economy & Zero Preamble):
  ${thinkingClause}
  2. بعد إغلاق الوسم </think>، قدّم إجابتك فوراً بصلب الموضوع باللغة العربية الفصحى المعاصرة.
  3. حظر مطلق لأي مقدمات استهلاكية أو عبارات مجاملة (مثل "أهلاً بك"، "حسناً"، "بالتأكيد"، "يسعدني"). ابدأ مباشرة بالإجابة أو الكود أو الجدول المطلوب لتحقيق أقصى كثافة معلوماتية لكل توكن.
  4. حظر مطلق لاستخدام أي إيموجي (No Unicode Emojis).
`.trim();
  }

  /**
   * Main Public Entrypoint: Coordinates complete Dynamic Parameter Tuning for any model request.
   */
  public static tune(request: DynamicTuningRequest): DynamicTuningResult {
    const { intent, confidence, complexity, hallucinationRisk, rationale, extractedSearchContext } =
      this.detectIntentAndComplexity(request);

    const modelFamily = this.resolveModelFamily(request.requestedModel);

    const hyperparameters = this.tuneHyperparameters(
      intent,
      complexity,
      modelFamily,
      { explicitTemperature: request.explicitTemperature }
    );

    const priorNeuralImage = this.extractPriorNeuralImage(request.conversationHistory || []);
    const detectedImageOperation = intent === 'NEURAL_IMAGE_STUDIO_AND_PROCESSING'
      ? this.detectImageOperationType(request.userPrompt, Boolean(priorNeuralImage))
      : undefined;

    const calibrationDirective = this.generateCalibrationDirective(
      intent,
      complexity,
      hyperparameters,
      modelFamily,
      request.requestedModel,
      {
        userPrompt: request.userPrompt,
        conversationHistory: request.conversationHistory,
        priorNeuralImage,
        subIntent: detectedImageOperation
      }
    );

    return {
      detectedIntent: intent,
      detectedImageOperation,
      priorNeuralImage,
      intentConfidence: confidence,
      complexityLevel: complexity,
      hallucinationRisk,
      targetModelFamily: modelFamily,
      hyperparameters,
      calibrationDirective,
      tuningRationale: rationale,
      extractedSearchContext,
      telemetry: {
        intent,
        model: request.requestedModel,
        temperature: hyperparameters.temperature,
        topP: hyperparameters.top_p,
        frequencyPenalty: hyperparameters.frequency_penalty,
        presencePenalty: hyperparameters.presence_penalty,
        maxTokens: hyperparameters.max_tokens,
        reasoningEffort: hyperparameters.reasoning_effort,
        thinkingMode: hyperparameters.thinking_mode,
        maxThinkingTokens: hyperparameters.max_thinking_tokens,
        timestamp: Date.now()
      }
    };
  }

  /**
   * Helper: Takes a candidate gateway payload and surgically injects the tuned parameters
   * tailored to that candidate's specific model family.
   *
   * Implements official DeepSeek API specs (https://api-docs.deepseek.com):
   * 1. KVCache & Scheduling Isolation via user_id
   * 2. Stream Usage Telemetry via stream_options: { include_usage: true }
   * 3. Thinking Mode & Reasoning Effort Control (low, high, max)
   * 4. Strict Sampling Parameter Sanitization
   */
  public static tuneGatewayPayload(
    candidateModel: string,
    basePayload: any,
    tuningResult: DynamicTuningResult
  ): any {
    const candidateFamily = this.resolveModelFamily(candidateModel);
    const candidateParams = this.tuneHyperparameters(
      tuningResult.detectedIntent,
      tuningResult.complexityLevel,
      candidateFamily
    );

    const payload: any = {
      ...basePayload,
      model: candidateModel,
      max_tokens: candidateParams.max_tokens,
      ...(basePayload && typeof basePayload.stream === 'boolean' ? { stream: basePayload.stream } : {}),
    };

    const isDeepSeekFamily =
      candidateFamily === 'deepseek-pro' ||
      candidateFamily === 'deepseek-flash' ||
      candidateFamily === 'deepseek-reasoner' ||
      candidateFamily === 'deepseek-chat' ||
      candidateFamily === 'deepseek-vision' ||
      candidateModel.toLowerCase().includes('deepseek');

    // 1. KVCache Isolation & Scheduling Isolation (regex ^[a-zA-Z0-9\-_]+$, max 512 chars)
    const rawUserId = String(basePayload?.user_id || tuningResult?.telemetry?.model || 'matany-client');
    const sanitizedUserId = rawUserId.replace(/[^a-zA-Z0-9\-_]/g, '').slice(0, 128) || 'matany-user';
    payload.user_id = sanitizedUserId;

    if (isDeepSeekFamily) {
      // 2. stream_options for KV-cache hit/miss token usage telemetry
      if (payload.stream !== false) {
        payload.stream_options = { include_usage: true };
      }

      // 3. Thinking Mode & Reasoning Effort
      const thinkingMode = candidateParams.thinking_mode || 'enabled';
      const reasoningEffort = candidateParams.reasoning_effort || 'high';
      const maxThinkingTokens = candidateParams.max_thinking_tokens;

      const thinkingObj: any = { type: thinkingMode };
      if (thinkingMode === 'enabled' && typeof maxThinkingTokens === 'number' && maxThinkingTokens > 0) {
        thinkingObj.budget_tokens = maxThinkingTokens;
      }

      payload.extra_body = {
        ...(payload.extra_body || {}),
        user_id: sanitizedUserId,
        thinking: thinkingObj
      };

      if (candidateFamily === 'deepseek-reasoner') {
        // DeepSeek Reasoner strictly forbids temperature, top_p, frequency_penalty, presence_penalty
        delete payload.temperature;
        delete payload.top_p;
        delete payload.frequency_penalty;
        delete payload.presence_penalty;
        payload.reasoning_effort = reasoningEffort;
        payload.extra_body.reasoning_effort = reasoningEffort;
        payload.reasoning = {
          effort: reasoningEffort,
          ...(typeof maxThinkingTokens === 'number' && maxThinkingTokens > 0 ? { max_tokens: maxThinkingTokens } : {})
        };
      } else if (thinkingMode === 'disabled') {
        // Thinking disabled (e.g. SVG Studio instant vector output)
        delete payload.reasoning_effort;
        delete payload.extra_body.reasoning_effort;
        delete payload.reasoning;
        payload.temperature = candidateParams.temperature;
        payload.top_p = candidateParams.top_p;
        if (candidateParams.frequency_penalty > 0) {
          payload.frequency_penalty = candidateParams.frequency_penalty;
        }
        if (candidateParams.presence_penalty > 0) {
          payload.presence_penalty = candidateParams.presence_penalty;
        }
      } else {
        // Standard models with thinking capability
        payload.reasoning_effort = reasoningEffort;
        payload.extra_body.reasoning_effort = reasoningEffort;
        payload.reasoning = {
          effort: reasoningEffort,
          ...(typeof maxThinkingTokens === 'number' && maxThinkingTokens > 0 ? { max_tokens: maxThinkingTokens } : {})
        };
        payload.temperature = candidateParams.temperature;
        payload.top_p = candidateParams.top_p;
        if (candidateParams.frequency_penalty > 0) {
          payload.frequency_penalty = candidateParams.frequency_penalty;
        }
        if (candidateParams.presence_penalty > 0) {
          payload.presence_penalty = candidateParams.presence_penalty;
        }
      }
    } else {
      // Non-DeepSeek Models (e.g., Fathom Search, Muse Spark, Magnum @ OpenRouter)
      payload.temperature = candidateParams.temperature;
      payload.top_p = candidateParams.top_p;
      if (candidateParams.frequency_penalty > 0) {
        payload.frequency_penalty = candidateParams.frequency_penalty;
      }
      if (candidateParams.presence_penalty > 0) {
        payload.presence_penalty = candidateParams.presence_penalty;
      }

      // OpenRouter Stream Usage Telemetry
      if (payload.stream !== false) {
        payload.stream_options = { include_usage: true };
      }

      // OpenRouter Official Context Compression Algorithm (prevents 400 context length errors)
      payload.transforms = ['middle-out'];

      // OpenRouter Smart Fallback Model Routing (server-side instant edge failover)
      payload.models = this.getOpenRouterFallbackModels(candidateModel);
      payload.route = 'fallback';

      // OpenRouter Advanced Provider Routing Algorithm
      const isThroughputTask =
        tuningResult.complexityLevel === 'EXHAUSTIVE_ARCHITECTURAL' ||
        tuningResult.detectedIntent === 'CYBERSECURITY_AND_EXPLOIT_AUDITING';

      payload.provider = {
        sort: isThroughputTask ? 'throughput' : 'latency',
        allow_fallbacks: true,
        require_parameters: true,
        data_collection: 'allow'
      };

      const thinkingMode = candidateParams.thinking_mode || 'enabled';
      const reasoningEffort = candidateParams.reasoning_effort || 'high';
      const maxThinkingTokens = candidateParams.max_thinking_tokens;

      if (thinkingMode === 'disabled') {
        delete payload.reasoning_effort;
        delete payload.reasoning;
        payload.extra_body = {
          ...(payload.extra_body || {}),
          user_id: sanitizedUserId,
          thinking: { type: 'disabled' }
        };
      } else {
        payload.reasoning_effort = reasoningEffort;
        payload.reasoning = {
          effort: reasoningEffort,
          ...(typeof maxThinkingTokens === 'number' && maxThinkingTokens > 0 ? { max_tokens: maxThinkingTokens } : {})
        };
        payload.extra_body = {
          ...(payload.extra_body || {}),
          user_id: sanitizedUserId,
          reasoning_effort: reasoningEffort,
          thinking: {
            type: thinkingMode,
            ...(typeof maxThinkingTokens === 'number' && maxThinkingTokens > 0 ? { budget_tokens: maxThinkingTokens } : {})
          }
        };
      }

      // Fathom Search Web Search integration via OpenRouter Official Web Server Tool (https://openrouter.ai/docs/features/server-tools/web-search)
      if (
        tuningResult.detectedIntent === 'FACTUAL_SEARCH_AND_REALTIME_GROUNDING' ||
        payload.enableWebSearch ||
        candidateFamily === 'fathom-search' ||
        candidateModel.includes('search') ||
        candidateModel.includes('qwen')
      ) {
        payload.tools = [
          {
            type: 'openrouter:web_search',
            parameters: {
              engine: 'auto',
              max_results: 5
            }
          }
        ];
      }
    }

    if (candidateParams.stop && candidateParams.stop.length > 0) {
      payload.stop = candidateParams.stop;
    }

    return payload;
  }

  /**
   * Assembles a KV-Cache Prefix-Preserved System Prompt.
   * DeepSeek matches prefixes character-for-character starting at index 0.
   * To achieve >90% KV cache hit rate ($0.014/1M vs $0.44/1M tokens, 96.8% savings):
   * - Static system base prompt + calibration directive are strictly anchored at the top.
   * - Dynamic volatile context (real-time timestamps, transient user memory) is placed AFTER the static prefix.
   */
  public static buildKVCacheOptimizedSystemPrompt(
    baseSystemPrompt: string,
    calibrationDirective: string,
    dynamicContext?: { timeDetectPrompt?: string; memoryPrompt?: string; guidance?: string }
  ): string {
    const staticPrefix = `${baseSystemPrompt.trim()}\n\n${calibrationDirective.trim()}`;
    const dynamicSections: string[] = [];

    if (dynamicContext?.guidance) {
      dynamicSections.push(dynamicContext.guidance.trim());
    }
    if (dynamicContext?.timeDetectPrompt) {
      dynamicSections.push(`[DYNAMIC TEMPORAL CONTEXT]:\n${dynamicContext.timeDetectPrompt.trim()}`);
    }
    if (dynamicContext?.memoryPrompt) {
      dynamicSections.push(`[DYNAMIC USER MEMORY]:\n${dynamicContext.memoryPrompt.trim()}`);
    }

    if (dynamicSections.length === 0) {
      return staticPrefix;
    }
    return `${staticPrefix}\n\n${dynamicSections.join('\n\n')}`;
  }

  /**
   * Cleans conversation messages for optimal DeepSeek Multi-Round Token Economy.
   * Per official DeepSeek documentation (https://api-docs.deepseek.com/guides/multi_round_chat):
   * - Past assistant reasoning tags (<think>...</think>) are stripped.
   * - Unused reasoning_content fields are omitted to save thousands of input tokens per turn.
   * - Preserves multimodal frames for vision requests.
   */
  public static cleanConversationHistoryForKVCache(
    messages: Array<{ role: string; content: any; reasoning_content?: any }>,
    options?: { isMediaSpark?: boolean; isVision?: boolean; hasMultimodal?: boolean }
  ): Array<{ role: string; content: any }> {
    return messages.map((m, idx) => {
      const isLatestTurn = idx === messages.length - 1;

      // Preserve multimodal content array if multimodal frames exist
      if (Array.isArray(m.content) && (options?.isMediaSpark || options?.isVision || options?.hasMultimodal)) {
        return {
          role: m.role || 'user',
          content: m.content
        };
      }

      let contentStr = '';
      if (typeof m.content === 'string') {
        contentStr = m.content.trim();
      } else if (Array.isArray(m.content)) {
        contentStr = m.content.map((c: any) => c.text || '').join(' ').trim();
      } else {
        contentStr = JSON.stringify(m.content || '');
      }

      // Clean out any thinking tags from past assistant history to avoid token waste & model corruption
      if (m.role === 'assistant') {
        contentStr = contentStr
          .replace(/<think>[\s\S]*?<\/think>/gi, '')
          .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
          .replace(/```(?:thought|think|thinking|reasoning)[\s\S]*?```/gi, '')
          .trim();
      }

      if (!isLatestTurn && contentStr.length > 12000) {
        contentStr = `${contentStr.slice(0, 6000)}\n\n[... تم إيجاز جزء من السياق القديم الممتد للحفاظ على أعلى سرعة واستجابة ...]\n\n${contentStr.slice(-4000)}`;
      }

      return {
        role: m.role || 'user',
        content: contentStr || 'متابعة'
      };
    });
  }

  /**
   * OpenRouter Model Fallback Routing Chains
   * Per https://openrouter.ai/docs, providing the 'models' array with route: 'fallback'
   * allows OpenRouter to immediately fail over at the edge to subsequent models if the primary
   * model experiences outages, 429 rate-limiting, or context overflow.
   */
  public static getOpenRouterFallbackModels(primaryModel: string, hasWebSearch = false): string[] {
    const cleanModel = (primaryModel || '').replace(/:online$/i, '').trim();

    if (hasWebSearch) {
      const candidates = [
        cleanModel,
        'google/gemini-2.5-flash',
        'meta/muse-spark-1.2-contributor'
      ];
      return Array.from(new Set(candidates.filter(Boolean))).slice(0, 3);
    }

    if (cleanModel.includes('muse-spark-1.3')) {
      return [
        cleanModel,
        'anthracite-org/magnum-v4-72b',
        'google/gemini-2.5-flash'
      ].slice(0, 3);
    }
    if (cleanModel.includes('muse-spark-1.2')) {
      return [
        cleanModel,
        'meta/muse-spark-1.3-contributor',
        'google/gemini-2.5-flash'
      ].slice(0, 3);
    }
    if (cleanModel.includes('magnum')) {
      return [
        cleanModel,
        'meta/muse-spark-1.3-contributor',
        'google/gemini-2.5-flash'
      ].slice(0, 3);
    }
    if (cleanModel.includes('gemini')) {
      return [
        cleanModel,
        'meta/muse-spark-1.3-contributor',
        'anthracite-org/magnum-v4-72b'
      ].slice(0, 3);
    }

    return [
      cleanModel || 'meta/muse-spark-1.3-contributor',
      'anthracite-org/magnum-v4-72b',
      'google/gemini-2.5-flash'
    ].slice(0, 3);
  }

  /**
   * Sanitizes and calibrates payloads right before sending over HTTP to a specific gateway.
   * Incorporates official OpenRouter state-of-the-art algorithms:
   * 1. Dynamic Provider Routing: latency vs throughput sorting, failovers, require_parameters, data privacy
   * 2. Edge Model Fallback Routing: 'models' array & route: 'fallback'
   * 3. Context Optimization: 'transforms': ['middle-out']
   * 4. Prompt Caching & Sticky Routing: cache_control ephemeral markers on long system prompts
   * 5. Parameter Conformance: Stripping conflicting max_tokens from reasoning to eliminate 400 Bad Request
   * 6. Usage Telemetry: stream_options { include_usage: true }
   */
  public static sanitizeForGateway(url: string, payload: any): any {
    if (!payload || typeof payload !== 'object') return payload;
    const cleanPayload = { ...payload };

    if (typeof url === 'string' && url.includes('openrouter.ai')) {
      // 1. OpenRouter Reasoning & Effort Calibration (Prevents 400 Bad Request)
      if (cleanPayload.reasoning && typeof cleanPayload.reasoning === 'object') {
        cleanPayload.reasoning = { ...cleanPayload.reasoning };
        if (cleanPayload.reasoning.effort && cleanPayload.reasoning.max_tokens) {
          delete cleanPayload.reasoning.max_tokens;
        }
        if (cleanPayload.reasoning.effort === 'max') {
          cleanPayload.reasoning.effort = 'high';
        }
      }

      // 2. OpenRouter Context Optimization: Middle-out truncation
      if (!cleanPayload.transforms || !Array.isArray(cleanPayload.transforms)) {
        cleanPayload.transforms = ['middle-out'];
      }

      const hasExplicitWebSearch = Boolean(
        cleanPayload.enableWebSearch ||
        cleanPayload.deepSearch ||
        (Array.isArray(cleanPayload.tools) && cleanPayload.tools.some((t: any) => t.type === 'openrouter:web_search'))
      );

      // 3. OpenRouter Model Fallback Routing Chain (Strictly max 3 items allowed by OpenRouter)
      if (cleanPayload.model && (!cleanPayload.models || !Array.isArray(cleanPayload.models) || hasExplicitWebSearch)) {
        cleanPayload.models = this.getOpenRouterFallbackModels(cleanPayload.model, hasExplicitWebSearch);
        cleanPayload.route = 'fallback';
      }
      if (Array.isArray(cleanPayload.models)) {
        cleanPayload.models = cleanPayload.models.slice(0, 3);
      }

      // 4. OpenRouter Provider Routing Engine
      if (!cleanPayload.provider) {
        cleanPayload.provider = {
          sort: 'latency',
          allow_fallbacks: true,
          require_parameters: !hasExplicitWebSearch,
          data_collection: 'allow'
        };
      } else {
        if (cleanPayload.provider.data_collection === 'deny') {
          cleanPayload.provider.data_collection = 'allow';
        }
        if (hasExplicitWebSearch) {
          cleanPayload.provider.require_parameters = false;
        }
      }

      // If web search is active, purge extra_body to prevent OpenRouter provider parameter mismatch (HTTP 404)
      if (hasExplicitWebSearch) {
        delete cleanPayload.extra_body;
      }

      // 5. OpenRouter Stream Usage Telemetry
      if (cleanPayload.stream !== false && !cleanPayload.stream_options) {
        cleanPayload.stream_options = { include_usage: true };
      }

      // 6. OpenRouter Prompt Caching & Sticky Routing Support
      if (Array.isArray(cleanPayload.messages)) {
        cleanPayload.messages = cleanPayload.messages.map((m: any) => {
          if (m.role === 'system' && typeof m.content === 'string' && m.content.length > 500 && !m.cache_control) {
            return {
              ...m,
              cache_control: { type: 'ephemeral' }
            };
          }
          return m;
        });
      }

      // 7. OpenRouter Native Web Search Server Tool Integration (https://openrouter.ai/docs/features/server-tools/web-search)
      const hasWebSearchInTools = Array.isArray(cleanPayload.tools) && cleanPayload.tools.some((t: any) => t.type === 'openrouter:web_search');

      if (hasExplicitWebSearch || hasWebSearchInTools) {
        delete cleanPayload.plugins;
        if (typeof cleanPayload.model === 'string' && cleanPayload.model.endsWith(':online')) {
          cleanPayload.model = cleanPayload.model.replace(/:online$/, '');
        }
        if (Array.isArray(cleanPayload.models)) {
          cleanPayload.models = cleanPayload.models.map((m: string) => typeof m === 'string' ? m.replace(/:online$/, '') : m);
        }

        const maxResults = cleanPayload.webSearchMaxResults || 6;
        const engineChoice = cleanPayload.searchEngine === 'brave' ? 'brave' : 'auto';
        const webSearchTool = {
          type: 'openrouter:web_search',
          parameters: {
            engine: engineChoice,
            max_results: maxResults
          }
        };

        if (!Array.isArray(cleanPayload.tools)) {
          cleanPayload.tools = [webSearchTool];
        } else {
          cleanPayload.tools = cleanPayload.tools.filter((t: any) => t.type !== 'openrouter:web_search');
          cleanPayload.tools.push(webSearchTool);
        }
      }

      // Purge non-standard top-level parameters before gateway transmission
      delete cleanPayload.enableWebSearch;
      delete cleanPayload.deepSearch;
      delete cleanPayload.webSearchMaxResults;
      delete cleanPayload.searchEngine;
    }
    return cleanPayload;
  }
}

export function detectImageOperationType(userPrompt: string, hasPriorImage: boolean = true): ImageOperationType {
  return DynamicParameterTuner.detectImageOperationType(userPrompt, hasPriorImage);
}

export function detectDynamicTuning(
  userPrompt: string,
  requestedModel: string = 'deepseek-v4-pro',
  conversationHistory: Array<{ role: string; content: any }> = [],
  options?: { hasMedia?: boolean; hasImages?: boolean; hasImagesInHistory?: boolean; isMatanyMode?: boolean }
) {
  const history = [...conversationHistory];
  if (options?.hasImagesInHistory && history.length === 0) {
    history.push({
      role: 'assistant',
      content: '```neural-image\n{\n  "operation": "generate",\n  "imageUrl": "https://example.com/car.png",\n  "title": "مرسيدس"\n}\n```'
    });
  }

  const tuned = DynamicParameterTuner.tune({
    userPrompt,
    requestedModel,
    conversationHistory: history,
    hasMultimodalImages: options?.hasImages,
    hasVideoOrAudio: options?.hasMedia,
    isMatanyMode: options?.isMatanyMode,
  });

  return {
    ...tuned,
    requiresSearch: tuned.detectedIntent === 'FACTUAL_SEARCH_AND_REALTIME_GROUNDING'
  };
}

