// Vercel Serverless Function — Higgsfield Proxy
// Splits into two actions to stay within 10s timeout:
//   POST { action: 'generate', prompt, reference_elements } → { job_id }
//   GET  ?action=poll&job_id=xxx                            → Higgsfield job status

const SECRET = process.env.HIGGSFIELD_SECRET;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!SECRET) return res.status(500).json({ error: 'HIGGSFIELD_SECRET not configured' });

  const action = req.method === 'GET' ? req.query.action : req.body?.action;

  try {
    // ── ping ──────────────────────────────────────────────────────────────────
    if (action === 'ping') {
      return res.json({ ok: true, message: 'MIRU Higgsfield Proxy — online' });
    }

    // ── generate: submit job, return job_id immediately ───────────────────────
    if (action === 'generate') {
      const { prompt, reference_elements, aspect_ratio } = req.body;
      if (!prompt) return res.status(400).json({ error: 'prompt required' });

      const body = {
        model: 'nano_banana',
        prompt,
        aspect_ratio: aspect_ratio || '16:9',
      };
      if (reference_elements?.length) body.reference_elements = reference_elements;

      const upstream = await fetch('https://api.higgsfield.ai/v1/generate/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SECRET}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      });

      const text = await upstream.text();
      if (!upstream.ok) {
        return res.status(upstream.status).json({
          error: `Higgsfield HTTP ${upstream.status}`,
          detail: text,
        });
      }

      const data = JSON.parse(text);
      const jobId = data.results?.[0]?.id || data.id;
      if (!jobId) return res.status(500).json({ error: 'No job_id in response', detail: text });

      return res.json({ ok: true, job_id: jobId });
    }

    // ── poll: check job status (browser calls this every 4s) ──────────────────
    if (action === 'poll') {
      const jobId = req.query.job_id || req.body?.job_id;
      if (!jobId) return res.status(400).json({ error: 'job_id required' });

      const upstream = await fetch(`https://api.higgsfield.ai/v1/jobs/${jobId}`, {
        headers: { 'Authorization': `Bearer ${SECRET}` },
        signal: AbortSignal.timeout(8000),
      });

      const data = await upstream.json();
      return res.json(data);
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
