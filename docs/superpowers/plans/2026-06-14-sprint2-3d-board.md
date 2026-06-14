# Sprint 2 3D Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the Sprint 1 chess snapshot as a visible 3D board with 32 identifiable pieces.

**Architecture:** Keep coordinate math in `src/lib/board/coordinates.ts`, tested independently. Keep 3D rendering in React Three Fiber components under `src/components/board/` and `src/components/scene/`, with no chess-rule logic in the 3D layer.

**Tech Stack:** Next.js 14, TypeScript, React Three Fiber, drei, three.js, Jest.

---

### Task 1: Install 3D Dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install render dependencies**

Run: `npm.cmd install three @react-three/fiber @react-three/drei`

### Task 2: Coordinate Mapping

**Files:**
- Create: `src/lib/board/coordinates.ts`
- Create: `src/lib/board/__tests__/coordinates.test.ts`

- [ ] **Step 1: Write failing coordinate tests**

Test that `a1`, `h1`, `a8`, and `h8` map to stable 3D positions and that square colors alternate.

- [ ] **Step 2: Run tests to verify RED**

Run: `npm.cmd test -- --runInBand`
Expected: FAIL because `coordinates.ts` does not exist.

- [ ] **Step 3: Implement coordinate helpers**

Create `squareToBoardPosition`, `getSquareColor`, `files`, `ranks`, and `BOARD_SIZE`.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `npm.cmd test -- --runInBand`
Expected: PASS.

### Task 3: 3D Components

**Files:**
- Create: `src/components/board/Board3D.tsx`
- Create: `src/components/board/Piece.tsx`
- Create: `src/components/board/Square.tsx`
- Create: `src/components/scene/Camera.tsx`
- Create: `src/components/scene/Lighting.tsx`

- [ ] **Step 1: Add board square component**

Render flat 3D squares using coordinate helpers.

- [ ] **Step 2: Add procedural pieces**

Render distinct silhouettes for pawn, rook, knight, bishop, queen, and king.

- [ ] **Step 3: Add board component**

Render 64 squares and all pieces from `GameSnapshot.board`.

- [ ] **Step 4: Add camera and lighting**

Use `PerspectiveCamera`, `OrbitControls`, ambient light, directional light, and contact shadows.

### Task 4: Page Integration

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Dynamically load the 3D board**

Use `next/dynamic` with `ssr: false` for the R3F canvas.

- [ ] **Step 2: Render Sprint 2 status UI**

Show current turn, status, FEN, and the 3D board.

### Task 5: Verification and Publish

**Files:**
- Modify as needed based on test/build output.

- [ ] **Step 1: Run tests**

Run: `npm.cmd test -- --runInBand`

- [ ] **Step 2: Run lint**

Run: `npm.cmd run lint`

- [ ] **Step 3: Run production build**

Run: `npm.cmd run build`

- [ ] **Step 4: Verify local HTTP**

Run a dev server and request `http://127.0.0.1:3000`.

- [ ] **Step 5: Commit and push**

Run: `git add .`, `git commit -m "스프린트2 3D 체스판 구현"`, `git push origin main`.
