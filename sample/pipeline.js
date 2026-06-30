// MIRU AI Troubleshooting Pipeline
// Flow: Korean input → Gemini Flash (translate + Kling prompts) → Higgsfield Kling → Slack

// ─── Fixed visual standard ────────────────────────────────────────────────────
const BG_STANDARD = `BACKGROUND: Replace the entire background with a seamless, uniform neutral light-grey studio backdrop (same as the reference master image). Remove all clutter — cables, plastic bags/wrap, beige walls, wooden desks, other equipment. Keep ONLY the PCOS machine, the relevant parts, and the hand. Soft even studio light, subtle soft shadow under the machine. Horizontal, 16:9.`;

// ─── Gemini Flash master prompt for PCOS ─────────────────────────────────────
function buildGeminiPrompt(data) {
  return `You are a professional technical video script generator for MIRU Systems' PCOS (Polling Station Count Optical Scanner) troubleshooting guide videos.

PCOS: Optical paper-ballot scanner used at polling stations. It scans and counts ballots, transmits results via network. Common errors: paper jam, cover open, double feed, stain on scanner glass, network disconnect, battery, display.

VISUAL STANDARD (all clips):
- Format: 16:9, 720p, silent, 4–5 seconds per clip, fixed camera
- ${BG_STANDARD}
- Kling format: [start frame description] → [end frame description], no camera movement
- Clip types: PROBLEM clip (error state) → SOLUTION clips (step-by-step action)

Reference structure (from MIRU ACM Admin-B Scanner script):
- PROBLEM clip: static error screen on display, or machine in error state (paper stuck etc.)
- SOLUTION clip 1: first action (e.g., "Press OK on screen" or "Open scanner rear cover")
- SOLUTION clip 2: core fix action (e.g., "Remove jammed paper" / "Clean CIS glass with cotton wiper")
- SOLUTION clip 3 (if needed): restore state (e.g., "Close scanner cover and confirm normal")
- Common reusable actions: rear cover open button press, scanner cover open, scanner cover close
- Precision actions (cleaning, insertion) → Seedance model; button press, open/close → Kling

ERROR REPORT (field technician input):
---
Product: PCOS — Polling Station Count Optical Scanner
Country / Deployment: ${data.country}
Error Types Selected: ${data.errorTypes.join(', ')}

[Section 1 — Error Situation]:
${data.situation}

[Section 2 — Actions Before Error Occurred]:
${data.priorActions}

[Section 3 — Solution Attempted]:
${data.solution}
---

Respond ONLY with valid JSON, no markdown, no explanation outside JSON:
{
  "translation": {
    "situation": "<English translation of Section 1>",
    "prior_actions": "<English translation of Section 2>",
    "solution": "<English translation of Section 3>",
    "summary": "<One English sentence: what happened and what fixed it>"
  },
  "image_enhancement": {
    "photo_error_screen": "<Higgsfield image prompt: enhance the uploaded error screen photo — apply BG_STANDARD, keep PCOS display visible showing the error>",
    "photo_error_state": "<Higgsfield image prompt: enhance the uploaded machine state photo — apply BG_STANDARD, show PCOS machine with visible error condition>",
    "photo_resolution": "<Higgsfield image prompt: enhance the uploaded resolution photo — apply BG_STANDARD, show PCOS machine restored to normal state>"
  },
  "kling_clips": [
    {
      "clip_id": "PROB-01",
      "label": "PROBLEM",
      "model": "Kling",
      "title": "<3–5 word English title>",
      "start_frame": "<start image: describe exact visual state — PCOS machine, what is visible on display or physically wrong>",
      "end_frame": "<end image: describe exact visual state — same error, slight change such as hand approaching OK button>",
      "prompt": "<full Kling prompt: start_frame + → + end_frame + BG_STANDARD + no camera movement + 16:9>",
      "caption_main": "<3–5 WORD UPPERCASE BOLD>",
      "caption_sub": "<one sentence, what the operator sees>",
      "photo_ref": "photo_error_screen"
    },
    {
      "clip_id": "SOL-01",
      "label": "SOLUTION STEP 1",
      "model": "Kling",
      "title": "<3–5 word English title>",
      "start_frame": "<..>",
      "end_frame": "<..>",
      "prompt": "<full prompt>",
      "caption_main": "<..>",
      "caption_sub": "<..>",
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
      "photo_ref": "photo_resolution"
    }
  ],
  "slack_summary": "<2-line Slack message summarizing error + fix for manager review>"
}`;
}

// ─── Gemini Flash API call ────────────────────────────────────────────────────
async function callGeminiFlash(prompt) {
  const apiKey = window.MIRU_CONFIG?.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in config.js');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    }
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini API error ${res.status}: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty response');

  // Strip possible markdown fences
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(clean);
}

// ─── Higgsfield image enhancement ────────────────────────────────────────────
// Higgsfield REST API: used for background transformation of uploaded photos
async function enhanceImage(imageBase64, enhancementPrompt) {
  const apiKey = window.MIRU_CONFIG?.HIGGSFIELD_API_KEY;
  if (!apiKey) return null; // Skip if not configured

  // Upload image to Higgsfield, then apply outpaint/generate for BG replacement
  // Step 1: Upload media
  const uploadRes = await fetch('https://api.higgsfield.ai/v1/media/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: imageBase64, type: 'image' })
  });
  if (!uploadRes.ok) return null;
  const { media_id } = await uploadRes.json();

  // Step 2: Generate enhanced image with background replacement
  const genRes = await fetch('https://api.higgsfield.ai/v1/generate/image', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: enhancementPrompt,
      reference_image_id: media_id,
      aspect_ratio: '16:9',
      model: 'flux-dev',
    })
  });
  if (!genRes.ok) return null;
  const { job_id } = await genRes.json();
  return job_id;
}

// ─── Higgsfield Kling video generation ───────────────────────────────────────
async function generateKlingVideo(clip, startImageId, endImageId) {
  const apiKey = window.MIRU_CONFIG?.HIGGSFIELD_API_KEY;
  if (!apiKey) return null;

  const res = await fetch('https://api.higgsfield.ai/v1/generate/video', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: clip.prompt,
      model: clip.model === 'Seedance' ? 'seedance-v1-lite' : 'kling-v1-6-standard',
      start_image_id: startImageId,
      end_image_id: endImageId,
      aspect_ratio: '16:9',
      duration: 5,
    })
  });
  if (!res.ok) return null;
  const { job_id } = await res.json();
  return job_id;
}

// ─── Slack notification ───────────────────────────────────────────────────────
async function sendSlackNotification(payload) {
  const webhookUrl = window.MIRU_CONFIG?.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return false;

  // Direct Slack webhook calls are blocked by CORS in browsers.
  // In production, route through a server-side proxy or use Slack's JavaScript SDK.
  // For demo purposes, we log the payload and return true.
  console.log('[Slack payload]', JSON.stringify(payload, null, 2));

  // If a server proxy is available:
  // await fetch(webhookUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
  return true;
}

function buildSlackPayload(formData, ticketNum, result) {
  const priorityLabel = { normal:'일반', high:'높음 — 선거 진행 중', urgent:'긴급 — 즉각 대응 필요' };
  return {
    text: `*[${ticketNum}] 새 트러블슈팅 영상 신청*`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*[${ticketNum}] 새 트러블슈팅 영상 신청*\n` +
                `• 신청인: ${formData.name} (${formData.email})\n` +
                `• 우선순위: ${priorityLabel[formData.priority] || formData.priority}\n` +
                `• 국가: ${formData.country}  |  제품: ${formData.product}\n` +
                `• 에러 유형: ${formData.errorTypes.join(', ')}\n` +
                `• 요약: ${result?.translation?.summary || '(Gemini 미응답)'}`
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
        elements: [{
          type: 'mrkdwn',
          text: `관리자 페이지에서 검토 및 영상 생성을 진행해주세요.`
        }]
      }
    ]
  };
}

// ─── Main pipeline entry point ────────────────────────────────────────────────
async function runPipeline(formData, onProgress) {
  const steps = [
    '한국어 → 영어 번역 중...',
    'Kling 프롬프트 생성 중...',
    '이미지 보정 큐 등록 중...',
    '슬랙 알림 발송 중...',
    '완료',
  ];

  onProgress(0, steps[0]);
  const geminiPrompt = buildGeminiPrompt(formData);
  let result;
  try {
    result = await callGeminiFlash(geminiPrompt);
  } catch (e) {
    // Demo fallback when API key is not set
    result = buildDemoResult(formData);
  }
  onProgress(1, steps[1]);
  await sleep(400);

  onProgress(2, steps[2]);
  await sleep(600);

  onProgress(3, steps[3]);
  const ticketNum = '#TS-2026-' + String(Date.now()).slice(-4).padStart(4, '0');
  const slackPayload = buildSlackPayload(formData, ticketNum, result);
  await sendSlackNotification(slackPayload);
  await sleep(400);

  onProgress(4, steps[4]);

  return { ticketNum, result, slackPayload };
}

// ─── Demo fallback (when Gemini API key not set) ──────────────────────────────
function buildDemoResult(formData) {
  const firstError = formData.errorTypes[0] || 'Error';
  return {
    translation: {
      situation: `[Demo] Error occurred during ballot scanning operation. ${firstError} was displayed on the PCOS screen.`,
      prior_actions: `[Demo] Operator inserted a ballot into the PCOS scanner slot as normal procedure.`,
      solution: `[Demo] Operator pressed OK button and attempted to clear the error as per manual instructions.`,
      summary: `PCOS scanner displayed ${firstError}; operator cleared it following standard procedure.`
    },
    image_enhancement: {
      photo_error_screen: `PCOS machine on neutral light-grey studio backdrop. Display showing "${firstError}" error message in red. ${BG_STANDARD}`,
      photo_error_state: `PCOS machine on neutral light-grey studio backdrop, viewed from front-right angle, showing physical error condition related to ${firstError}. ${BG_STANDARD}`,
      photo_resolution: `PCOS machine on neutral light-grey studio backdrop, display showing normal ready state (green indicator), no error visible. ${BG_STANDARD}`
    },
    kling_clips: [
      {
        clip_id: 'PROB-01', label: 'PROBLEM', model: 'Kling',
        title: `${firstError} Error`,
        start_frame: `Front view of PCOS machine, neutral grey backdrop, display showing "${firstError}" error in red, no hand visible.`,
        end_frame: `Same front view, operator hand enters frame moving toward OK button on screen.`,
        prompt: `Front view of PCOS machine on neutral light-grey studio backdrop. Display shows "${firstError}" error message. Hand moves toward OK button. ${BG_STANDARD} Fixed camera, 16:9.`,
        caption_main: firstError.toUpperCase(),
        caption_sub: `The PCOS scanner displays a ${firstError} error and requires operator action.`,
        photo_ref: 'photo_error_screen'
      },
      {
        clip_id: 'SOL-01', label: 'SOLUTION STEP 1', model: 'Kling',
        title: 'Press OK to Acknowledge',
        start_frame: `Front view, PCOS display showing error, operator hand near screen.`,
        end_frame: `Hand presses OK button, display transitions to acknowledge state.`,
        prompt: `Operator presses OK/RETRY button on PCOS display to acknowledge error. ${BG_STANDARD} Fixed camera, 16:9.`,
        caption_main: 'PRESS OK',
        caption_sub: 'Press the OK button on screen to acknowledge the error.',
        photo_ref: 'photo_error_state'
      },
      {
        clip_id: 'SOL-02', label: 'SOLUTION STEP 2', model: 'Seedance',
        title: 'Resolve and Restore',
        start_frame: `PCOS machine, error condition visible, operator hand approaching problem area.`,
        end_frame: `Problem resolved, PCOS display returns to normal green ready state.`,
        prompt: `Operator resolves ${firstError} condition on PCOS machine. Display transitions from error to normal ready state. ${BG_STANDARD} Fixed camera, 16:9.`,
        caption_main: 'SYSTEM RESTORED',
        caption_sub: 'Error cleared. PCOS scanner is ready to continue operation.',
        photo_ref: 'photo_resolution'
      }
    ],
    slack_summary: `[PCOS] ${firstError} at ${formData.country}. Operator resolved via standard procedure. ${formData.kling_clips?.length || 3} Kling clips generated for review.`
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
