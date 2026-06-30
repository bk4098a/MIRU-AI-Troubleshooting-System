# Admin Video B (Scanner, Ballot, Camera & USB Error Handling) — Canva 편집 스크립트

> ※ Admin은 2편 구성: **A=Printer**, **B=나머지 전부**(Scanner/Ballot + Camera + Battery + USB). USB·Camera 분량이 적어 B에 통합.
> 구조: 섹션마다 **① 🔴PROBLEM(에러 화면/샘플) → ② 🔵SOLUTION(조치 단계)**.
> 소스: `Admin Manual/Video B Scanner/Video *.mp4` + 정지 스틸.
> 자막: 영어, 자막 전용(오디오 없음). UI 인용은 화면 글자와 일치.
> 근거: ACM Technical Manual on Admin — §4 Scanner(p.13–21) · §5 Camera/QR(p.22) · §6 Battery(p.23) · §7 USB(p.24–27).

## 0. 전역 설정
- 캔버스 1920×1080, 30fps. 컷 사이 **Dissolve 0.3–0.5초**.
- 자막: **Noto Sans**, 좌측 하단. MAIN(Bold ~52px) + SUB(Regular ~34px), 흰색+그림자.
- 섹션 카드: 풀스크린 텍스트 1.5–2초.
- 🔴 "PROBLEM"(빨강) / 🔵 "SOLUTION"(파랑) 태그: 각 블록 시작 0.5초 상단 표시.
- 콜아웃(화살표·동그라미·X/O)은 Canva 도형.
- **공통 클립 재사용**: 열기 = `OPEN_button`+`OPEN_cover` / 닫기 = `CLOSE_cover` (또는 OPEN 역재생). §4.1·4.5·4.7에서 반복.

---

## 1. 샷 리스트 (순서)

### Intro
| # | 소스 | MAIN | SUB |
|---|------|------|-----|
| Intro | Master [Canva] | ACM Technical Manual on Admin | Part B — Scanner, Ballot, Camera & USB Error Handling |
| Overview | [Canva] 아이콘 | Common issues | Jam · Cover open · Double feed · Not found · Stain · QR · Stamp · Camera · Battery · USB |

### §4.1 Ballot Paper Jam (p.14)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 1. Ballot Paper Jam | — | — |
| 🔴 | B1-pb1 | `B41_ballot_jam` [정지] | The problem | A ballot paper is jammed in the scanner | 걸린 종이 강조 |
| | B1-pb2 | `Video B41_ok.mp4`(첫프레임 정지) | On screen | "A ballot paper jam has occurred…" | — |
| 🔵 | B1-ok | `Video B41_ok.mp4` | Acknowledge | Press "OK" on the jam screen | OK 펄스 |
| | B1-open1 | `Video OPEN_button.mp4` | Open the scanner | Push the cover-open button at the back of the ACM | 뒤쪽 버튼 화살표 |
| | B1-open2 | `Video OPEN_cover.mp4` | (이어서) | The scanner cover opens | — |
| | B1-rm | `Video B41_remove.mp4` | Remove the ballot | Remove the jammed ballot paper from the ACM | — |
| | B1-chk | (열린 내부 정지/`B45_clean` 일부) | Check inside | Make sure there is no foreign matter or paper debris | — |
| | B1-close | `Video CLOSE_cover.mp4` | Close the ACM | Close the scanner cover | — |

### §4.2 Scanner Cover Open (p.15)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 2. Scanner Cover Open | — | — |
| 🔴 | B2-pb | `Video B42_ok.mp4`(첫프레임 정지) | The problem | The scanner top cover is open | — |
| 🔵 | B2-ok | `Video B42_ok.mp4` | Acknowledge | Press "OK" on the screen | OK 펄스 |
| | B2-hinge | `Video B42_hinge.mp4` | Check the hinge | Check the top cover hinge is seated correctly | hinge 강조 |
| | B2-btn | `Video B42_button.mp4` | Press 5 times | Press the "open cover" button 5 times | "×5" 라벨 |
| | B2-close | `Video CLOSE_cover.mp4` | Close it | Close the cover and check it is closed correctly | — |

### §4.3 Ballot Double Feed (p.16)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 3. Ballot Double Feed | — | — |
| 🔴 | B3-pb | `B43_doublefeed_screen` [정지] ⏳ | The problem | More than one ballot was fed at once | — |
| 🔵 | B3-sol | 투표지 삽입 [재사용 D3b_ballot] | Single ballot | Make sure it is a single ballot, then feed it again | "1 ballot" 강조 |

### §4.4 Not Found Ballot (p.17)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 4. Ballot Not Found | — | — |
| 🔴 | B4-pb | `B44_notfound_screen` [정지] ⏳ | The problem | The ballot could not be read | — |
| 🔵 | B4-sol | 투표지 삽입 [재사용 D3b_ballot] | Correct ballot | Insert the correct ballot | — |

### §4.5 Stain In Scanner (p.18–19)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 5. Stain In Scanner | — | — |
| 🔴 | B5-pb1 | `B45_stain_sample` [정지] | The problem | Stains/lines appear on the scan from a dirty CIS glass | 줄무늬 강조 |
| | B5-pb2 | `B45_stain_screen` [정지] ⏳ | On screen | Clean the scanner and check the ballot again | — |
| 🔵 | B5-open | `OPEN_button`+`OPEN_cover` [재사용] | Open the scanner | Push the cover-open button at the back | — |
| | B5-clean | `Video B45_clean.mp4` | Clean the glass | Clean the top and bottom CIS glass with a cotton wiper | CIS 강조 |
| | B5-close | `Video CLOSE_cover.mp4` [재사용] | Close it | Close the scanner cover | — |

### §4.6 Detect QR Code (p.20)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 6. QR Code Not Detected | — | — |
| 🔴 | B6-pb1 | `B46_qr_ballot_bad` [정지] | The problem | The QR code cannot be read | 손상/오염 부위 강조 |
| | B6-pb2 | `B46_qr_screen` [정지] ⏳ | On screen | Check the ballot and try again | — |
| 🔵 | B6-rep | 새 투표지 교체 ⏳ | Replace | If the ballot is damaged or polluted, replace it | — |
| | B6-feed | 투표지 삽입 [재사용 D3b_ballot] | Feed again | Feed the ballot into the ACM again | — |

### §4.7 Stamp Issue (p.21)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 7. Stamp Issue | — | — |
| 🔴 | B7-pb | `B47_stamp_screen` [정지] ⏳ | The problem | The "INVALID" mark is not detected | — |
| 🔵 | B7-open | `OPEN_button`+`OPEN_cover` [재사용] | Open the scanner | Push the cover-open button at the back | — |
| | B7-chk | (stamp_check 정지) | Check the stamp | Check the stamp is attached and not damaged | — |
| | B7-attach | `Video B47_stamp.mp4` | Attach a new stamp | Pinch both sides and push the stamp firmly into the ACM | — |
| | B7-close | `Video CLOSE_cover.mp4` [재사용] | Close it | Close the scanner cover | — |

### §5 Camera Issue — QR Recognition (p.22)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 8. Camera — QR Recognition | — | — |
| 🔴 | B8-pb | 이전 카메라 영상(수정) ⏳ | The problem | The camera does not recognize the QR code (no info on the right) | — |
| 🔵 | B8-sol | 이전 카메라 영상(수정) ⏳ | Align it | Place the QR in the center of the camera view and keep the receipt paper spread straight | 중앙 가이드 |

### §6 Battery Issue (p.23)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 9. Battery Issue | — | — |
| 🔴 | B9-pb | 배터리 빨간불 화면/표시 ⏳ | The problem | The battery indicator shows a red light | 빨간불 강조 |
| 🔵 | B9-1 | 케이블 분리 ⏳ | Unplug | First unplug all the cables | — |
| | B9-2 | 배터리 교체/어댑터 사용 ⏳ | Replace | Replace with a new battery, or run the ACM on the power adapter only | — |

### §7 USB Connection Issue (p.24–27)
| 블록 | # | 소스 | MAIN | SUB | 콜아웃 |
|------|---|------|------|-----|--------|
| Card | — | [Canva] | 10. USB Connection Issue | — | — |
| 🔴 | B10-pb | `USB_issue_screen` [정지] | The problem | A USB connection error is shown | — |
| 🔵 | B10-c1 | `USB_port1_insert`/`USB_port12_nohand` | Case 1 — too few | If fewer than 2 USBs are detected, try another port and check the USB is FAT-formatted, then press "RETRY" | — |
| | B10-c2 | (정지/Canva) | Case 2 — too many | If more than 2 USBs are connected, remove the extras, then press "RETRY" | — |
| | B10-c3 | `USB_port1and2_insert` | Case 3 — ports 1 & 2 | Connect the USBs to ports 1 and 2 (if defective, use ports 3 and 4), then press "OK" | Port 1·2 라벨 |
| | B10-c4 | (정지/Canva) | Case 4 — WORMed USB | A WORMed USB can no longer be used — press "SHUTDOWN" and use another USB | — |
| | B10-c5 | `USB_v_insert_hand` | Case 5 — lost connection | Reconnect the USB firmly at the back, wait 3 seconds, then press "RESTART" | — |
| Outro | — | Master [Canva] | MIRU SYSTEMS CO., LTD. | We provide an optimized election system for each country | — |

---

## 2. 자막 전문 (복붙용)
```
Intro     ACM Technical Manual on Admin | Part B — Scanner & Ballot Error Handling
Overview  Common scanner & ballot issues | Jam · Cover open · Double feed · Not found · Stain · QR · Stamp · Camera

— 1. Ballot Paper Jam —
B1-pb   The problem | A ballot paper is jammed in the scanner
B1-ok   Acknowledge | Press "OK" on the jam screen
B1-open Open the scanner | Push the cover-open button at the back of the ACM to open the scanner
B1-rm   Remove the ballot | Remove the jammed ballot paper from the ACM
B1-chk  Check inside | Make sure there is no foreign matter or paper debris
B1-close Close the ACM | Close the scanner cover

— 2. Scanner Cover Open —
B2-pb   The problem | The scanner top cover is open
B2-ok   Acknowledge | Press "OK" on the screen
B2-hinge Check the hinge | Check the top cover hinge is seated correctly
B2-btn  Press 5 times | Press the "open cover" button 5 times
B2-close Close it | Close the cover and check it is closed correctly

— 3. Ballot Double Feed —
B3-pb   The problem | More than one ballot was fed at once
B3-sol  Single ballot | Make sure it is a single ballot, then feed it again

— 4. Ballot Not Found —
B4-pb   The problem | The ballot could not be read
B4-sol  Correct ballot | Insert the correct ballot

— 5. Stain In Scanner —
B5-pb   The problem | Stains or lines appear on the scan from a dirty CIS glass
B5-open Open the scanner | Push the cover-open button at the back
B5-clean Clean the glass | Clean the top and bottom CIS glass with a cotton wiper
B5-close Close it | Close the scanner cover

— 6. QR Code Not Detected —
B6-pb   The problem | The QR code on the ballot cannot be read
B6-rep  Replace | If the ballot is damaged or polluted, replace it
B6-feed Feed again | Feed the ballot into the ACM again

— 7. Stamp Issue —
B7-pb   The problem | The "INVALID" mark is not detected
B7-open Open the scanner | Push the cover-open button at the back
B7-chk  Check the stamp | Check the stamp is attached and not damaged
B7-attach Attach a new stamp | Pinch both sides and push the stamp firmly into the ACM
B7-close Close it | Close the scanner cover

— 8. Camera — QR Recognition —
B8-pb   The problem | The camera does not recognize the QR code (no info on the right)
B8-sol  Align it | Place the QR in the center of the camera view and keep the receipt paper spread straight

— 9. Battery Issue —
B9-pb   The problem | The battery indicator shows a red light
B9-1    Unplug | First unplug all the cables
B9-2    Replace | Replace with a new battery, or run the ACM on the power adapter only

— 10. USB Connection Issue —
B10-pb  The problem | A USB connection error is shown
B10-c1  Case 1 — too few | If fewer than 2 USBs are detected, try another port, check it is FAT-formatted, then press "RETRY"
B10-c2  Case 2 — too many | If more than 2 USBs are connected, remove the extras, then press "RETRY"
B10-c3  Case 3 — ports 1 & 2 | Connect the USBs to ports 1 and 2 (if defective, use ports 3 and 4), then press "OK"
B10-c4  Case 4 — WORMed USB | A WORMed USB can no longer be used — press "SHUTDOWN" and use another USB
B10-c5  Case 5 — lost connection | Reconnect the USB at the back, wait 3 seconds, then press "RESTART"

Outro   MIRU SYSTEMS CO., LTD. | We provide an optimized election system for each country
```

## 3. 콜아웃/오버레이 가이드 (Canva)
- 섹션 시작: 🔴PROBLEM(빨강) → 조치 시작 🔵SOLUTION(파랑) 태그.
- 에러 화면(B1-pb2/B2-pb 등): 해당 OK-누름 클립의 **첫 프레임 1.5초 정지** = 문제 제시.
- 뒤쪽 버튼: ↓화살표. "open cover ×5"는 카운터 텍스트. CIS·stamp·hinge는 강조 원.
- 화면 OK 버튼(B1-ok·B2-ok)은 펄스 강조.

## 4. 컷 순서 (타임라인)
Intro → Overview → [1.Jam] 🔴B1-pb → 🔵B1-ok·OPEN_button·OPEN_cover·B41_remove·check·CLOSE → [2.Cover] 🔴B2-pb → 🔵B2-ok·B42_hinge·B42_button·CLOSE → [3.Double] 🔴B3-pb → 🔵insert → [4.NotFound] 🔴B4-pb → 🔵insert → [5.Stain] 🔴B5-sample·screen → 🔵OPEN(재사용)·B45_clean·CLOSE → [6.QR] 🔴bad ballot·screen → 🔵replace·feed → [7.Stamp] 🔴B7-pb → 🔵OPEN(재사용)·check·B47_stamp·CLOSE → [8.Camera] 🔴/🔵(이전영상) → [9.Battery] 🔴B9-pb → 🔵unplug·replace → [10.USB] 🔴B10-pb → 🔵c1·c2·c3·c4·c5 → Outro

## 5. 메모 / 대기(⏳)
- 열기(OPEN_button+OPEN_cover)·닫기(CLOSE) 클립 = §4.1·4.5·4.7 복제 재사용. 닫기는 OPEN 역재생도 가능.
- ⏳ 아직 필요: 에러 화면 정지컷(double feed·not found·stain·QR·stamp), §4.6 새 투표지 교체 컷, §4.3/4.4/4.6 투표지 삽입(=User Manual D3b_ballot 재사용), §5 카메라 영상(이전 것 수정).
- 열기/닫기는 Seedance vs Kling 중 자연스러운 쪽 선택해 통일.
- export 1080p → 허브 Admin "Scanner / Ballot Error Handling" `watch`에 연결.
