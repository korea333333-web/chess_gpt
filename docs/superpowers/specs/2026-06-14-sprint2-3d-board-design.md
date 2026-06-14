# Sprint 2 3D Board Design

## Scope

Build only Sprint 2 from `SPRINT_PLAN.md`: a visible 3D chess board, bird's-eye camera, basic orbit/zoom controls, and 32 pieces rendered from the Sprint 1 chess snapshot. Gameplay interaction, legal-move highlighting, Stockfish, online play, PBR/HDRI polish, and sound remain out of scope.

## Architecture

The 3D view stays separate from chess rules. `src/lib/board/coordinates.ts` owns square-to-3D coordinate conversion and is covered by Jest tests. `src/components/board/Board3D.tsx` renders board squares and pieces from a `GameSnapshot`. `src/components/board/Piece.tsx` renders identifiable procedural piece silhouettes. `src/components/scene/Camera.tsx` configures a restrained bird's-eye camera with orbit controls, and `Lighting.tsx` adds temporary studio-style lighting.

`src/app/page.tsx` becomes a minimal playable-looking demo shell, but it does not implement moves yet. It creates a Sprint 1 engine snapshot and passes that snapshot into the 3D board.

## Piece Strategy

Sprint documents call for a CC0 GLTF knight. No external asset is added in this sprint because license and source must be verified before inclusion. Instead, all six piece types are procedural placeholders with distinct silhouettes. This keeps the app buildable and license-safe while leaving a clear replacement point for a future GLTF knight.

## Data Flow

`createGameEngine().getSnapshot()` produces board pieces. `Board3D` maps every piece square through `squareToBoardPosition(square)`, then renders `Piece` at that position. The 3D layer never asks chess.js for legal moves and never mutates game state.

## Testing

Jest validates board coordinate mapping: `a1`, `h1`, `a8`, `h8`, center spacing, and square color parity. Full visual validation is done through `npm run build` and local server HTTP checks in this environment.

## Completion Criteria

- 8x8 3D board appears in a bird's-eye view.
- Orbit controls allow drag rotation and wheel zoom with min/max limits.
- Six piece types are visually distinguishable, including a temporary knight.
- 32 pieces are placed from the Sprint 1 starting snapshot.
- Tests, lint, and production build pass.
