// MIRU AI Troubleshooting Pipeline
// Flow: Korean input → Groq (translate + Kling prompts) → Higgsfield images (w/ reference) → Slack

// ─── Fixed visual standard ────────────────────────────────────────────────────
const BG_STANDARD = `BACKGROUND: Replace the entire background with a seamless, uniform neutral light-grey studio backdrop. Remove all clutter — cables, plastic bags/wrap, beige walls, wooden desks, other equipment. Keep ONLY the PCOS machine, the relevant parts, and the hand. Soft even studio light, subtle soft shadow under the machine. Horizontal, 16:9.`;

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

PCOS (АСУ): Optical paper-ballot scanner/counter used at polling stations. Scans and counts ballots, transmits results via network. Uses smart card, flash card (USB), SD card (x2: primary/backup), and ECF configuration file. Key errors: UIK number mismatch (voter station ID error), flash card/SD card data mismatch (mixed paired storage), ECF NOT FOUND (config file missing or wrong UIK in DB), paper jam, scanner cover open, double feed, stain on scanner glass, network disconnect, battery low.
${manualContext ? `\nPCOS TROUBLESHOOTING MANUAL REFERENCE:\n${manualContext.slice(0, 8000)}\n` : ''}
VISUAL STANDARD (all clips):
- Format: 16:9, 720p, silent, 4-5 seconds per clip, fixed camera
- ${BG_STANDARD}
- Kling format: [start frame description] -> [end frame description], no camera movement
- Clip types: PROBLEM clip (error state) -> SOLUTION clips (step-by-step action)

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
---

Respond ONLY with valid JSON, no markdown:
{
  "translation": {
    "situation": "<English translation of Section 1>",
    "prior_actions": "<English translation of Section 2>",
    "solution": "<English translation of Section 3>",
    "summary": "<One English sentence: what happened and what fixed it>"
  },
  "image_enhancement": {
    "photo_error_screen": "<Higgsfield prompt: PCOS display showing error, grey studio backdrop, match reference image style>",
    "photo_error_state": "<Higgsfield prompt: PCOS machine with visible error condition, grey studio>",
    "photo_resolution": "<Higgsfield prompt: PCOS machine normal green ready state, grey studio>"
  },
  "kling_clips": [
    {
      "clip_id": "PROB-01",
      "label": "PROBLEM",
      "model": "Kling",
      "title": "<3-5 word English title>",
      "start_frame": "<describe exact visual state of PCOS machine>",
      "end_frame": "<describe end frame — slight change, e.g. hand approaching OK button>",
      "prompt": "<full Kling prompt: start + -> + end + BG_STANDARD + fixed camera 16:9>",
      "caption_main": "<3-5 WORD UPPERCASE>",
      "caption_sub": "<one sentence, what operator sees>",
      "description": "<2-3 sentences in English. Describe exactly what is shown in this image: the PCOS machine state, what part is highlighted, what the operator should observe. Written for a technical troubleshooting manual.>",
      "photo_ref": "photo_error_screen"
    },
    {
      "clip_id": "SOL-01",
      "label": "SOLUTION STEP 1",
      "model": "Kling",
      "title": "<3-5 word English title>",
      "start_frame": "<..>",
      "end_frame": "<..>",
      "prompt": "<full prompt>",
      "caption_main": "<..>",
      "caption_sub": "<..>",
      "description": "<2-3 sentences English. Describe what the operator is doing in this step: which button, which part, what motion. Clear and precise for the manual.>",
      "photo_ref": "photo_error_state"
    },
    {
      "clip_id": "SOL-02",
      "label": "SOLUTION STEP 2",
      "model": "Seedance",
      "title": "<..>",
      "start_frame": "<..>",
      "end_frame": "<..>",
      "prompt": "<full prompt including BG_STANDARD>",
      "caption_main": "<..>",
      "caption_sub": "<..>",
      "description": "<2-3 sentences English. Describe the resolution shown: what was fixed, what the PCOS displays after the fix, confirmation that system is restored.>",
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

// ─── Higgsfield media upload (browser side) ───────────────────────────────────
// Uploads base64 image to Higgsfield, returns media_id for use as reference_elements
async function uploadPhotoToHiggsfield(base64DataUrl, apiKey) {
  if (!apiKey || !base64DataUrl) return null;

  // Strip data:image/... prefix if present
  const base64 = base64DataUrl.includes(',') ? base64DataUrl.split(',')[1] : base64DataUrl;

  try {
    const res = await fetch('https://api.higgsfield.ai/v1/media/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ data: base64, type: 'image' })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.media_id || data.id || null;
  } catch (e) {
    console.warn('Photo upload to Higgsfield failed:', e.message);
    return null;
  }
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
const PCOS_MASTER_BASE = 'https://bk4098a.github.io/MIRU-AI-Troubleshooting-System/sample/pcos_ref';

const ERROR_MASTER_MAP = {
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

// ─── Pollinations.ai image generation (free, no API key, CORS OK) ────────────
// Used when no Higgsfield API key is configured — generates error-specific images
async function generatePollinationsImage(prompt) {
  const enriched = `${prompt} Professional studio product photography, clean neutral light-grey background, sharp focus, 16:9`;
  const seed = Math.floor(Math.random() * 999999);
  // pollinations.ai returns image directly — usable as img src or preloaded via fetch
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(enriched)}?width=1280&height=720&nologo=true&model=flux&seed=${seed}`;
}

// ─── Image generation orchestrator ────────────────────────────────────────────
// Priority: Higgsfield (reference_elements) > OpenAI (Responses API + master refs) > pollinations.ai
async function generateHiggsImages(clips, photos, onProgress, errorTypes) {
  const higgsfieldKey = window.MIRU_CONFIG?.HIGGSFIELD_API_KEY;
  const openaiKey = (() => {
    try { return localStorage.getItem('OPENAI_API_KEY') || window.MIRU_CONFIG?.OPENAI_API_KEY || ''; }
    catch(e) { return ''; }
  })();
  const apiKey = higgsfieldKey; // Higgsfield path uses this variable below

  // Load admin master media IDs — localStorage first, fallback to config.js hardcoded list
  let masterMediaIds = [];
  try {
    const stored = localStorage.getItem('PCOS_MASTER_MEDIA_IDS');
    masterMediaIds = stored ? JSON.parse(stored) : (window.MIRU_CONFIG?.PCOS_MASTER_MEDIA_IDS || []);
  } catch(e) {
    masterMediaIds = window.MIRU_CONFIG?.PCOS_MASTER_MEDIA_IDS || [];
  }

  // Map clip photo_ref to user-uploaded base64
  const photoMap = {
    photo_error_screen: photos?.error_screen || null,
    photo_error_state:  photos?.error_state  || null,
    photo_resolution:   photos?.resolution   || null,
  };

  // Upload user photos to Higgsfield if API key available
  const uploadedPhotoIds = {};
  if (apiKey && Object.values(photoMap).some(Boolean)) {
    for (const [key, base64] of Object.entries(photoMap)) {
      if (base64) {
        const mediaId = await uploadPhotoToHiggsfield(base64, apiKey);
        if (mediaId) uploadedPhotoIds[key] = mediaId;
      }
    }
  }

  const images = {};

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    if (onProgress) onProgress(i, `${clip.clip_id} 이미지 생성 중...`);

    if (apiKey) {
      try {
        // Build reference_elements: master photos + user photo for this clip
        const referenceElements = [...masterMediaIds];
        const userPhotoId = uploadedPhotoIds[clip.photo_ref];
        if (userPhotoId) referenceElements.push(userPhotoId);

        const imagePrompt = `${clip.start_frame} ${BG_STANDARD} Fixed camera, 16:9, studio lighting.`;
        const jobId = await callHiggsfieldGenerateImage(imagePrompt, referenceElements, apiKey);
        const url = await pollHiggsfieldJob(jobId, apiKey);
        images[clip.clip_id] = url;
      } catch (e) {
        console.warn(`Higgsfield API failed for ${clip.clip_id}:`, e.message);
        images[clip.clip_id] = DEMO_IMAGES[clip.clip_id] || DEMO_IMAGES['PROB-01'];
      }
    } else if (openaiKey) {
      // OpenAI: Responses API (gpt-4o + reference images) → gpt-image-1 → pollinations.ai
      if (onProgress) onProgress(i, `${clip.clip_id} GPT 이미지 생성 중...`);
      const masterUrls = pickMasterImages(errorTypes);
      const imagePrompt = `You are generating a technical troubleshooting image for MIRU Systems' PCOS (Polling Station Count Optical Scanner) product manual. Use the reference images above as the exact visual style and machine appearance guide.\n\n${clip.start_frame}\n\n${BG_STANDARD}\n\nMatch the machine's exact appearance, color, and proportions from the reference images. Technical product photography, 16:9.`;
      try {
        images[clip.clip_id] = await generateOpenAIImageWithRefs(imagePrompt, masterUrls, openaiKey);
      } catch(e) {
        console.warn(`OpenAI Responses API failed for ${clip.clip_id}:`, e.message);
        try {
          const fallbackPrompt = `PCOS polling station optical scanner (ballot counting machine). ${clip.start_frame} ${BG_STANDARD} Technical product photography, 16:9.`;
          images[clip.clip_id] = await generateOpenAIImage(fallbackPrompt, openaiKey);
        } catch(e2) {
          console.warn(`OpenAI gpt-image-1 also failed for ${clip.clip_id}:`, e2.message);
          images[clip.clip_id] = await generatePollinationsImage(`PCOS scanner ${clip.start_frame}`).catch(() => DEMO_IMAGES[clip.clip_id] || DEMO_IMAGES['PROB-01']);
        }
      }
    } else {
      // No API key: pollinations.ai (free, dynamic)
      try {
        const imagePrompt = `PCOS polling station optical scanner, ${clip.start_frame}`;
        images[clip.clip_id] = await generatePollinationsImage(imagePrompt);
        await sleep(200);
      } catch(e) {
        console.warn(`pollinations.ai failed for ${clip.clip_id}:`, e.message);
        images[clip.clip_id] = DEMO_IMAGES[clip.clip_id] || DEMO_IMAGES['PROB-01'];
      }
    }
  }

  return images;
}

async function callHiggsfieldGenerateImage(prompt, referenceElements, apiKey) {
  const body = {
    model: 'nano_banana',
    prompt,
    aspect_ratio: '16:9',
  };
  if (referenceElements && referenceElements.length > 0) {
    body.reference_elements = referenceElements;
  }

  const res = await fetch('https://api.higgsfield.ai/v1/generate/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Higgsfield ${res.status}`);
  const data = await res.json();
  return data.results?.[0]?.id || data.id;
}

async function pollHiggsfieldJob(jobId, apiKey, maxMs = 120000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    await sleep(4000);
    const res = await fetch(`https://api.higgsfield.ai/v1/jobs/${jobId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await res.json();
    if (data.status === 'completed') return data.results?.rawUrl || data.url;
    if (data.status === 'failed') throw new Error('Higgsfield job failed');
  }
  throw new Error('Higgsfield timeout');
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
        clip_id: 'SOL-01', label: 'SOLUTION STEP 1', model: 'Kling',
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
        clip_id: 'SOL-02', label: 'SOLUTION STEP 2', model: 'Seedance',
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
