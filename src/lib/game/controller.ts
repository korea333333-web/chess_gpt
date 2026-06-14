import type { Square } from "chess.js";
import type { GameSnapshot, MoveInput } from "@/lib/chess/types";

export type SquareClickResolution =
  | {
      kind: "select";
      selectedSquare: Square;
      legalTargets: Square[];
    }
  | {
      kind: "move";
      move: MoveInput;
      selectedSquare: null;
      legalTargets: [];
    }
  | {
      kind: "promotion";
      move: Omit<MoveInput, "promotion">;
      selectedSquare: null;
      legalTargets: [];
    }
  | {
      kind: "clear";
      selectedSquare: null;
      legalTargets: [];
    };

export function getSelectableSquares(snapshot: GameSnapshot): Square[] {
  return snapshot.board
    .filter((piece) => piece.color === snapshot.turn)
    .map((piece) => piece.square);
}

export function getLegalTargets(
  snapshot: GameSnapshot,
  selectedSquare: Square | null
): Square[] {
  if (!selectedSquare) {
    return [];
  }

  const selected = snapshot.board.find((piece) => piece.square === selectedSquare);

  if (!selected || selected.color !== snapshot.turn) {
    return [];
  }

  return snapshot.legalMoves
    .filter((move) => move.from === selectedSquare)
    .map((move) => move.to);
}

export function resolveSquareClick(
  snapshot: GameSnapshot,
  selectedSquare: Square | null,
  clickedSquare: Square
): SquareClickResolution {
  if (selectedSquare) {
    const move = snapshot.legalMoves.find(
      (legalMove) =>
        legalMove.from === selectedSquare && legalMove.to === clickedSquare
    );

    if (move) {
      if (move.isPromotion) {
        return {
          kind: "promotion",
          move: {
            from: selectedSquare,
            to: clickedSquare
          },
          selectedSquare: null,
          legalTargets: []
        };
      }

      const moveInput: MoveInput = {
        from: selectedSquare,
        to: clickedSquare
      };

      return {
        kind: "move",
        move: moveInput,
        selectedSquare: null,
        legalTargets: []
      };
    }
  }

  const clickedPiece = snapshot.board.find(
    (piece) => piece.square === clickedSquare && piece.color === snapshot.turn
  );

  if (clickedPiece) {
    return {
      kind: "select",
      selectedSquare: clickedSquare,
      legalTargets: getLegalTargets(snapshot, clickedSquare)
    };
  }

  return {
    kind: "clear",
    selectedSquare: null,
    legalTargets: []
  };
}
