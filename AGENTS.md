# GAMBIT (갬빗) 프로젝트 컨텍스트

## 프로젝트 개요

GAMBIT은 **거의 실사 같은 3D 클래식 체스 게임 웹앱**이다. 플레이어 기준 버드아이뷰(위에서 약간 비스듬히 내려다보는 입체 시점)로, 클래식 스탠턴 스타일의 섬세한 말을 PBR 재질·HDRI 조명으로 고급스럽게 표현한다.
1단계는 로컬 대전 — **한 화면 2인(핫시트) + 컴퓨터 AI** — 이고, 추후 **온라인 실시간 대전**으로 확장한다. 흔한 평면 체스가 아니라 "멋진 체스를 둔다"는 비주얼 경험에 집중한다.

## 개발 방식

이 프로젝트는 3-Agent Harness 방식으로 개발한다.
- **PLAN.md**: 전체 기획 문서
- **SPRINT_PLAN.md**: 스프린트 계획(개발 순서)
- **TEST_CRITERIA.md**: 스프린트별 완료 기준
- 코드 작성 전 반드시 해당 스프린트의 완료 기준을 확인할 것
- 코드 작성 후 반드시 테스트를 실행하고 통과 여부를 보고할 것

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 3D 렌더링 | React Three Fiber + drei + three.js |
| 체스 규칙 엔진 | chess.js |
| 컴퓨터 AI | Stockfish (WebAssembly) |
| 상태 관리 | zustand (게임 상태와 화면 분리의 "상태") |
| 3D 에셋 | 절차적 생성(lathe) + GLTF(나이트), PBR 재질, HDRI 환경(CC0) |
| 스타일링 | Tailwind CSS |
| 테스트 | jest (규칙 로직 단위 테스트) |
| 백엔드(2단계) | Supabase (Realtime / Auth / DB) |
| 인증(2단계) | 카카오 + 구글 로그인 |
| 버전 관리 | GitHub (프라이빗 리포) |
| 배포 | Vercel (GitHub 연동 자동 배포) |

> 용어 메모 — **R3F(React Three Fiber)**: 리액트 문법으로 3D를 다루는 도구. **PBR**: 빛을 물리적으로 계산해 재질을 사실적으로 표현. **HDRI**: 실제 공간을 담은 조명 이미지로 진짜 같은 반사를 만듦. **WASM**: 무거운 프로그램을 브라우저에서 빠르게 돌리는 기술.

## 개발/배포 파이프라인

```
로컬 개발 → GitHub Push (main) → Vercel 자동 빌드/배포
                                        ↕
                            Supabase (2단계: 온라인 대전)
```

- 결과 확인은 가급적 **GitHub → Vercel 배포본**으로 한다(로컬에만 의존하지 않음).
- main 브랜치 푸시 시 Vercel이 자동 빌드·배포한다.

## 프로젝트 구조

```
체스게임/
├── AGENTS.md
├── PLAN.md
├── SPRINT_PLAN.md
├── TEST_CRITERIA.md
├── src/
│   ├── app/
│   │   ├── page.tsx              # 모드 선택(시작) 화면
│   │   ├── play/page.tsx         # 게임 진행 화면
│   │   └── layout.tsx
│   ├── components/
│   │   ├── board/
│   │   │   ├── Board3D.tsx       # 3D 체스판
│   │   │   ├── Piece.tsx         # 말 컴포넌트
│   │   │   ├── Square.tsx        # 칸(하이라이트 등)
│   │   │   └── pieces/           # 말별 지오메트리/모델
│   │   ├── scene/
│   │   │   ├── Camera.tsx        # 버드아이뷰 카메라
│   │   │   ├── Lighting.tsx      # HDRI 조명
│   │   │   └── Effects.tsx       # 후처리(AO/톤매핑)
│   │   └── ui/
│   │       ├── StatusBar.tsx     # 차례·모드·타이머
│   │       ├── MoveList.tsx      # 기보
│   │       ├── CapturedPieces.tsx# 잡은 말
│   │       └── Controls.tsx      # 새 게임/무르기/항복
│   └── lib/
│       ├── chess/
│       │   ├── engine.ts         # 게임 상태("상태/화면 분리"의 상태)
│       │   ├── rules.ts          # chess.js 래퍼
│       │   └── types.ts
│       ├── ai/
│       │   └── stockfish.ts      # AI 엔진 연동
│       ├── store.ts              # 전역 게임 상태(zustand)
│       └── online/               # 2단계 온라인 대전(현재 비어둠)
├── public/
│   ├── models/                   # GLTF(나이트 등)
│   ├── hdri/                     # 환경 조명 이미지
│   └── sounds/                   # 효과음
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 규칙

1. 한 번에 하나의 스프린트만 진행한다.
2. 테스트 통과 없이 다음 스프린트로 넘어가지 않는다.
3. **게임 로직과 3D 화면을 항상 분리한다.** 화면은 상태를 "보여주기만" 한다(온라인 확장 대비).
4. 체스 규칙은 직접 구현하지 않고 chess.js로 검증한다(정확도 최우선).
5. UI 디자인은 AI 특유의 뻔한 패턴(보라색 그라데이션, 흰 카드)을 피한다 — 고급스럽고 클래식한 비주얼.
6. 에러 발생 시 로그를 직접 읽고 분석한 뒤 수정한다.
7. 한글 파일명·한글 데이터 처리에 주의한다.
8. GitHub에 푸시할 때 환경 변수(.env)가 포함되지 않도록 주의한다.
9. **변경마다 즉시 커밋·푸시한다.** 커밋 메시지는 한글로 구체적으로(무엇을 왜 바꿨는지).
10. 3D 에셋(특히 나이트 GLTF, HDRI)은 라이선스(CC0 등)를 확인하고 출처를 기록한다.

## 명령어

```bash
# 개발
npm run dev          # 로컬 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # 린트 검사
npm test             # jest 테스트 실행

# Git (변경마다 즉시)
git add .
git commit -m "구체적인 한글 메시지"
git push origin main  # → Vercel 자동 배포 트리거

# (2단계) Supabase
npx supabase init
npx supabase db push
```
