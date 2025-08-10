import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [aiPercent, setAiPercent] = useState(null);
  const [humanizedText, setHumanizedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function checkAi() {
    setLoading(true);
    setError('');
    setAiPercent(null);
    setHumanizedText('');
    try {
      const res = await fetch('/api/check-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error checking AI');
      setAiPercent(data.percent);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function humanize() {
    setLoading(true);
    setError('');
    setHumanizedText('');
    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error humanizing text');
      setHumanizedText(data.rewritten);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 700, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Detector & Humanizer</h1>

      <textarea
        rows={8}
        style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 10 }}
        placeholder="Paste your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button onClick={checkAi} disabled={loading || !inputText.trim()} style={{ marginRight: 10 }}>
        Check AI %
      </button>
      <button onClick={humanize} disabled={loading || !inputText.trim()}>
        Humanize Text
      </button>

      {loading && <p>Processing...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {aiPercent !== null && !error && (
        <p>
          AI Generated Percentage Estimate: <strong>{aiPercent}%</strong>
        </p>
      )}

      {humanizedText && !error && (
        <>
          <h3>Humanized Text:</h3>
          <p style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: 10 }}>{humanizedText}</p>
        </>
      )}
    </main>
  );
}
