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

  // Pre-generated 16:9 images for all 11 PCOS error types (33 total, Higgsfield nano_banana)
  // Generated 2026-07-01. Keys match ERROR_MASTER_MAP in pipeline.js.
  // Note: 'Ballot Stacker Jam' images pending generation (use Paper Jam preset as fallback)
  PRESET_IMAGES: {
    'Ballot Stacker Jam': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_063327_d72c4e44-77d0-4d90-b9ed-69314f4c52ca.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_063250_ee2cc82f-e112-4e3c-8ede-46c18d1eafac.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_063253_c4ef95cd-7db8-4d45-ad96-af177012b826.png',
    },
    'Paper Jam': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_021013_2fbf190b-8be2-452d-aafe-e7abaa1edd5c.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_021924_3e6fec02-5d13-48b3-bab0-9efd1bdb28b7.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_021020_416fea42-af1d-4e39-b2d8-d57cbef034f5.png',
    },
    'UIK Mismatch': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_021926_07dbee45-1df0-409e-988c-fa91ee1f465d.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_021933_c3e850c5-70a9-4daa-8dff-382e970d9d22.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_021936_2cc85363-c7b6-43dd-8d93-b6c438a99423.png',
    },
    'Flash Card Mismatch': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_021946_82b349a9-fc66-4043-80d6-cd608b088b0e.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_021949_f6793847-184d-4c5a-8553-24453c678d2d.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_023144_2e57f049-0603-429c-a61b-b28a37c52c5f.png',
    },
    'ECF NOT FOUND': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022015_ab1f284c-0d9e-4a68-9027-ec1a52065c96.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022017_ba7b014f-31a7-42ee-bbd9-c413562eb903.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_023228_14c8bc2f-eaea-4c93-ac18-9940098ab1e0.png',
    },
    'Double Feed': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022047_48222032-b361-478b-a726-d0c9634ebd34.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022050_d05eed39-d294-45f5-a4b8-7c46f9c64461.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_023146_32f6a718-723d-4c8d-b757-d730f5606ae8.png',
    },
    'Scanner Cover Open': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022111_5d5ac6d7-a1a9-4220-8c98-5ac6be73ba39.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022113_fd8d3891-8309-448a-b33f-f75b0c49be2c.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_023135_04f10b44-d98f-4abb-94e0-2fe6d2ebc513.png',
    },
    'Stain on Glass': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022135_aaf41793-ccb9-47b4-a66e-5183366d4a8c.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022138_7907e1ca-57d4-400f-b98f-86968b2a283a.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022259_87c99e7c-9322-44ee-a465-6e2b2b0dec06.png',
    },
    'Network Disconnect': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022145_779538f4-b176-4701-9fe9-bbc4d32570e9.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022148_6589dc2a-d3fe-4fe3-88f9-3a1f11d43ee7.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022151_b9749816-2e9e-45da-882b-02f2bd82670a.png',
    },
    'Battery Low': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022211_f1a38300-0b40-4d7d-94ef-8d3404fe8b95.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022215_f1a23321-446a-4a88-9845-2785baac1832.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022218_d826cfb8-e9f6-4cb3-aadb-3593f57508a1.png',
    },
    'SD Card Error': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022221_5a01604a-e973-48fc-9faf-ea5105479c7d.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022223_cdd85a40-b5ab-4605-9caf-0932115e4923.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022226_879cc5b4-5b66-4482-a03f-cb893b315ab5.png',
    },
    'Smart Card Error': {
      'PROB-01': 'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022228_967fd81c-e892-4750-b847-932ef7e4acd0.png',
      'SOL-01':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022231_4f1b8c9d-e4d6-478a-873c-f15ea9cf4b67.png',
      'SOL-02':  'https://d8j0ntlcm91z4.cloudfront.net/user_3DsNznhr2DWgt5yC0mXipDwfgaa/hf_20260701_022234_ea97ebf0-720a-4723-a0d6-e0da839b5f3a.png',
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
