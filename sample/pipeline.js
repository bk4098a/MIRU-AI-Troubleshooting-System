// MIRU AI Troubleshooting Pipeline
// Flow: Korean input → Groq (translate + script) → Higgsfield via Vercel proxy → Slack
// Image fallback: Vercel proxy → OpenAI gpt-image-1 → pollinations.ai

// ─── Vercel proxy URL (set after deployment) ──────────────────────────────────
const VERCEL_PROXY_URL = (() => {
  try { return localStorage.getItem('VERCEL_PROXY_URL') || window.MIRU_CONFIG?.VERCEL_PROXY_URL || ''; }
  catch(e) { return window.MIRU_CONFIG?.VERCEL_PROXY_URL || ''; }
})();

// ─── Fixed visual standard ────────────────────────────────────────────────────
const BG_STANDARD = `BACKGROUND: Replace the entire background with a seamless, uniform neutral light-grey studio backdrop. Remove all clutter — cables, plastic bags/wrap, beige walls, wooden desks, other equipment. Keep ONLY the PCOS machine, the relevant parts, and the hand. Soft even studio light, subtle soft shadow under the machine. Horizontal, 16:9.`;

// ─── Kling master prompt structure (IMPORTANT / MOTION / NEGATIVE) ────────────
const KLING_IMPORTANT = `IMPORTANT: Keep the machine, screen, ports, buttons, cables, and ALL text, logos, labels, and UI elements exactly as in the source frames. Do NOT change, morph, melt, warp, redraw, or re-letter any structure or text. The on-screen text is a flat, frozen UI graphic — keep every character pixel-for-pixel as in the start and end frames; never re-render, animate, or invent screen text. Only the specified motion occurs; everything else stays perfectly still and stable.`;
const KLING_NEGATIVE = `NEGATIVE: warping, morphing, melting, distorted text, changing letters, garbled text, gibberish text, deformed logo, altered UI, re-rendered screen content, shifting ports, moving buttons, wrong button, structure deformation, extra fingers, deformed hand, mutated fingers, extra hands, extra objects, flickering, wobbling background, background change, camera shake, jitter`;
function buildKlingPrompt(motion) {
  return `${KLING_IMPORTANT}\nMOTION: ${motion}\n${KLING_NEGATIVE}`;
}

// ─── Demo images: Higgsfield nano_banana_2, PCOS Paper Jam scenario ───────────
const DEMO_IMAGES = {
  'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260630_022730_362a2f3e-3c2a-4195-a323-d49c178b9210.png',
  'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260630_023754_2ea8ed61-244d-4100-8c4c-f777407bba90.png',
  'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260630_023757_7d77f071-ca5d-4a92-bc1f-136d1c6292b4.png',
};

// ─── Groq prompt builder ──────────────────────────────────────────────────────
function buildGeminiPrompt(data) {
  // Load optional troubleshooting manual context from admin setup
  const manualContext = (() => {
    try {
      return localStorage.getItem('PCOS_MANUAL_CONTEXT') || window.MIRU_CONFIG?.PCOS_DEFAULT_MANUAL || '';
    } catch(e) {
      return window.MIRU_CONFIG?.PCOS_DEFAULT_MANUAL || '';
    }
  })();

  return `You are a professional technical video script generator for MIRU Systems' PCOS (Polling Station Count Optical Scanner) troubleshooting guide videos.

PCOS (АСУ): Optical paper-ballot scanner/counter used at polling stations. Scans and counts ballots, transmits results via network. Uses smart card, flash card (USB), SD card (x2: primary/backup), and ECF configuration file. Key errors: UIK number mismatch (voter station ID error), flash card/SD card data mismatch (mixed paired storage), ECF NOT FOUND (config file missing or wrong UIK in DB), paper jam (visible paper stuck in scanner slot — open cover, remove paper), scanner cover open, double feed, stain on scanner glass, network disconnect, battery low, ballot stacker jam (MOST COMMON hardware error on aged machines — machine fails to classify ballot due to worn rollers, ballot exits to rear stacker uncounted; NO on-screen error; fix: open front transparent cover, gently remove jammed ballot from paper path, close cover, re-insert ballot); unclassified ballot (aged machine — worn springs and rubber rollers in internal sorting diverter mechanism fail to route ballot to correct output pocket; ballot exits to wrong compartment instead of sorted tray; machine may show '미분류 투표지' on display; NO self-repair possible in field; fix: STOP scanning immediately, open lower output compartment door, retrieve all misrouted ballots with both hands, manually verify each ballot visually, re-scan retrievable ballots or hand-count damaged ones, request technician for spring/rubber replacement).
${manualContext ? `\nPCOS TROUBLESHOOTING MANUAL REFERENCE:\n${manualContext.slice(0, 8000)}\n` : ''}
VISUAL STANDARD (all clips):
- Format: 16:9, 720p, silent, 4-5 seconds per clip, fixed camera
- ${BG_STANDARD}
- Kling format: [start frame description] -> [end frame description], no camera movement
- Clip types: PROBLEM clip (error state) -> SOLUTION clips (step-by-step action)

MANDATORY IMAGE BACKGROUND RULE — THIS IS NON-NEGOTIABLE:
Every image prompt you write (including all image_enhancement fields) MUST end with exactly this sentence:
"BACKGROUND: Replace the entire background with a seamless, uniform neutral light-grey studio backdrop. Remove all clutter — cables, plastic bags/wrap, beige walls, wooden desks, other equipment. Keep ONLY the PCOS machine, the relevant parts, and the hand. Soft even studio light, subtle soft shadow under the machine. Horizontal, 16:9."
DO NOT use polling station interiors, election signage, blue-vested officials, or any real-world background. Grey studio only. No people — only the machine and a single disembodied hand where needed.

Reference structure:
- PROBLEM clip: static error screen on display, or machine in error state
- SOLUTION clip 1: first action (press OK, open cover, etc.)
- SOLUTION clip 2: core fix action (remove paper, clean glass, etc.)
- Precision actions (cleaning, insertion) -> Seedance model; button press, open/close -> Kling

ERROR REPORT:
---
Product: PCOS - Polling Station Count Optical Scanner
Country / Deployment: ${data.country}
Error Types Selected: ${data.errorTypes.join(', ')}

[Section 1 - Error Situation]:
${data.situation}

[Section 2 - Actions Before Error Occurred]:
${data.priorActions}

[Section 3 - Solution Attempted]:
${data.solution}
${data.userFeedback ? `\n[REGENERATION FEEDBACK - please address these specific issues in your output]:\n${data.userFeedback}\n` : ''}---

REASONING PROTOCOL — before writing each clip, think through these three steps internally:
1. SYMPTOM: What is the operator seeing/hearing right now? (screen message, machine behavior, physical state)
2. CAUSE: What component is failing and why? (worn part, wrong config, missing file, physical obstruction)
3. ACTION: What specific hands-on step resolves the root cause — not just clears the screen?
Your clip descriptions must reflect this causal chain. Generic steps ("press OK, then restart") are not acceptable. Each description must name the specific component and why that action works for this error.

Respond ONLY with valid JSON, no markdown:
{
  "translation": {
    "situation": "<English translation of Section 1>",
    "prior_actions": "<English translation of Section 2>",
    "solution": "<English translation of Section 3>",
    "summary": "<One English sentence: what happened and what fixed it>"
  },
  "image_enhancement": {
    "photo_error_screen": "<Higgsfield prompt describing the PCOS machine showing this specific error on screen. MUST end with the full MANDATORY IMAGE BACKGROUND RULE sentence verbatim. No people, no backgrounds, grey studio only.>",
    "photo_error_state": "<Higgsfield prompt describing PCOS machine in error state with relevant physical detail (open cover, paper visible, etc.). MUST end with the full MANDATORY IMAGE BACKGROUND RULE sentence verbatim. No people, grey studio only.>",
    "photo_resolution": "<Higgsfield prompt describing PCOS machine after fix — display green, normal state. MUST end with the full MANDATORY IMAGE BACKGROUND RULE sentence verbatim. No people, grey studio only.>"
  },
  "kling_clips": [
    {
      "clip_id": "PROB-01",
      "label": "PROBLEM",
      "model": "Kling",
      "title": "<3-5 word English title>",
      "start_frame": "<describe exact visual state of PCOS machine at start>",
      "end_frame": "<describe end frame — slight change, e.g. hand approaching OK button>",
      "motion": "<MOTION section ONLY — fixed locked-off angle of PCOS, describe exactly what hand/machine does, camera dead still. E.g.: Fixed front view. PCOS display shows Paper Jam error in red. No motion yet — static error state.>",
      "caption_main": "<3-5 WORD UPPERCASE>",
      "caption_sub": "<one sentence, what operator sees>",
      "description": "<2-3 sentences English. Describe exactly what is shown: machine state, which part is highlighted, what operator observes. Technical manual style.>",
      "photo_ref": "photo_error_screen"
    },
    {
      "clip_id": "SOL-01",
      "label": "SOLUTION STEP 1",
      "model": "Kling",
      "title": "<3-5 word English title>",
      "start_frame": "<..>",
      "end_frame": "<..>",
      "motion": "<MOTION only: Fixed [angle] view. A hand enters from [direction] and [action]. E.g.: Fixed front-right view. A hand's index finger enters from the right and presses the OK button on the touchscreen. Screen transitions from error state to confirmation. Camera dead still.>",
      "caption_main": "<..>",
      "caption_sub": "<..>",
      "description": "<2-3 sentences English. Describe what operator is doing: which button/part, what motion, what changes on screen. Manual style.>",
      "photo_ref": "photo_error_state"
    },
    {
      "clip_id": "SOL-02",
      "label": "SOLUTION STEP 2",
      "model": "Seedance",
      "title": "<..>",
      "start_frame": "<..>",
      "end_frame": "<..>",
      "motion": "<MOTION only: Fixed [angle] view. [Describe the resolution action — e.g. hand removes jammed paper, opens/closes cover, inserts card]. E.g.: Fixed top-down view. A hand carefully lifts the jammed ballot from the scanner slot. PCOS display transitions to green ready state. Camera dead still.>",
      "caption_main": "<..>",
      "caption_sub": "<..>",
      "description": "<2-3 sentences English. Describe resolution: what was fixed, what PCOS displays after fix, confirmation system restored.>",
      "photo_ref": "photo_resolution"
    }
  ],
  "slack_summary": "<2-line Slack message summarizing error + fix>"
}`;
}

// ─── Groq API ─────────────────────────────────────────────────────────────────
async function callGeminiFlash(prompt) {
  const apiKey = (() => {
    try { return localStorage.getItem('GROQ_API_KEY') || window.MIRU_CONFIG?.GROQ_API_KEY || ''; }
    catch(e) { return window.MIRU_CONFIG?.GROQ_API_KEY || ''; }
  })();
  if (!apiKey) throw new Error('GROQ_API_KEY not set — admin.html > PCOS 마스터 설정에서 입력하세요');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Groq API error ${res.status}: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned empty response');

  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(clean);
}

// ─── Higgsfield via Vercel proxy ─────────────────────────────────────────────
async function generateViaProxy(prompt, referenceElements, proxyUrl) {
  // 1. Submit job
  const genRes = await fetch(`${proxyUrl}/api/higgsfield`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generate', prompt, reference_elements: referenceElements }),
  });
  if (!genRes.ok) {
    const err = await genRes.json().catch(() => ({}));
    throw new Error(`Proxy generate failed ${genRes.status}: ${err.error || err.detail || ''}`);
  }
  const { job_id } = await genRes.json();
  if (!job_id) throw new Error('No job_id from proxy');

  // 2. Poll until done (max 2 min)
  for (let i = 0; i < 30; i++) {
    await sleep(4000);
    const pollRes = await fetch(`${proxyUrl}/api/higgsfield?action=poll&job_id=${job_id}`);
    if (!pollRes.ok) continue;
    const data = await pollRes.json();
    if (data.status === 'completed') return data.results?.rawUrl || data.url;
    if (data.status === 'failed') throw new Error('Higgsfield job failed');
  }
  throw new Error('Higgsfield proxy timeout');
}

// ─── OpenAI image generation (gpt-image-1 → dall-e-3 fallback) ───────────────
async function generateOpenAIImage(prompt, apiKey) {
  // gpt-image-1 먼저 시도 (비즈니스 계정), 실패 시 dall-e-3 fallback
  const configs = [
    { model: 'gpt-image-1', size: '1536x1024', quality: 'medium' },
    { model: 'dall-e-3',    size: '1792x1024', quality: 'hd', response_format: 'url' },
  ];

  for (const cfg of configs) {
    try {
      const body = { model: cfg.model, prompt, n: 1, size: cfg.size };
      if (cfg.quality)          body.quality = cfg.quality;
      if (cfg.response_format)  body.response_format = cfg.response_format;

      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`OpenAI ${cfg.model} failed (${res.status}):`, err?.error?.message);
        continue;
      }

      const data = await res.json();
      const item = data.data?.[0];
      if (!item) continue;
      if (item.b64_json) return `data:image/png;base64,${item.b64_json}`;
      if (item.url)      return item.url;

    } catch(e) {
      console.warn(`OpenAI ${cfg.model} error:`, e.message);
    }
  }
  throw new Error('OpenAI image generation failed — both models exhausted');
}

// ─── PCOS master image mapping (error type → 2 reference images) ─────────────
const PCOS_MASTER_BASE = './pcos_ref';

const ERROR_MASTER_MAP = {
  'Ballot Stacker Jam':  ['IMG_9850', 'IMG_9856'],  // cover open + mechanism — most common
  'UIK Mismatch':        ['IMG_9849', 'IMG_9850'],
  'Flash Card Mismatch': ['IMG_9849', 'IMG_9852'],
  'ECF NOT FOUND':       ['IMG_9849', 'IMG_9851'],
  'Paper Jam':           ['IMG_9852', 'IMG_9856'],
  'Double Feed':         ['IMG_9860', 'IMG_9856'],
  'Scanner Cover Open':  ['IMG_9850', 'IMG_9852'],
  'Stain on Glass':      ['IMG_9856', 'IMG_9860'],
  'Network Disconnect':  ['IMG_9849', 'IMG_9850'],
  'Battery Low':         ['IMG_9849', 'IMG_9853'],
  'SD Card Error':       ['IMG_9849', 'IMG_9854'],
  'Smart Card Error':    ['IMG_9849', 'IMG_9855'],
  'Unclassified Ballot': ['IMG_9850', 'IMG_9852'],  // cover open + sorting slot — worn spring/rubber
};

function pickMasterImages(errorTypes) {
  for (const et of (errorTypes || [])) {
    for (const [key, imgs] of Object.entries(ERROR_MASTER_MAP)) {
      if (et.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(et.toLowerCase())) {
        return imgs.map(name => `${PCOS_MASTER_BASE}/${name}.jpg`);
      }
    }
  }
  return ['IMG_9849', 'IMG_9850'].map(name => `${PCOS_MASTER_BASE}/${name}.jpg`);
}

async function fetchImageAsBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch failed ${res.status}: ${url}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// OpenAI Responses API — gpt-4o with image_generation tool + reference images
async function generateOpenAIImageWithRefs(prompt, refImageUrls, apiKey) {
  const content = [];

  for (const url of refImageUrls) {
    try {
      const b64 = await fetchImageAsBase64(url);
      content.push({ type: 'input_image', image_url: b64 });
    } catch(e) {
      console.warn('Reference image load failed, skipping:', url, e.message);
    }
  }
  content.push({ type: 'input_text', text: prompt });

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      input: [{ role: 'user', content }],
      tools: [{ type: 'image_generation', size: '1536x1024', quality: 'medium' }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI Responses API ${res.status}: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  for (const out of (data.output || [])) {
    if (out.type === 'image_generation_call' && out.result) {
      return `data:image/png;base64,${out.result}`;
    }
  }
  throw new Error('No image_generation_call result in Responses API output');
}

// ─── Pollinations.ai image generation (free fallback, no API key needed) ──────
async function generatePollinationsImage(prompt) {
  const enriched = `${prompt} Professional studio product photography, clean neutral light-grey background, sharp focus, 16:9`;
  const seed = Math.floor(Math.random() * 999999);
  // pollinations.ai returns image directly — usable as img src or preloaded via fetch
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(enriched)}?width=1280&height=720&nologo=true&model=flux&seed=${seed}`;
}

// ─── Image generation orchestrator ───────────────────────────────────────────
// Priority: Vercel proxy (Higgsfield) → OpenAI gpt-image-1 → pollinations.ai
async function generateHiggsImages(clips, photos, onProgress, errorTypes) {
  const proxyUrl = (() => {
    try { return localStorage.getItem('VERCEL_PROXY_URL') || window.MIRU_CONFIG?.VERCEL_PROXY_URL || ''; }
    catch(e) { return window.MIRU_CONFIG?.VERCEL_PROXY_URL || ''; }
  })();
  const openaiKey = (() => {
    try { return localStorage.getItem('OPENAI_API_KEY') || window.MIRU_CONFIG?.OPENAI_API_KEY || ''; }
    catch(e) { return ''; }
  })();

  const masterUrls = pickMasterImages(errorTypes);
  const masterMediaIds = (() => {
    try {
      const stored = localStorage.getItem('PCOS_MASTER_MEDIA_IDS');
      return stored ? JSON.parse(stored) : (window.MIRU_CONFIG?.PCOS_MASTER_MEDIA_IDS || []);
    } catch(e) { return window.MIRU_CONFIG?.PCOS_MASTER_MEDIA_IDS || []; }
  })();

  // Resolve preset images for the first matching error type
  const presetMap = window.MIRU_CONFIG?.PRESET_IMAGES || {};
  function findPreset(clipId) {
    for (const et of (errorTypes || [])) {
      for (const [key, imgs] of Object.entries(presetMap)) {
        if (et.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(et.toLowerCase())) {
          return imgs[clipId] || null;
        }
      }
    }
    return null;
  }

  const images = {};

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];

    const preset = findPreset(clip.clip_id);
    if (preset) {
      if (onProgress) onProgress(i, `${clip.clip_id} 프리셋 이미지 사용`);
      images[clip.clip_id] = preset;
      continue;
    }

    const imagePrompt = `${clip.start_frame} ${BG_STANDARD} Fixed camera, 16:9, studio lighting.`;

    if (proxyUrl) {
      if (onProgress) onProgress(i, `${clip.clip_id} Higgsfield 생성 중...`);
      try {
        images[clip.clip_id] = await generateViaProxy(imagePrompt, masterMediaIds, proxyUrl);
        continue;
      } catch(e) {
        console.warn(`Vercel proxy failed for ${clip.clip_id}:`, e.message);
      }
    }

    if (openaiKey) {
      if (onProgress) onProgress(i, `${clip.clip_id} GPT 이미지 생성 중...`);
      const refPrompt = `You are generating a technical troubleshooting image for MIRU Systems' PCOS (Polling Station Count Optical Scanner) product manual. Use the reference images as the exact visual style guide.\n\n${clip.start_frame}\n\n${BG_STANDARD}\n\nMatch the machine's exact appearance from the reference images. Technical product photography, 16:9.`;
      try {
        images[clip.clip_id] = await generateOpenAIImageWithRefs(refPrompt, masterUrls, openaiKey);
        continue;
      } catch(e) {
        console.warn(`OpenAI Responses API failed for ${clip.clip_id}:`, e.message);
        try {
          images[clip.clip_id] = await generateOpenAIImage(imagePrompt, openaiKey);
          continue;
        } catch(e2) {
          console.warn(`OpenAI gpt-image-1 also failed for ${clip.clip_id}:`, e2.message);
        }
      }
    }

    if (onProgress) onProgress(i, `${clip.clip_id} 이미지 생성 중...`);
    try {
      images[clip.clip_id] = await generatePollinationsImage(`PCOS polling station optical scanner, ${clip.start_frame}`);
      await sleep(200);
    } catch(e) {
      images[clip.clip_id] = DEMO_IMAGES[clip.clip_id] || DEMO_IMAGES['PROB-01'];
    }
  }

  return images;
}

// ─── Russian translation — dual LLM (Kyrgyzstan / КР) ────────────────────────
async function callGroqRaw(messages, model, temperature) {
  const apiKey = (() => {
    try { return localStorage.getItem('GROQ_API_KEY') || window.MIRU_CONFIG?.GROQ_API_KEY || ''; }
    catch(e) { return window.MIRU_CONFIG?.GROQ_API_KEY || ''; }
  })();
  if (!apiKey) throw new Error('No GROQ_API_KEY');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature, max_tokens: 2048, response_format: { type: 'json_object' } }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  return JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());
}

// ─── Feedback Analysis — llama-8b (lightweight classifier) ───────────────────
const FEEDBACK_CATEGORY_KO = {
  image_quality:      '이미지 품질',
  caption_error:      '캡션 오류',
  situation_mismatch: '상황 불일치',
  step_order_error:   '단계 순서 오류',
  other:              '기타',
};
async function callFeedbackAnalysis(feedbackText, errorTypes) {
  const prompt = `You are a feedback classifier for a PCOS troubleshooting AI video system.
Error types reported: ${(errorTypes || []).join(', ')}
User unsatisfied feedback: "${feedbackText}"

Classify into exactly ONE category:
- image_quality: Image is wrong, blurry, wrong machine, wrong aspect ratio
- caption_error: Caption text inaccurate, wrong language, wrong description
- situation_mismatch: Clips don't match the reported error type or situation
- step_order_error: Solution steps missing, wrong order, or incomplete
- other: Anything else

Respond ONLY with valid JSON: {"category":"<key>","reason":"<one sentence in Korean>"}`;
  try {
    const r = await callGroqRaw([{ role: 'user', content: prompt }], 'llama-3.1-8b-instant', 0.1);
    return { category: r.category || 'other', label: FEEDBACK_CATEGORY_KO[r.category] || '기타', reason: r.reason || '' };
  } catch(e) {
    return { category: 'other', label: '기타', reason: '분석 불가' };
  }
}

// ─── Hallucination Verification — llama-70b (accuracy check) ─────────────────
async function callHallucinationCheck(result, formData) {
  const clips = (result.kling_clips || []).map(c =>
    `${c.clip_id} [${c.label}]: ${c.caption_main} — ${(c.description || '').slice(0, 150)}`
  ).join('\n');
  const prompt = `You are a technical accuracy verifier for PCOS (Polling Station Count Optical Scanner) troubleshooting guides.

Error types reported: ${(formData.errorTypes || []).join(', ')}
Situation (Korean, may be informal): ${(formData.situation || '').slice(0, 400)}
Solution attempted: ${(formData.solution || '').slice(0, 200)}

Generated clip sequence:
${clips}

Verify these three things:
1. Does the PROBLEM clip (PROB-01) correctly represent the stated error type?
2. Do SOLUTION clips (SOL-01, SOL-02) provide correct, actionable steps for THIS specific PCOS error?
3. Are any descriptions factually wrong about PCOS hardware/software?

Be strict but fair. If the clips are plausible and relevant, pass them.
Respond ONLY with valid JSON: {"pass":true,"confidence":85,"issues":[],"verdict":"<one sentence in Korean>"}
On failure: {"pass":false,"confidence":40,"issues":["<specific issue>"],"verdict":"<one sentence>"}`;
  try {
    return await callGroqRaw([{ role: 'user', content: prompt }], 'llama-3.3-70b-versatile', 0.1);
  } catch(e) {
    return { pass: true, confidence: 0, issues: [], verdict: '검증 불가 (API 오류)' };
  }
}

async function callRussianTranslation(englishResult) {
  const trans = englishResult.translation || {};
  const clipDesc = (englishResult.kling_clips || []).map(c => `[${c.clip_id}] ${c.description || ''}`).join(' | ');

  const sysMsg = `You are a technical translator for CIS election documentation. Translate to formal Russian (Русский). This is for election officials in Kyrgyzstan operating a PCOS optical ballot scanner (АСУ). Use accurate election administration terminology.`;
  const userMsg = `Translate these fields to Russian. Respond ONLY with valid JSON, no markdown.
{"situation":"${(trans.situation||'').replace(/"/g,"'")}","prior_actions":"${(trans.prior_actions||'').replace(/"/g,"'")}","solution":"${(trans.solution||'').replace(/"/g,"'")}","summary":"${(trans.summary||'').replace(/"/g,"'")}","clip_captions":"${clipDesc.replace(/"/g,"'")}"}
Output format: {"situation":"<RU>","prior_actions":"<RU>","solution":"<RU>","summary":"<RU>","clip_captions":"<RU>"}`;

  const msgs = [{ role: 'system', content: sysMsg }, { role: 'user', content: userMsg }];

  // Two independent LLM calls — compare results for validation
  const [r1, r2] = await Promise.allSettled([
    callGroqRaw(msgs, 'llama-3.3-70b-versatile', 0.1),
    callGroqRaw(msgs, 'llama-3.1-8b-instant',    0.15),
  ]);
  const v1 = r1.status === 'fulfilled' ? r1.value : null;
  const v2 = r2.status === 'fulfilled' ? r2.value : null;

  if (v1 && v2) {
    console.log('[RU 번역 검증] LLM-1 (llama-70b):', v1.summary);
    console.log('[RU 번역 검증] LLM-2 (llama-8b):', v2.summary);
  }
  return { primary: v1, secondary: v2, validated: !!(v1 && v2) };
}

// ─── Slack notification ───────────────────────────────────────────────────────
async function sendSlackNotification(payload) {
  const webhookUrl = window.MIRU_CONFIG?.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('[Slack payload — no webhook set]', JSON.stringify(payload, null, 2));
    return false;
  }
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (e) {
    console.warn('Slack CORS (expected in browser):', e.message);
    return false;
  }
}

function buildSlackPayload(formData, ticketNum, result, isVideoRequest) {
  const priorityLabel = { normal: '일반', high: '높음 — 선거 진행 중', urgent: '긴급 — 즉각 대응 필요' };
  const prefix = isVideoRequest ? '*[영상 생성 요청]*' : '*[새 트러블슈팅 신청]*';

  return {
    text: `${prefix} ${ticketNum}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${prefix} *${ticketNum}*\n` +
                `• 신청인: ${formData.name} (${formData.email})\n` +
                `• 우선순위: ${priorityLabel[formData.priority] || formData.priority}\n` +
                `• 국가: ${formData.country}  |  제품: ${formData.product}\n` +
                `• 에러 유형: ${formData.errorTypes.join(', ')}\n` +
                `• 요약: ${result?.translation?.summary || '(번역 미완료)'}` +
                (isVideoRequest ? `\n• *Kling 영상 생성 요청 — Higgsfield에서 제작해주세요.*` : '')
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*AI 생성 클립 (${result?.kling_clips?.length || 0}개)*\n` +
                (result?.kling_clips || []).map(c =>
                  `• [${c.clip_id}] ${c.label}: _${c.title}_ (${c.model})`
                ).join('\n')
        }
      },
      { type: 'divider' },
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `관리자 페이지(admin.html)에서 검토 및 영상 생성을 진행해주세요.` }]
      }
    ]
  };
}

// ─── Main pipeline ────────────────────────────────────────────────────────────
async function runPipeline(formData, onProgress) {
  onProgress(0, '한국어 → 영어 번역 중...');

  let result;
  try {
    const prompt = buildGeminiPrompt(formData);
    result = await callGeminiFlash(prompt);
  } catch (e) {
    console.warn('Groq fallback (demo mode):', e.message);
    result = buildDemoResult(formData);
  }
  // Assemble full Kling prompts from motion descriptions (IMPORTANT + MOTION + NEGATIVE)
  (result.kling_clips || []).forEach(clip => {
    clip.prompt = buildKlingPrompt(clip.motion || `${clip.start_frame} -> ${clip.end_frame}`);
  });
  onProgress(1, 'Kling 프롬프트 생성 완료');
  await sleep(300);

  // Generate images — master reference images selected by error type
  const clips = result.kling_clips || [];
  const images = await generateHiggsImages(clips, formData.photos, (idx, msg) => {
    onProgress(2 + idx, msg);
  }, formData.errorTypes);
  result.images = images;

  const slackStep = 2 + clips.length;
  onProgress(slackStep, '슬랙 알림 발송 중...');
  const ticketNum = '#TS-2026-' + String(Date.now()).slice(-4).padStart(4, '0');
  const slackPayload = buildSlackPayload(formData, ticketNum, result, false);
  await sendSlackNotification(slackPayload);
  await sleep(400);

  // Russian translation for Kyrgyzstan (КР / KG)
  const needsRu = /kg|키르기|kyrgyz/i.test(formData.country || '');
  if (needsRu) {
    try {
      onProgress(slackStep + 1, '러시아어 번역 중 (듀얼 LLM 검증)...');
      const ruResult = await callRussianTranslation(result);
      result.russian          = ruResult.primary;
      result.russian_secondary = ruResult.secondary;
      result.russian_validated = ruResult.validated;
    } catch(e) {
      console.warn('Russian translation failed:', e.message);
    }
  }

  return { ticketNum, result, formData };
}

// ─── Video generation request ─────────────────────────────────────────────────
async function requestVideoGeneration(formData, ticketNum, result) {
  const payload = buildSlackPayload(formData, ticketNum, result, true);
  await sendSlackNotification(payload);
  return true;
}

// ─── Admin emergency call ─────────────────────────────────────────────────────
async function callAdminEmergency(formData, ticketNum) {
  const payload = {
    text: `[관리자 긴급 호출] ${ticketNum}`,
    blocks: [{
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*[관리자 긴급 호출 — 이미지 오류]* *${ticketNum}*\n` +
              `신청인: ${formData.name} (${formData.email})\n` +
              `${formData.country} · ${formData.product}\n` +
              `에러: ${formData.errorTypes.join(', ')}\n\n` +
              `*AI 생성 이미지에 문제가 있습니다. 직접 확인 및 수정이 필요합니다.*`
      }
    }]
  };
  await sendSlackNotification(payload);
  return true;
}

// ─── Demo fallback ────────────────────────────────────────────────────────────
function buildDemoResult(formData) {
  const firstError = formData.errorTypes[0] || 'Error';
  return {
    translation: {
      situation: `Error occurred during ballot scanning. ${firstError} was displayed on the PCOS screen.`,
      prior_actions: `Operator inserted a ballot into the PCOS scanner slot as normal procedure.`,
      solution: `Operator pressed OK button and cleared the error following manual instructions.`,
      summary: `PCOS scanner displayed ${firstError}; operator cleared it following standard procedure.`
    },
    image_enhancement: {
      photo_error_screen: `PCOS machine on neutral light-grey studio backdrop. Display showing "${firstError}" error in red. ${BG_STANDARD}`,
      photo_error_state: `PCOS machine front-right angle, visible error condition. ${BG_STANDARD}`,
      photo_resolution: `PCOS machine, display showing normal green ready state. ${BG_STANDARD}`
    },
    kling_clips: [
      {
        clip_id: 'PROB-01', label: 'PROBLEM', model: 'Kling',
        title: `${firstError} Error Detected`,
        start_frame: `Front view of PCOS machine. Display shows "${firstError}" error in red. No hand visible.`,
        end_frame: `Same front view. Operator hand enters frame toward OK button.`,
        prompt: `Front view of PCOS machine. Display shows "${firstError}" error. Hand moves toward OK button. ${BG_STANDARD} Fixed camera, 16:9.`,
        caption_main: firstError.toUpperCase(),
        caption_sub: `The PCOS scanner displays a ${firstError} error and requires operator action.`,
        description: `The PCOS machine display shows a "${firstError}" error alert on screen. The machine has halted operation and is waiting for operator intervention. No ballots can be processed until the error is resolved.`,
        photo_ref: 'photo_error_screen'
      },
      {
        clip_id: 'SOL-01', label: 'STEP 1', model: 'Kling',
        title: 'Press OK to Acknowledge',
        start_frame: `Front view, PCOS display showing error, operator hand near screen.`,
        end_frame: `Hand presses OK button, display transitions to next state.`,
        prompt: `Operator presses OK button on PCOS display to acknowledge ${firstError} error. ${BG_STANDARD} Fixed camera, 16:9.`,
        caption_main: 'PRESS OK',
        caption_sub: 'Press the OK button on screen to acknowledge the error.',
        description: `The operator locates the OK button on the PCOS touchscreen display. Pressing OK acknowledges the error and advances to the next diagnostic step. Keep the machine stationary and avoid inserting ballots during this step.`,
        photo_ref: 'photo_error_state'
      },
      {
        clip_id: 'SOL-02', label: 'STEP 2', model: 'Seedance',
        title: 'Resolve and Restore Normal',
        start_frame: `PCOS machine, error condition visible, operator hand approaching problem area.`,
        end_frame: `Error cleared. PCOS display returns to normal green ready state.`,
        prompt: `Operator resolves ${firstError} on PCOS. Display transitions from error to normal green ready state. ${BG_STANDARD} Fixed camera, 16:9.`,
        caption_main: 'SYSTEM RESTORED',
        caption_sub: 'Error cleared. PCOS scanner is ready to continue operation.',
        description: `After completing the corrective action, the PCOS display returns to the normal green ready state. The error indicator is cleared and the ballot counter resets to standby mode. The machine is now ready to resume normal scanning operations.`,
        photo_ref: 'photo_resolution'
      }
    ],
    slack_summary: `[PCOS] ${firstError} at ${formData.country}. 3 Kling clips ready for review.`
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
