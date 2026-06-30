# MIRU AI 트러블슈팅 영상 자동화 시스템

> **MIRU SYSTEMS** — AI 기반 선거 장비 트러블슈팅 영상 자동 생성 시스템 기획안 및 프로토타입

## 개요

임직원이 웹 폼에 트러블슈팅 정보를 입력하면, AI가 자동으로 3~5초 가이드 영상을 생성하고 담당자에게 Slack 알림을 보냅니다. 담당자는 관리자 페이지에서 검토 후 해당 직원에게 이메일로 발송합니다.

## 파일 구조

```
├── MIRU_AI_트러블슈팅_기획안_2026.html   # 기획안 (4섹션 구성)
├── sample/
│   ├── submit.html                        # 직원 트러블슈팅 신청 폼 (프로토타입)
│   └── admin.html                         # 관리자 검토 대시보드 (프로토타입)
├── Troubleshooting 예시/                  # 기존 ACM 트러블슈팅 영상 제작 자료
│   ├── ACM_Admin_B_Scanner_Prompts.md
│   ├── Admin_B_Scanner_Canva_Script.md
│   ├── _ADMINB_VIDEO_MANIFEST.md
│   └── _IMAGE_CLASSIFICATION.md
├── brand_save.py                          # MIRU 브랜드 컬러/차트 테마
└── MIRU_출장관리_기획안_2026_예시.html   # 기획안 디자인 레퍼런스
```

## 시스템 플로우

```
직원 웹폼 입력 (기계·에러·사진)
    ↓
Gemini Flash API — 프롬프트 자동 생성 (무료)
    ↓
Higgsfield API — 영상/이미지 자동 생성
    ↓
Slack Webhook — 담당자 즉시 알림 (무료)
    ↓
관리자 페이지 — 검토 / 재생성 / 승인
    ↓
Gmail API — 직원 이메일 자동 발송 (무료)
```

## 기술 스택

| 구성 요소 | 기술 | 비용 |
|-----------|------|------|
| 웹 폼 + 관리자 페이지 | HTML / CSS / JS | 무료 |
| LLM 프롬프트 생성 | Gemini 1.5 Flash API | 무료 티어 |
| 영상/이미지 생성 | Higgsfield API | 기존 크레딧 활용 |
| 알림 | Slack Incoming Webhook | 무료 |
| 이메일 발송 | Gmail API (Google Workspace) | 무료 |

## 실행 방법

별도 서버 설정 없이 HTML 파일을 브라우저에서 직접 열면 됩니다.

1. `MIRU_AI_트러블슈팅_기획안_2026.html` — 기획안 전체 보기
2. `sample/submit.html` — 직원 신청 폼 프로토타입
3. `sample/admin.html` — 관리자 대시보드 프로토타입

## 작성 정보

- **작성인**: 김별하
- **보고 대상**: AI 경진대회
- **작성일**: 2026년 06월
- **회사**: MIRU SYSTEMS CO., LTD.
