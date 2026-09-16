import type { Request, Response } from 'express';
import { CURATED_TUTOR_VOICES } from '../src/types/fathomITS';

export { CURATED_TUTOR_VOICES };

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_858ae6e9712e57c6f212b1c3f6057dd48b72786b06eb1034';

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id, xi-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const method = req.method;
  const action = req.query?.action || (req.body && req.body.action);
  const url = req.url || '';

  if (method === 'GET' || action === 'voices' || url.includes('voices')) {
    return handleElevenLabsVoices(req, res);
  }

  if (method === 'POST' || url.includes('tts') || url.includes('preview')) {
    return handleElevenLabsTTS(req, res);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
