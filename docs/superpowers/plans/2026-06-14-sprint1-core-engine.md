# Sprint 1 Core Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Sprint 1 Next.js skeleton and tested chess core engine.

**Architecture:** Keep chess state and rules in framework-independent modules under `src/lib/chess/`. Expose snapshots to the future UI through a small zustand store. Render only a minimal Sprint 1 status page.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, chess.js, zustand, Jest, ts-jest.

---

### Task 1: Project Skeleton

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Add package and config files**

Create scripts for `dev`, `build`, `lint`, and `test`. Configure TypeScript path alias `@/*`.

- [ ] **Step 2: Add minimal App Router page**

Create a static page that describes Sprint 1 status and reads no browser-only APIs.

- [ ] **Step 3: Install dependencies**

Run: `npm.cmd install`
Expected: dependencies installed and `package-lock.json` created.

### Task 2: Failing Engine Tests

**Files:**
- Create: `src/lib/chess/__tests__/engine.test.ts`

- [ ] **Step 1: Write tests for Sprint 1 criteria**

Cover start FEN, legal move application, illegal move rejection, turn tracking, castling, en passant, promotion, checkmate, stalemate, 50-move draw, threefold repetition, PGN, and repeated undo.

- [ ] **Step 2: Run tests before implementation**

Run: `npm test -- --runInBand`
Expected: FAIL because `src/lib/chess/engine` and related modules do not exist yet.

### Task 3: Engine Implementation

**Files:**
- Create: `src/lib/chess/types.ts`
- Create: `src/lib/chess/rules.ts`
- Create: `src/lib/chess/engine.ts`
- Create: `src/lib/store.ts`

- [ ] **Step 1: Implement type definitions**

Define move input, move record, game status, board piece, and snapshot types.

- [ ] **Step 2: Implement chess.js wrapper**

Expose legal move listing, move application, undo, status, FEN, PGN, and board conversion through `ChessRules`.

- [ ] **Step 3: Implement engine state**

Expose `createGameEngine()` with `getSnapshot`, `move`, `undo`, `reset`, and `load`.

- [ ] **Step 4: Implement zustand store**

Expose game snapshot and actions for future UI code.

- [ ] **Step 5: Run tests**

Run: `npm test -- --runInBand`
Expected: PASS.

### Task 4: Verification

**Files:**
- Modify as needed based on verification output.

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: no lint errors.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: build exits with code 0.

- [ ] **Step 3: Run tests again**

Run: `npm test -- --runInBand`
Expected: all tests pass.

- [ ] **Step 4: Commit local changes**

Run: `git init`, `git add .`, `git commit -m "스프린트1 체스 코어 엔진 구현"`
Expected: local commit created. Push requires a configured GitHub remote.
