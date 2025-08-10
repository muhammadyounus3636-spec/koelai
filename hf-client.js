import fetch from 'node-fetch';

const HF_BASE = 'https://api-inference.huggingface.co/models';

export async function callHuggingFace(model, body) {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key) throw new Error('Missing HUGGINGFACE_API_KEY in env');

  const res = await fetch(`${HF_BASE}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Hugging Face API error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  return data;
}
