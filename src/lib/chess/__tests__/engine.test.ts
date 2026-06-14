import { Chess } from "chess.js";
import { createGameEngine } from "../engine";

const START_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("GAMBIT chess engine", () => {
  it("creates the standard starting position and tracks white to move", () => {
    const engine = createGameEngine();
    const snapshot = engine.getSnapshot();

    expect(snapshot.fen).toBe(START_FEN);
    expect(snapshot.turn).toBe("white");
    expect(snapshot.board).toHaveLength(32);
    expect(snapshot.status).toBe("active");
  });

  it("applies a legal coordinate move and updates turn, board, FEN, and PGN", () => {
    const engine = createGameEngine();
    const result = engine.move({ from: "e2", to: "e4" });

    expect(result.ok).toBe(true);
    const snapshot = engine.getSnapshot();
    expect(snapshot.turn).toBe("black");
    expect(snapshot.pgn).toBe("1. e4");
    expect(snapshot.board).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ square: "e4", type: "pawn", color: "white" })
      ])
    );
    expect(snapshot.fen).toBe(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
    );
  });

  it("rejects illegal moves without mutating state", () => {
    const engine = createGameEngine();
    const before = engine.getSnapshot();
    const result = engine.move({ from: "a1", to: "a4" });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("Illegal move");
    expect(engine.getSnapshot()).toEqual(before);
  });

  it("lists legal moves exactly as chess.js does for a loaded position", () => {
    const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";
    const engine = createGameEngine(fen);
    const expected = new Chess(fen).moves({ square: "b8", verbose: true });

    expect(engine.getLegalMoves("b8").map((move) => move.san).sort()).toEqual(
      expected.map((move) => move.san).sort()
    );
  });

  it("allows castling only when chess.js says the position is legal", () => {
    const engine = createGameEngine(
      "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"
    );

    expect(engine.getLegalMoves("e1").map((move) => move.san)).toEqual(
      expect.arrayContaining(["O-O", "O-O-O"])
    );
    expect(engine.move({ from: "e1", to: "g1" }).ok).toBe(true);
    expect(engine.getSnapshot().fen).toBe(
      "r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1"
    );
  });

  it("allows en passant only on the immediate reply", () => {
    const engine = createGameEngine(
      "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3"
    );

    expect(engine.getLegalMoves("e5").map((move) => move.san)).toContain(
      "exd6"
    );
    expect(engine.move({ from: "e5", to: "d6" }).ok).toBe(true);
    expect(engine.getSnapshot().board).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ square: "d5", type: "pawn", color: "black" })
      ])
    );

    const expired = createGameEngine(
      "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3"
    );
    expect(expired.move({ from: "e5", to: "d6" }).ok).toBe(false);
  });

  it("promotes pawns to the selected piece", () => {
    const engine = createGameEngine("4k3/P7/8/8/8/8/8/4K3 w - - 0 1");

    const result = engine.move({ from: "a7", to: "a8", promotion: "knight" });

    expect(result.ok).toBe(true);
    expect(engine.getSnapshot().board).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          square: "a8",
          type: "knight",
          color: "white"
        })
      ])
    );
  });

  it("detects fool's mate as checkmate", () => {
    const engine = createGameEngine();

    engine.move({ from: "f2", to: "f3" });
    engine.move({ from: "e7", to: "e5" });
    engine.move({ from: "g2", to: "g4" });
    engine.move({ from: "d8", to: "h4" });

    const snapshot = engine.getSnapshot();
    expect(snapshot.inCheck).toBe(true);
    expect(snapshot.status).toBe("checkmate");
    expect(snapshot.winner).toBe("black");
  });

  it("detects stalemate draw positions", () => {
    const engine = createGameEngine("7k/5K2/6Q1/8/8/8/8/8 b - - 0 1");

    const snapshot = engine.getSnapshot();
    expect(snapshot.status).toBe("stalemate");
    expect(snapshot.winner).toBeNull();
  });

  it("detects fifty-move and threefold-repetition draws", () => {
    const fiftyMove = createGameEngine(
      "8/8/8/8/8/8/4k3/4K3 w - - 100 75"
    );
    expect(fiftyMove.getSnapshot().status).toBe("draw");
    expect(fiftyMove.getSnapshot().drawReason).toBe("fifty-move");

    const repetition = createGameEngine();
    for (let i = 0; i < 2; i += 1) {
      repetition.move({ from: "g1", to: "f3" });
      repetition.move({ from: "g8", to: "f6" });
      repetition.move({ from: "f3", to: "g1" });
      repetition.move({ from: "f6", to: "g8" });
    }

    expect(repetition.getSnapshot().status).toBe("draw");
    expect(repetition.getSnapshot().drawReason).toBe("threefold-repetition");
  });

  it("undoes multiple moves and restores previous snapshots", () => {
    const engine = createGameEngine();
    const start = engine.getSnapshot();

    engine.move({ from: "e2", to: "e4" });
    const afterFirst = engine.getSnapshot();
    engine.move({ from: "e7", to: "e5" });

    expect(engine.undo()).toEqual(afterFirst);
    expect(engine.undo()).toEqual(start);
    expect(engine.undo()).toEqual(start);
  });
});
