import type { Request, Response } from 'express';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_858ae6e9712e57c6f212b1c3f6057dd48b72786b06eb1034';

export const CURATED_TUTOR_VOICES = [
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

// In-memory LRU audio preview cache to minimize ElevenLabs API calls
const audioCache = new Map<string, { buffer: Buffer; mime: string; timestamp: number }>();

export async function handleElevenLabsTTS(req: Request, res: Response) {
  try {
    const { text, voiceId, modelId = 'eleven_turbo_v2_5' } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    const targetVoiceId = voiceId || CURATED_TUTOR_VOICES[0].id;
    const cleanText = text.trim();

    // Cache check for identical queries
    const cacheKey = `${targetVoiceId}:${cleanText}`;
    const cached = audioCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60) {
      res.setHeader('Content-Type', cached.mime);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-Cache-Status', 'HIT');
      return res.send(cached.buffer);
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}?output_format=mp3_44100_128`;

    const upstreamResponse = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!upstreamResponse.ok) {
      const errText = await upstreamResponse.text();
      console.error('[ElevenLabs Proxy Error]:', upstreamResponse.status, errText);
      return res.status(upstreamResponse.status).json({
        error: 'Failed to synthesize speech from ElevenLabs',
        details: errText
      });
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to cache (cap size to prevent memory bloat)
    if (audioCache.size > 200) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, { buffer, mime: 'audio/mpeg', timestamp: Date.now() });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Cache-Status', 'MISS');
    return res.send(buffer);
  } catch (error: any) {
    console.error('[ElevenLabs TTS Handler Exception]:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error in speech synthesis' });
  }
}

export function handleElevenLabsVoices(_req: Request, res: Response) {
  return res.status(200).json({
    status: 'success',
    voices: CURATED_TUTOR_VOICES
  });
}

// Vercel Serverless / Edge Export
export default async function handler(req: any, res: any) {
  const method = req.method;
  const action = req.query?.action || (req.body && req.body.action);

  if (method === 'GET' || action === 'voices') {
    return handleElevenLabsVoices(req, res);
  }

  if (method === 'POST') {
    return handleElevenLabsTTS(req, res);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
