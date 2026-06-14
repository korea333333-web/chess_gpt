# Sprint 3 Playable Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make GAMBIT actually playable with hotseat mode and a legal-move computer opponent.

**Architecture:** Keep chess rules in `src/lib/chess`, interaction decisions in `src/lib/game/controller.ts`, AI selection in `src/lib/ai/stockfish.ts`, session state in `src/lib/store.ts`, and rendering in UI/R3F components.

**Tech Stack:** Next.js 14, TypeScript, Zustand, chess.js, React Three Fiber, Jest.

---

### Task 1: Pure Interaction and AI Tests

**Files:**
- Create: `src/lib/game/__tests__/controller.test.ts`
- Create: `src/lib/ai/__tests__/stockfish.test.ts`

- [ ] **Step 1: Write failing controller tests**

Cover selecting own pieces, exposing legal targets, moving on a legal target, rejecting illegal destinations, and clearing selection after a move.

- [ ] **Step 2: Write failing AI tests**

Cover that each difficulty returns a legal move and intermediate/advanced prefer available captures.

- [ ] **Step 3: Run tests to verify RED**

Run: `npm.cmd test -- --runInBand`

### Task 2: Pure Logic Implementation

**Files:**
- Create: `src/lib/game/controller.ts`
- Create: `src/lib/ai/stockfish.ts`
- Modify: `src/lib/chess/engine.ts`

- [ ] **Step 1: Implement controller helpers**

Expose `getSelectableSquares`, `getLegalTargets`, and `resolveSquareClick`.

- [ ] **Step 2: Implement AI move selection**

Expose `chooseComputerMove(snapshot, difficulty)`.

- [ ] **Step 3: Add engine load/reset support if needed**

Keep all move validation delegated to chess.js.

### Task 3: Store Session State

**Files:**
- Modify: `src/lib/store.ts`

- [ ] **Step 1: Add mode/difficulty state**

Support `hotseat` and `computer`, difficulty `beginner/intermediate/advanced`.

- [ ] **Step 2: Add playable actions**

Support `selectSquare`, `newGame`, `undo`, `resign`, `setMode`, and `setDifficulty`.

- [ ] **Step 3: Trigger AI reply**

After a human move in computer mode, apply a legal AI move after a short delay.

### Task 4: Interactive Board and UI

**Files:**
- Modify: `src/components/board/Board3D.tsx`
- Modify: `src/components/board/Square.tsx`
- Modify: `src/components/board/Piece.tsx`
- Create: `src/components/game/GameScreen.tsx`
- Create: `src/components/ui/StatusBar.tsx`
- Create: `src/components/ui/Controls.tsx`
- Create: `src/components/ui/MoveList.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add square click callbacks and highlights**

Board squares respond to clicks and display selected, legal-target, and last-move states.

- [ ] **Step 2: Add side-panel UI**

Show status, mode controls, difficulty controls, move list, new game, undo, and resign.

- [ ] **Step 3: Connect page to client game screen**

Keep R3F client-only and prevent server component state coupling.

### Task 5: Verification and Publish

**Files:**
- Modify as needed based on verification output.

- [ ] **Step 1: Run tests**

Run: `npm.cmd test -- --runInBand`

- [ ] **Step 2: Run lint**

Run: `npm.cmd run lint`

- [ ] **Step 3: Run build**

Run: `npm.cmd run build`

- [ ] **Step 4: Verify local HTTP**

Run dev server and confirm the app returns HTTP 200 with playable UI text.

- [ ] **Step 5: Commit and push**

Run: `git add .`, `git commit -m "스프린트3 실제 플레이 기능 구현"`, `git push origin main`.
