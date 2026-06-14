import type { Square } from "chess.js";
import { ChessRules } from "./rules";
import type { GameSnapshot, MoveInput, MoveResult } from "./types";

export type GameEngine = {
  getSnapshot: () => GameSnapshot;
  getLegalMoves: (square?: Square) => ReturnType<ChessRules["legalMoves"]>;
  move: (input: MoveInput) => MoveResult;
  undo: () => GameSnapshot;
  reset: () => GameSnapshot;
  load: (fen: string) => GameSnapshot;
};

export function createGameEngine(fen?: string): GameEngine {
  const rules = new ChessRules(fen);

  return {
    getSnapshot() {
      return rules.snapshot();
    },
    getLegalMoves(square) {
      return rules.legalMoves(square);
    },
    move(input) {
      try {
        const move = rules.move(input);

        return {
          ok: true,
          move,
          snapshot: rules.snapshot()
        };
      } catch {
        return {
          ok: false,
          error: `Illegal move: ${input.from}-${input.to}`,
          snapshot: rules.snapshot()
        };
      }
    },
    undo() {
      rules.undo();
      return rules.snapshot();
    },
    reset() {
      return rules.reset();
    },
    load(nextFen) {
      return rules.load(nextFen);
    }
  };
}
