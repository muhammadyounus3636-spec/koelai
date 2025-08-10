import { callHuggingFace } from './hf-client';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const { text } = req.body;
    if (!text || text.trim().length === 0) return res.status(400).json({ error: 'Empty text' });

    const model = 'hello-simpleai/ai-detector';

    const body = { inputs: text };

    const output = await callHuggingFace(model, body);

    let aiProbability = null;
    if (Array.isArray(output)) {
      const ai = output.find(o => /ai|machine/i.test(o.label));
      const human = output.find(o => /human|real/i.test(o.label));
      if (ai && ai.score != null) aiProbability = ai.score;
      else if (human && human.score != null) aiProbability = 1 - human.score;
      else if (output[0] && output[0].score != null) aiProbability = output[0].score;
    } else if (output.label && output.score != null) {
      if (/ai|machine/i.test(output.label)) aiProbability = output.score;
      else aiProbability = 1 - output.score;
    } else if (output.scores && output.scores.ai) {
      aiProbability = output.scores.ai;
    } else if (typeof output === 'object' && output.error) {
      throw new Error(output.error);
    }

    if (aiProbability == null) {
      aiProbability = 0.5;
    }

    const percent = Math.round(aiProbability * 100);

    res.json({ percent, raw: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
