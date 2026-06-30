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

=== CRITICAL OPERATING RULES (유의 사항) ===
1. CARD PAIRING: Once a new SD card and flash card have been used in a PCOS machine (i.e., UIK number has been entered and admin menu accessed), those cards must NEVER be mixed with SD/flash cards from another PCOS machine — under any circumstances. Always use them as a matched set.
   Exception: If a card becomes defective (불량/브락), replace it with a new card.

2. POST-TEST RESET: After completing any test or drill, the machine must be fully reset/initialized (complete wipe — "толук тазалоо керек").

3. ECF VERSION: Always use the latest ECF file. Verify the ECF filename displayed at the top of the PCOS standby screen matches the filename on the latest ECF you received. (Filename format changes by version — example: ecf_11158_...tar.gz)

=== VISUAL REFERENCE ===
- Standby screen top: shows ECF filename (e.g., ecf_11158_...tar.gz) and prompt "Смарт-картаны салыңыз." (Insert smart card.)
- All error screens show yellow warning box with Kyrgyz text and a Cancel (ЖОККО ЧЫГАРУУ) button.`,

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
