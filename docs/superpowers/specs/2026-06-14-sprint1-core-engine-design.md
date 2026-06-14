# Sprint 1 Core Engine Design

## Scope

Build only Sprint 1 from `SPRINT_PLAN.md`: a Next.js 14 TypeScript project skeleton plus a tested chess rules and game-state core. 3D rendering, interactive board input, Stockfish AI, and online play remain out of scope for this sprint.

## Architecture

The chess core lives under `src/lib/chess/` and stays independent from React and Three.js. `rules.ts` wraps `chess.js` for legal moves, move application, status checks, PGN, FEN, and undo. `engine.ts` exposes the app-facing game-state API and keeps move records in a UI-friendly shape. `types.ts` defines shared chess types.

The UI layer is intentionally thin. `src/lib/store.ts` provides a zustand store that future UI and 3D components can subscribe to, while `src/app/page.tsx` only shows Sprint 1 status and current state data.

## Data Flow

User-facing code calls engine/store methods with coordinate moves such as `{ from: "e2", to: "e4" }`. The engine delegates validation and state transitions to `chess.js`, then returns immutable snapshots containing FEN, PGN, turn, status, board pieces, legal moves, and history. Future 3D rendering will consume those snapshots instead of implementing chess logic.

## Rules Coverage

Sprint 1 tests verify standard start state, legal and illegal moves, turn tracking, castling, en passant, promotion choices, check, checkmate, stalemate, 50-move draw, threefold repetition, PGN generation, and repeated undo.

## Error Handling

Invalid moves are rejected without mutating state. The engine returns a structured result with `ok: false` and the unchanged snapshot, rather than throwing for ordinary illegal chess moves.

## Testing

Jest runs TypeScript unit tests in `src/lib/chess/__tests__/engine.test.ts`. The tests exercise the public engine/rules APIs and compare key behavior against `chess.js`-backed outcomes. `npm test` must pass before Sprint 1 is considered complete.

## Notes

GitHub remote and Vercel deployment cannot be completed locally unless a remote repository is configured. The project will still be made buildable and testable locally, and `.env` files are ignored.
