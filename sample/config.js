// MIRU AI Troubleshooting System — API Configuration
// Fill in your API keys below before use.
window.MIRU_CONFIG = {
  // Groq API: https://console.groq.com — Free tier, no billing required
  GROQ_API_KEY: '',  // set locally — leave blank for GitHub Pages (demo mode)

  // Slack: Apps > Incoming Webhooks > Add New Webhook
  SLACK_WEBHOOK_URL: '',

  // Higgsfield REST API key (same account as MCP)
  HIGGSFIELD_API_KEY: '',  // set locally — leave blank for GitHub Pages (demo mode)

  // Default troubleshooting manual context (inject into Groq if PCOS_MANUAL_CONTEXT not in localStorage)
  // Paste the full manual text in admin.html > PCOS 마스터 설정 > 트러블슈팅 메뉴얼 to override.
  // Source: PCOS 에러상황조치매뉴얼_V1.0_KGZ — Korean summary (pcos_error_manual_ko.html)
  PCOS_DEFAULT_MANUAL: `PCOS (АСУ — Automated Counting System / Polling Station Count Optical Scanner)
Troubleshooting Manual — Kyrgyz Republic Central Election Commission (ЦИК), V1.0

=== ERROR 1: UIK (УШК) NUMBER MISMATCH ===
Screen message: "ЭСКЕРТҮҮ! / УШК номери дал келбейт." (WARNING! UIK number does not match.) — Button: ЖОККО ЧЫГАРУУ (Cancel)
Cause A: UIK number entered incorrectly during boot-up admin menu (the number must be entered twice).
  Resolution: Re-enter the correct UIK number.
Cause B: PCOS was rebooted after polls opened (before closing), and a different UIK number was entered than at initial startup.
  Resolution 1: Check the printed receipt (check slip) from the opening procedure — enter the UIK number shown there.
  Resolution 2: If the slip cannot be found, send the 'DB' folder (inside the 'PCOS' folder on the flash card) to the Central Election Commission (ЦИК/БШК) to confirm the correct UIK number.

=== ERROR 2: FLASH CARD AND SD CARD DATA MISMATCH ===
Screen message: "ЭСКЕРТҮҮ! / USB жана SD картадагы мазмундар ар башка." (WARNING! The contents of the USB and SD card are different.) — Button: ЖОККО ЧЫГАРУУ (Cancel)
Cause: After re-entering the UIK number to access the admin menu, the SD card or flash card from a different PCOS machine was used.
  Resolution 1: Delete the 'PCOS' folder on the flash card and retry. (Apply to BOTH flash cards.)
  Resolution 2: The two cards (primary / backup) must always be used together as a matched set.

=== ERROR 3: ECF DATA ERROR (ECF NOT FOUND) ===
Screen message: "ЭСКЕРТҮҮ! / Орнотууларды жүктөө мүмкүн болгон жок.. ECF NOT FOUND" (WARNING! Could not load settings. ECF not found.) — Button: ЖОККО ЧЫГАРУУ (Cancel)
Cause: A UIK number that does not exist in the database was entered.
  Resolution: Enter the correct UIK number that matches the database.

=== HARDWARE ERROR: BALLOT STACKER JAM (미분류 투표지 후방 배출 — 가장 흔한 오류) ===
Symptom: Ballot exits to the rear stacker (back output tray) without being counted. The machine does NOT always show an on-screen error — the ballot simply goes to the wrong output tray. Caused by mechanical aging/wear of scanner rollers or classification mechanism; aged machines cannot reliably classify ballots.
Resolution:
  Step 1: Announce to voters that scanning is temporarily paused.
  Step 2: Open the front transparent scanner cover by pulling the cover release latch upward.
  Step 3: Carefully remove the jammed or misrouted ballot from the paper path or rear stacker slot — do NOT tear it.
  Step 4: Inspect the ballot. If undamaged, re-insert it into the scanner input slot. If the ballot is crumpled or torn, set it aside for manual counting at end of day.
  Step 5: Close the cover firmly until it clicks. Resume normal scanning.
  Repeat issues: If this error repeats frequently (more than 3 times per hour), report to the technical team — the rollers may need replacement.

=== CRITICAL OPERATING RULES (유의 사항) ===
1. CARD PAIRING: Once a new SD card and flash card have been used in a PCOS machine (i.e., UIK number has been entered and admin menu accessed), those cards must NEVER be mixed with SD/flash cards from another PCOS machine — under any circumstances. Always use them as a matched set.
   Exception: If a card becomes defective (불량/브락), replace it with a new card.

2. POST-TEST RESET: After completing any test or drill, the machine must be fully reset/initialized (complete wipe — "толук тазалоо керек").

3. ECF VERSION: Always use the latest ECF file. Verify the ECF filename displayed at the top of the PCOS standby screen matches the filename on the latest ECF you received. (Filename format changes by version — example: ecf_11158_...tar.gz)

=== VISUAL REFERENCE ===
- Standby screen top: shows ECF filename (e.g., ecf_11158_...tar.gz) and prompt "Смарт-картаны салыңыз." (Insert smart card.)
- All error screens show yellow warning box with Kyrgyz text and a Cancel (ЖОККО ЧЫГАРУУ) button.`,

  // Pre-generated 16:9 images for all 13 PCOS error types (39 total)
  // ALL images: gpt_image_2 1k medium, generated 2026-07-02 with exact reference images.
  // Keys match ERROR_MASTER_MAP in pipeline.js.
  PRESET_IMAGES: {
    'Ballot Stacker Jam': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233151_97408ab2-8d1a-4456-b634-bec9efd84ab3.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233156_3debddeb-bddf-4aa2-a3c3-19f50efacfef.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233200_f6c2bd83-ee30-4683-a81e-e3809793224f.png',
    },
    'Paper Jam': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233528_a2afa299-d4c1-49b4-a0cd-3cd53a92d0b7.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233204_4d5912e8-03f2-4739-a1a4-be3dd873c62a.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233207_96fb37f8-cd20-4941-8b27-e3c6da61abdd.png',
    },
    'UIK Mismatch': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233524_43c7d60d-9321-48d3-98ec-60a719adb715.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232107_a619be8e-1c2a-480c-909d-701ce75d7112.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232110_1a36aa0a-7876-403e-b01a-46b610aa57b8.png',
    },
    'Flash Card Mismatch': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232114_1d406011-5520-4982-94f0-b4e850834eab.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232120_880995f3-3e46-4cca-9747-74889704542f.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232124_717c44f5-21b4-4bb0-8a6a-696c3343e2a9.png',
    },
    'ECF NOT FOUND': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232128_dbe6c3e5-8b3f-4904-b483-41237ac9a644.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232131_fc1b218b-d0f1-4b90-aba4-63c96297b557.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232134_d674edb8-5ac7-4e44-b33b-c01956ee3ce3.png',
    },
    'Double Feed': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232518_35fe7336-1a3f-4b74-ab1b-5d2594625ec7.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232622_7f2a08b6-e120-4c45-b2a3-b85511d72052.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232525_c1fffaa6-9c54-461a-8ddb-525994c8ea34.png',
    },
    'Scanner Cover Open': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232626_fecafe53-aa11-4d2c-b50f-63bf6fb9c892.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233534_65130ba9-e85b-4d60-8210-0f24cfffbcc8.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232631_a5432c06-c1b5-4021-b119-0e71f54eba6b.png',
    },
    'Stain on Glass': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232635_62e80ee3-c34a-4b01-9d73-0bf2e9ffc516.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232640_9142bdb9-f1f9-43a4-8fea-d8c04d97f18c.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232544_5e4392ac-cb8c-405e-b6ce-c00aa7654ac3.png',
    },
    'Network Disconnect': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232848_a46ea9b7-32aa-43ed-87c6-926c06a0a210.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232853_1790df67-9030-42fd-aa44-18bafd3d80d5.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232856_e5f13615-96b7-48b1-99e1-9a96af80675d.png',
    },
    'Battery Low': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232900_e8749fb7-6056-4de5-bb45-24fe12e09be5.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232903_3d53fb71-5721-4706-a40f-dd495e60fb77.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_232906_d3c0a13b-7470-4b63-b89c-94e02245891f.png',
    },
    'SD Card Error': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233025_b1a36bf4-51a3-446e-8fb0-9aab6b3c6335.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233029_d33c692f-b9f5-4d70-a66f-56eda2fff97e.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233034_970d5b0d-3970-44c5-9d78-b017274ed025.png',
    },
    'Smart Card Error': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233039_d65b6e08-bbe3-4980-9b42-8fca229b4e03.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233042_07d579aa-f8a5-4cbd-ae13-94b7cf5b833a.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_233047_e77eae24-f420-4c81-9da8-f985337fe029.png',
    },
    'Unclassified Ballot': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260702_001256_92cac100-4e5c-4769-ba87-716c12724a98.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260702_001300_7a1ff272-0254-413d-a2e3-bebd5044cb9d.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260702_001304_981285e0-458a-4f90-838b-a94c1cde2aa8.png',
    },
  },

  // PCOS master reference images — pre-uploaded to Higgsfield (14 background-removed shots)
  // IMG_9849~9868, uploaded 2026-06-30. Used as reference_elements in all image generations.
  PCOS_MASTER_MEDIA_IDS: [
    'c40c3a1f-2414-4031-850b-f0833eb1d357', // IMG_9849 — front, closed
    'a2967d45-0fcc-462e-a2fc-b622020fa607', // IMG_9850 — 3/4 angle, cover open
    'b0dc06cc-b87c-43df-a412-7437b5867722', // IMG_9851
    'a2a915e8-1ca5-4402-b393-fb1c773e059b', // IMG_9852 — cover open, scanner slot visible
    'bfdd5c42-a3bd-4bb0-96bb-ffa4165145c8', // IMG_9853
    'e1260d29-ae0f-4a9a-a913-ad3da3d82761', // IMG_9854
    '518f5873-4c7f-4c19-8c36-cad5f7eac801', // IMG_9855
    'af4446db-1626-457d-b0fa-6df47e8e60be', // IMG_9856 — top-down view, mechanism
    '7531d52c-b0df-47e5-9a7a-3b0aa353f01e', // IMG_9857
    '64ada5ff-bff5-4375-a518-9d57540fb8e9', // IMG_9860 — top-down, roller assembly
    'f53fe257-bf29-448c-9261-d14b1de3fb76', // IMG_9861
    '23c6245a-acb2-498a-81cb-5535e7500744', // IMG_9862 — silver-panel model
    'fe5a61f7-f4e6-4a90-9bb3-ce41e99adbd4', // IMG_9863 — silver model 3/4
    'afbe4ecd-b0fc-4207-8cd2-e8ede2b7cb8d', // IMG_9868 — silver model side
  ],
};
