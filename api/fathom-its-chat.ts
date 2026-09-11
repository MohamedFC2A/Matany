import { FathomITSPedagogicalEngine } from '../server/fathomITSEngine';

export const config = {
  maxDuration: 60,
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userMessage, conversationHistory = [], studentProfile } = req.body || {};
    if (userMessage === undefined || userMessage === null) {
      return res.status(400).json({ error: 'User message is required.' });
    }

    const result = await FathomITSPedagogicalEngine.executeTutoringTurn({
      userMessage: String(userMessage),
      conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : [],
      studentProfile: studentProfile || {
        targetLanguage: 'en',
        voiceName: 'George',
        currentCEFR: 'B1',
        targetCEFR: 'C1',
        currentPoints: 0
      }
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[Fathom ITS Serverless Error]:', error);
    return res.status(500).json({ error: error?.message || 'Tutoring turn execution failed' });
  }
}
