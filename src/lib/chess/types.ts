import type {
  Color as ChessJsColor,
  Move as ChessJsMove,
  PieceSymbol,
  Square
} from "chess.js";

export type ChessColor = "white" | "black";

export type PieceType =
  | "pawn"
  | "knight"
  | "bishop"
  | "rook"
  | "queen"
  | "king";

export type PromotionPiece = Exclude<PieceType, "pawn" | "king">;

export type GameStatus = "active" | "checkmate" | "stalemate" | "draw";

export type DrawReason =
  | "fifty-move"
  | "threefold-repetition"
  | "insufficient-material"
  | "general";

export type MoveInput = {
  from: Square;
  to: Square;
  promotion?: PromotionPiece;
};

export type BoardPiece = {
  square: Square;
  type: PieceType;
  color: ChessColor;
};

export type LegalMove = {
  from: Square;
  to: Square;
  san: string;
  lan: string;
  piece: PieceType;
  captured?: PieceType;
  promotion?: PromotionPiece;
  isCapture: boolean;
  isPromotion: boolean;
  isEnPassant: boolean;
  isKingsideCastle: boolean;
  isQueensideCastle: boolean;
};

export type MoveRecord = LegalMove & {
  color: ChessColor;
  before: string;
  after: string;
};

export type GameSnapshot = {
  fen: string;
  pgn: string;
  turn: ChessColor;
  status: GameStatus;
  winner: ChessColor | null;
  drawReason: DrawReason | null;
  inCheck: boolean;
  board: BoardPiece[];
  legalMoves: LegalMove[];
  history: MoveRecord[];
};

export type MoveResult =
  | {
      ok: true;
      move: MoveRecord;
      snapshot: GameSnapshot;
    }
  | {
      ok: false;
      error: string;
      snapshot: GameSnapshot;
    };

export type ChessJsPromotion = Extract<PieceSymbol, "n" | "b" | "r" | "q">;

export function toAppColor(color: ChessJsColor): ChessColor {
  return color === "w" ? "white" : "black";
}

export function toChessJsColor(color: ChessColor): ChessJsColor {
  return color === "white" ? "w" : "b";
}

export function toAppPiece(piece: PieceSymbol): PieceType {
  switch (piece) {
    case "p":
      return "pawn";
    case "n":
      return "knight";
    case "b":
      return "bishop";
    case "r":
      return "rook";
    case "q":
      return "queen";
    case "k":
      return "king";
  }
}

export function toAppPromotionPiece(piece: PieceSymbol): PromotionPiece {
  switch (piece) {
    case "n":
      return "knight";
    case "b":
      return "bishop";
    case "r":
      return "rook";
    case "q":
      return "queen";
    case "p":
    case "k":
      return "queen";
  }
}

export function toChessJsPromotion(piece: PromotionPiece): ChessJsPromotion {
  switch (piece) {
    case "knight":
      return "n";
    case "bishop":
      return "b";
    case "rook":
      return "r";
    case "queen":
      return "q";
  }
}

export function toLegalMove(move: ChessJsMove): LegalMove {
  return {
    from: move.from,
    to: move.to,
    san: move.san,
    lan: move.lan,
    piece: toAppPiece(move.piece),
    captured: move.captured ? toAppPiece(move.captured) : undefined,
    promotion: move.promotion ? toAppPromotionPiece(move.promotion) : undefined,
    isCapture: move.isCapture(),
    isPromotion: move.isPromotion(),
    isEnPassant: move.isEnPassant(),
    isKingsideCastle: move.isKingsideCastle(),
    isQueensideCastle: move.isQueensideCastle()
  };
}

export function toMoveRecord(move: ChessJsMove): MoveRecord {
  return {
    ...toLegalMove(move),
    color: toAppColor(move.color),
    before: move.before,
    after: move.after
  };
}
