import { Chess } from "chess.js";
import type { Square } from "chess.js";
import {
  type BoardPiece,
  type DrawReason,
  type GameSnapshot,
  type GameStatus,
  type LegalMove,
  type MoveInput,
  type MoveRecord,
  toAppColor,
  toAppPiece,
  toChessJsPromotion,
  toLegalMove,
  toMoveRecord
} from "./types";

export const START_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export class ChessRules {
  private readonly chess: Chess;

  constructor(fen?: string) {
    this.chess = new Chess(fen);
  }

  reset() {
    this.chess.reset();
    return this.snapshot();
  }

  load(fen: string) {
    this.chess.load(fen);
    return this.snapshot();
  }

  legalMoves(square?: Square): LegalMove[] {
    const moves = square
      ? this.chess.moves({ square, verbose: true })
      : this.chess.moves({ verbose: true });

    return moves.map(toLegalMove);
  }

  move(input: MoveInput): MoveRecord {
    const move = this.chess.move({
      from: input.from,
      to: input.to,
      promotion: input.promotion
        ? toChessJsPromotion(input.promotion)
        : undefined
    });

    return toMoveRecord(move);
  }

  undo(): MoveRecord | null {
    const move = this.chess.undo();
    return move ? toMoveRecord(move) : null;
  }

  snapshot(): GameSnapshot {
    const status = this.getStatus();
    const winner = status === "checkmate" ? this.getWinner() : null;

    return {
      fen: this.chess.fen(),
      pgn: this.getMoveText(),
      turn: toAppColor(this.chess.turn()),
      status,
      winner,
      drawReason: status === "draw" ? this.getDrawReason() : null,
      inCheck: this.chess.isCheck(),
      board: this.getBoardPieces(),
      legalMoves: this.legalMoves(),
      history: this.chess.history({ verbose: true }).map(toMoveRecord)
    };
  }

  private getStatus(): GameStatus {
    if (this.chess.isCheckmate()) {
      return "checkmate";
    }

    if (this.chess.isStalemate()) {
      return "stalemate";
    }

    if (this.chess.isDraw()) {
      return "draw";
    }

    return "active";
  }

  private getWinner() {
    return this.chess.turn() === "w" ? "black" : "white";
  }

  private getDrawReason(): DrawReason {
    if (this.chess.isDrawByFiftyMoves()) {
      return "fifty-move";
    }

    if (this.chess.isThreefoldRepetition()) {
      return "threefold-repetition";
    }

    if (this.chess.isInsufficientMaterial()) {
      return "insufficient-material";
    }

    return "general";
  }

  private getBoardPieces(): BoardPiece[] {
    return this.chess
      .board()
      .flat()
      .filter((piece): piece is NonNullable<typeof piece> => piece !== null)
      .map((piece) => ({
        square: piece.square,
        type: toAppPiece(piece.type),
        color: toAppColor(piece.color)
      }));
  }

  private getMoveText() {
    return this.chess.history().reduce<string[]>((turns, move, index) => {
      if (index % 2 === 0) {
        turns.push(`${Math.floor(index / 2) + 1}. ${move}`);
      } else {
        turns[turns.length - 1] = `${turns[turns.length - 1]} ${move}`;
      }

      return turns;
    }, []).join(" ");
  }
}
