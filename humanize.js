import { callHuggingFace } from './hf-client';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const { text, tone } = req.body;
    if (!text || text.trim().length === 0) return res.status(400).json({ error: 'Empty text' });

    const model = 'google/flan-t5-large';

    let prompt = `Paraphrase the following text to sound more natural and human while preserving meaning.`;
    if (tone) prompt += ` Make the tone: ${tone}.`;
    prompt += `\n\nText:\n${text}`;

    const body = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
      },
    };

    const output = await callHuggingFace(model, body);

    let rewritten = null;
    if (Array.isArray(output) && output[0] && output[0].generated_text) rewritten = output[0].generated_text;
    else if (typeof output === 'string') rewritten = output;
    else if (output.generated_text) rewritten = output.generated_text;
    else if (output[0] && output[0].text) rewritten = output[0].text;

    if (!rewritten) {
      rewritten = JSON.stringify(output);
    }

    res.json({ rewritten, raw: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
