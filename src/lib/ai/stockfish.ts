import type { MoveInput, GameSnapshot, LegalMove } from "@/lib/chess/types";

export type ComputerDifficulty = "beginner" | "intermediate" | "advanced";

const pieceValues: Record<string, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 100
};

export function chooseComputerMove(
  snapshot: GameSnapshot,
  difficulty: ComputerDifficulty
): MoveInput | null {
  if (snapshot.status !== "active" || snapshot.legalMoves.length === 0) {
    return null;
  }

  const moves = [...snapshot.legalMoves];

  if (difficulty === "beginner") {
    return toMoveInput(moves[0]);
  }

  moves.sort((a, b) => scoreMove(b, difficulty) - scoreMove(a, difficulty));
  return toMoveInput(moves[0]);
}

function scoreMove(move: LegalMove, difficulty: ComputerDifficulty) {
  const captureScore = move.captured ? pieceValues[move.captured] * 10 : 0;
  const promotionScore = move.promotion ? pieceValues[move.promotion] * 12 : 0;
  const castleScore =
    move.isKingsideCastle || move.isQueensideCastle
      ? difficulty === "advanced"
        ? 2
        : 1
      : 0;
  const centerScore =
    difficulty === "advanced" && ["d4", "d5", "e4", "e5"].includes(move.to)
      ? 1
      : 0;

  return captureScore + promotionScore + castleScore + centerScore;
}

function toMoveInput(move: LegalMove): MoveInput {
  const moveInput: MoveInput = {
    from: move.from,
    to: move.to
  };

  if (move.isPromotion) {
    moveInput.promotion = move.promotion ?? "queen";
  }

  return moveInput;
}
