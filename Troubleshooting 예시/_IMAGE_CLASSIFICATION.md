# Admin-B Scanner — 이미지 분류 (스크린 / OK·RETRY / USB)

## A. 에러 화면 (스크린) — 문제 정지 + OK/RETRY 누름 쌍
각 `*_screen`(🔴문제 정지) + `*_hand`(🔵OK/RETRY 누르는 end) = **Kling OK-누름 클립** 가능.

| 섹션 | screen(문제·정지) | _hand(누름 end) | 상태 |
|---|---|---|---|
| §4.1 Jam | `bllot_paper_jam_issue_screen` | `bllot_paper_jam_issue_screen_hand` | ✅생성됨 (B41-ok) |
| §4.2 Cover Open | `scanner_cover_open_screen` | `scanner_cover_open_screen_hand` | ✅생성됨 (B42-ok) |
| §4.3 Double Feed | `Ballot Double Feed_screen` | `Ballot Double Feed_hand` | ⏳생성 대기 |
| §4.4 Not Found | `Not Found Ballot_screen` | `Not Found Ballot_hand` | ⏳생성 대기 |
| §4.5 Stain | `stain_sacnner_screen` | `stain_sacnner_screen_hand` | ⏳생성 대기 |
| §4.6 QR/Damage | `ballot_damage_screen` | `ballot_damage_screen_hand` | ⏳생성 대기 |
| §5 Camera | `camer_issue_screen` | (단독) | 🔴문제 정지만 |
| §7 USB | `USB_issue_screen` | (단독) | 🔴문제 정지만 (Admin-C용) |

→ ⏳ 4개(4.3·4.4·4.5·4.6)는 screen→_hand로 OK/RETRY 누름 Kling 생성하면 됨.

## B. 기계/동작 클립 (이미 생성/소스 보유)
열기(OPEN_button·OPEN_cover)·닫기(CLOSE)·B41_remove·B45_clean·B47_stamp·B42_hinge·B42_button — 매니페스트 참조.

## C. USB Connection (§7) — 리네이밍 완료 ⚠ Admin-C(System & Connection)용
> UUID → 의미 이름. 뒷면 포트 + USB 꽂는 동작. no-hand=▶start / hand=■end 로 페어링.

### 가로 패널 (LAN + USB-A) — 왼쪽=Port 1, 오른쪽=Port 2
| 파일명 | 내용 | 역할 |
|---|---|---|
| `USB_port12_nohand.png` | 포트 1·2(손 없음) | ▶ |
| `USB_port1_insert.png` | **Port 1(왼쪽)** 삽입 | ■ |
| `USB_port2_insert.png` | **Port 2(오른쪽)** 삽입 | ■ |
| `USB_port1and2_insert.png` | **Port 1·2 동시** 삽입 | ■ |

### 세로(적층) 패널 (전원·빨간버튼 + USB-A 2개 세로)
| 파일명 | 내용 | 역할 |
|---|---|---|
| `USB_v_ports_nohand.png` | 세로 패널 포트, 손 없음 | ▶ |
| `USB_v_ports_nohand2.png` | 세로 패널 포트 2, 손 없음 | ▶ |
| `USB_v_insert_hand.png` | 세로 포트에 삽입 | ■ |
| `USB_v_insert_hand2.png` | 세로 포트(다른 위치)에 삽입 | ■ |

### 탑뷰 개요
| 파일명 | 내용 | 역할 |
|---|---|---|
| `USB_overview_open_a.png` | 스캐너 열고 포트부 전체(탑뷰) | 개요/정지 |
| `USB_overview_open_b.png` | 포트부 전체(탑뷰) 2 | 개요/정지 |
| `USB_overview_inserted.png` | USB 꽂힌 상태(탑뷰) | 개요/정지 |

USB 추천 페어(삽입 모션):
- 가로: `USB_h_ports_nohand` ▶ → `USB_h_insert_left`/`_right`/`_both` ■
- 세로: `USB_v_ports_nohand` ▶ → `USB_v_insert_hand` ■

> ⚠ 확인 필요: 사진에 포트 번호(1·2·3·4)가 안 보입니다. 매뉴얼 §7 Case3 "ports 1 and 2" / "ports 3 and 4"가 **가로 패널 vs 세로 패널** 중 어느 쪽인지(또는 좌=1·우=2 식인지) 알려주시면 이름에 1·2·3·4를 반영하겠습니다.

## 다음
- §4.3·4.4·4.5·4.6 OK/RETRY 누름 4개 Kling 생성? (screen→_hand)
- USB(§7)는 Admin-C에서 위 페어로 삽입 클립 생성 예정.
