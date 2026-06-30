# Admin-B Scanner 생성 영상 매니페스트 · 720p·16:9·무음

> 갤러리에서 받아 파일명으로 저장. 모션·중요 신은 Seedance(기계 고정).

## 생성한 클립 (1차 — 기계/동작)
| 컷 | 내용 | 모델 | start → end | job id | 저장 파일명 |
|---|---|---|---|---|---|
| OPEN-btn ✅신규 | 뒤쪽 cover-open 버튼 누름 | Kling | back_acm → push_cover_open_button | `4443ada9-30c9-43a8-bc59-8601f0c1530f` | `Video OPEN_button.mp4` |
| OPEN ✅신규 | 스캐너 커버 열림(중간프레임 참조) | Seedance | ballot_not_open →(ACM_opening×2)→ opening_acm | `419ef07c-c13c-45b2-9455-bbe36f3d6d45` | `Video OPEN_cover.mp4` |
| CLOSE ✅신규 | 스캐너 커버 닫힘 | Seedance | opening_acm → ballot_not_open | `3018585c-c70c-46b3-b0e2-e5dc92f325b5` | `Video CLOSE_cover.mp4` |
| ~~B41-open(구)~~ | (대체됨) | Seedance | — | ~~2d3ffdca~~ | 폐기 |
| B41-remove | 걸린 투표지 빼내기 | Seedance | B41_remove_ballot_before → _after | `c0073611-56a7-4f30-8186-40e8dd430e39` | `Video B41_remove.mp4` |
| B42-hinge | 상단 커버 hinge 확인 | Seedance | B42_open_cover_hinge (단일) | `78d6439c-3334-4110-8ec7-02a65892616b` | `Video B42_hinge.mp4` |
| B42-button | 'open cover' 버튼 5회 누름 | Seedance | B42_open_button_before (단일) | `08aeb34d-f77e-462c-9240-3f94ebc6d862` | `Video B42_button.mp4` |
| B45-clean | CIS 글래스 cotton wiper 청소 | Seedance | B45_clean_before → _after | `d4b48265-bb96-4874-9ee1-367b9b93fd62` | `Video B45_clean.mp4` |
| B47-stamp ✅Kling재생성 | 새 스탬프 양옆 잡고 끼움 | Kling | B47_stamp_check → B47_stamp_attach | `10728f3b-bb4a-496b-a0e7-668ef373a1ad` | `Video B47_stamp.mp4` |

## 화면 OK 누름 (Kling, 기계 고정)
| 컷 | 내용 | start → end | job id | 저장 파일명 |
|---|---|---|---|---|
| B41-ok | 잼 화면 OK 누름 | jam_screen → _hand | `8235d1b0-3afb-441c-86f0-5574760b2bb3` | `Video B41_ok.mp4` |
| B42-ok | 스캐너 커버열림 화면 OK 누름 | coveropen_screen → _hand | `3148f322-09ec-4d73-94fa-5bb940067557` | `Video B42_ok.mp4` |
| B43-ok | 더블피드 화면 OK/RETRY | DoubleFeed_screen → _hand | `74a59ae9-7b11-4525-8ce7-5150bf5f42ca` | `Video B43_ok.mp4` |
| B44-ok | 낫파운드 화면 OK/RETRY | NotFound_screen → _hand | `a5ab4ab1-016b-4967-840a-b2ea35df2cde` | `Video B44_ok.mp4` |
| B45-ok | 얼룩 화면 OK/RETRY | stain_screen → _hand | `75fb7546-d400-4501-a399-c0ab654cbb70` | `Video B45_ok.mp4` |
| B46-ok | QR손상 화면 OK/RETRY | ballot_damage_screen → _hand | `734806de-c9de-4dc7-8ae9-d0a71a2aa4e3` | `Video B46_ok.mp4` |
| OPEN-K | (대안) 커버 열림 Kling | ballot_not_open → opening_acm | `0a295c93-2aaf-4af8-8539-2d471d43a4b1` | `Video OPEN_cover_kling.mp4` |
| CLOSE-K | (대안) 커버 닫힘 Kling | opening_acm → ballot_not_open | `04a4f592-55dd-4f32-9ed3-bcf39257eaa4` | `Video CLOSE_cover_kling.mp4` |

## 공통 재사용
- `Video B41_open.mp4`(열기) → §4.5·4.7 열기로 재사용. 닫기는 이 클립 **역재생**(Canva)로 처리.

## 정지 + Canva (생성 X)
- 🔴 문제: `B41_ballot_jam`(걸린 종이), 각 에러 화면(나중에), `B45_stain_sample`, `B46_qr_ballot_bad`.

## 아직 (스틸/처리 대기)
- 에러 화면들(B41~B47 screen): 나중에 업로드 → 화면 RETRY/표시 컷.
- §4.3 Double Feed / §4.4 Not Found: 투표지 단일/올바른 투입(삽입 클립 재사용 가능).
- §4.6 QR Detect: 교체+재투입.
- §5 Camera QR: **이전 영상 재사용·수정**.
- close the ACM: B41-open **역재생**.

## 컷 순서(문제→해결, 잠정)
Intro/Overview → [4.1] jam screen+ballot_jam → B41-open → B41-remove → check → (close=역재생) → [4.2] screen → B42-hinge → B42-button → close → [4.3] screen → single ballot → [4.4] screen → insert → [4.5] screen+sample → B41-open(재사용) → B45-clean → close → [4.6] screen+bad ballot → replace → feed → [4.7] screen → B41-open(재사용) → B47-stamp → close → [5] camera(재사용) → Outro
