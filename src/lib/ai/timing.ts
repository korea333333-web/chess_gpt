import type { ComputerDifficulty } from "./stockfish";

const computerMoveDelayMs: Record<ComputerDifficulty, number> = {
  beginner: 950,
  intermediate: 1350,
  advanced: 1750
};

export function getComputerMoveDelay(difficulty: ComputerDifficulty) {
  return computerMoveDelayMs[difficulty];
}
