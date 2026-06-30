# ACM 교육영상 Admin #B — Scanner / Ballot Error Handling

근거: ACM Technical Manual on Admin — §4 Scanner Issue(p.13–21) · §5 Camera Issue/QR(p.22)
구조: 섹션마다 **① PROBLEM(에러 화면/샘플) → ② SOLUTION(조치 단계)**.
표준: Kling start/end(버튼·여닫기) · Seedance(정밀: 청소·삽입·스탬프) · 720p · 16:9 · 무음 · 화면은 실제 캡처 합성.
방침: Maintenance C(스캐너) 클립과 겹치는 동작(스캐너 뒤로 열기·CIS 글래스 청소·볼펜트 삽입·스탬프)은 **재사용 우선**, 신규는 최소화.

> 공통 동작 1회 생성 후 반복 재사용: **A-SCAN-OPEN**(뒤쪽 cover open 버튼 눌러 스캐너 열기) · **A-SCAN-CLOSE**(스캐너 닫기). §4.1·4.5·4.7 공유.

---

## 1. 컷 구성 (문제 → 해결)

### §4.1 Ballot Paper Jam (p.14)
| 블록 | 컷 | 내용 | 방식 | 소스 |
|------|----|------|------|------|
| 🔴문제 | B1-pb | Ballot jam 에러 화면 + 걸린 투표지 | 정지 | `41_jam_error_screen` |
| 🔵해결 | B1-1 | 뒤쪽 cover open 버튼 눌러 스캐너 열기 | Kling [A-SCAN-OPEN] | `41_scanner_back_button`→open |
| | B1-2 | 투표지 제거 | Seedance/Kling | `41_jam_open_remove` |
| | B1-3 | 이물질·종이 debris 없는지 확인 | Kling/정지 | open 내부 |
| | B1-4 | 스캐너 닫기 | Kling [A-SCAN-CLOSE] | — |

### §4.2 Scanner Cover Open (p.15)
| 🔴문제 | B2-pb | Cover open 에러 화면 | 정지 | `42_coveropen_error_screen` |
| 🔵해결 | B2-1 | 상단 커버 hinge 제대로 맞는지 확인 | Kling/정지 | — |
| | B2-2 | "open cover" 버튼 5회 누름 | Kling | 버튼 |
| | B2-3 | 상단 커버 닫고 정상 닫힘 확인 | Kling [A-SCAN-CLOSE] | — |

### §4.3 Ballot Double Feed (p.16)
| 🔴문제 | B3-pb | Double feed 에러 화면 | 정지 | `43_doublefeed_error_screen` |
| 🔵해결 | B3-1 | 투표지가 **한 장**인지 확인 후 재투입 | Kling/정지 | 볼펜트 |

### §4.4 Not Found Ballot (p.17)
| 🔴문제 | B4-pb | Not found ballot 에러 화면 | 정지 | `44_notfound_error_screen` |
| 🔵해결 | B4-1 | **올바른 투표지** 투입 | Kling [볼펜트 삽입 재사용] | — |

### §4.5 Stain In Scanner (p.18–19)
| 🔴문제 | B5-pb | Stain 에러 화면 + 얼룩진 스캔 샘플 | 정지 | `45_stain_error_screen` / `45_stain_sample` |
| 🔵해결 | B5-1 | 뒤쪽 버튼으로 스캐너 열기 | Kling [A-SCAN-OPEN] | `45_scanner_back` |
| | B5-2 | 상·하단 CIS 글래스를 cotton wiper로 청소 | **Seedance** | `45_clean_cis_glass` |
| | B5-3 | 스캐너 닫기 | [A-SCAN-CLOSE] | — |

### §4.6 Detect QR code (p.20)
| 🔴문제 | B6-pb | QR 미검출 에러 화면 + 손상/오염 투표지 | 정지 | `46_qr_error_screen` / `46_qr_ballot_samples` |
| 🔵해결 | B6-1 | 손상·오염 시 새 투표지로 교체 | 정지/Kling | — |
| | B6-2 | 투표지 다시 투입 | Kling [볼펜트 삽입 재사용] | — |

### §4.7 Stamp Issue (p.21)
| 🔴문제 | B7-pb | 'INVALID' 마크 미검출(스탬프 문제) | 정지 | (에러 화면) |
| 🔵해결 | B7-1 | 뒤쪽 버튼으로 스캐너 열기 | [A-SCAN-OPEN] | `47_stamp_open` |
| | B7-2 | 스탬프 부착·손상 여부 확인 | Kling/정지 | — |
| | B7-3 | 없으면 새 스탬프 양옆 잡고 밀어 끼움 | **Seedance** | `47_stamp_attach` |
| | B7-4 | 스캐너 닫기 | [A-SCAN-CLOSE] | — |

### §5 Camera Issue — QR recognition (p.22)
| 🔴문제 | B8-pb | 카메라가 QR 인식 못함(우측 정보 안 뜸) | 정지 | (camera 화면) |
| 🔵해결 | B8-1 | QR을 카메라 화면 **중앙**에 위치 | Kling/정지 | — |
| | B8-2 | 영수증 용지를 **곧게 펴기** | Seedance/Kling | — |

인트로(+Overview 5이슈 카드)·아웃트로 Master. 섹션 카드 Canva.

---

## 2. 재사용 분류
- **Maintenance C(스캐너) 재사용 후보**: A-SCAN-OPEN(뒤쪽 열기) · A-SCAN-CLOSE(닫기) · CIS 글래스 청소 · 볼펜트 삽입 · 스탬프 부착. → Maintenance C 클립 먼저 확인, 겹치면 그대로.
- **정지+Canva**: 모든 에러 화면 + 샘플(얼룩 스캔·손상 QR 투표지) + 비교.
- **신규 Seedance**: CIS 글래스 청소(B5-2), 스탬프 끼움(B7-3) — 정밀 동작.
- **신규 Kling**: 'open cover' 버튼 5회(B2-2), 카메라 QR 위치/영수증 펴기(B8) — 없을 때만.

---

## 3. 영어 자막 (문제 → 해결)
- Intro — ACM Technical Manual on Admin / Part B — Scanner & Ballot Error Handling
- §4.1 문제 — Ballot paper jam / A ballot paper is jammed in the scanner
- §4.1 해결 — Clear it / Push the cover-open button at the back to open the scanner, remove the ballot, clear any debris, then close
- §4.2 문제 — Scanner cover open / The scanner top cover is open
- §4.2 해결 — Close it / Check the top cover hinge, press the "open cover" button 5 times, then close the cover correctly
- §4.3 문제 — Double feed / More than one ballot was fed at once
- §4.3 해결 — Single ballot / Make sure it is a single ballot, then feed it again
- §4.4 문제 — Ballot not found / The ballot could not be read
- §4.4 해결 — Correct ballot / Insert the correct ballot
- §4.5 문제 — Stain in scanner / The scan shows stains/lines from a dirty CIS glass
- §4.5 해결 — Clean it / Open the scanner and clean the top and bottom CIS glass with a cotton wiper
- §4.6 문제 — QR not detected / The QR code on the ballot cannot be read
- §4.6 해결 — Replace & retry / If the ballot is damaged or polluted, replace it, then feed it again
- §4.7 문제 — Stamp issue / The "INVALID" mark is not detected
- §4.7 해결 — Check the stamp / Open the scanner and check the stamp; if missing, pinch both sides and push a new stamp in, then close
- §5 문제 — QR not recognized / The camera does not recognize the QR code (no info on the right)
- §5 해결 — Align it / Place the QR code in the center of the camera view and keep the receipt paper spread straight
- Outro — MIRU SYSTEMS CO., LTD. / We provide an optimized election system for each country

자막: Noto Sans, 하단 좌측, 굵은 MAIN + 가는 SUB, 디졸브 0.3–0.5초.

---

## 4. 다음 단계
1. 매뉴얼 사진(`source_manual_photos/`) AI 보정 → 깨끗한 스틸(16:9, 기계 고정, 화면 로고 제거). 프린터편 프롬프트 동일 적용.
2. Maintenance C 스캐너 클립 확인 → 재사용 분류.
3. 신규(CIS 청소·스탬프·버튼·카메라)만 생성: 정밀=Seedance, 버튼/여닫기=Kling.
4. Canva 스크립트(문제→해결) → 허브 "Scanner / Ballot Error Handling"에 연결.

## 5. 저장 규칙
영상 `Video B5_clean.mp4` 등(섹션코드). 완성본 `Admin Guide B — Scanner.mp4`. 폴더 `Admin Manual/Video B Scanner/`.
