import { createGameEngine } from "@/lib/chess/engine";
import {
  getLegalTargets,
  getSelectableSquares,
  resolveSquareClick
} from "../controller";

describe("game interaction controller", () => {
  it("allows selecting only the side to move", () => {
    const snapshot = createGameEngine().getSnapshot();

    expect(getSelectableSquares(snapshot)).toContain("e2");
    expect(getSelectableSquares(snapshot)).not.toContain("e7");
  });

  it("returns legal destination squares for a selected piece", () => {
    const snapshot = createGameEngine().getSnapshot();

    expect(getLegalTargets(snapshot, "e2")).toEqual(["e3", "e4"]);
  });

  it("selects an own piece and exposes legal targets", () => {
    const snapshot = createGameEngine().getSnapshot();
    const result = resolveSquareClick(snapshot, null, "g1");

    expect(result.kind).toBe("select");
    expect(result.selectedSquare).toBe("g1");
    expect(result.legalTargets).toEqual(["f3", "h3"]);
  });

  it("moves when clicking a legal target and clears selection", () => {
    const snapshot = createGameEngine().getSnapshot();
    const result = resolveSquareClick(snapshot, "e2", "e4");

    expect(result.kind).toBe("move");
    expect(result.move).toEqual({ from: "e2", to: "e4" });
    expect(result.selectedSquare).toBeNull();
    expect(result.legalTargets).toEqual([]);
  });

  it("rejects illegal destinations without moving", () => {
    const snapshot = createGameEngine().getSnapshot();
    const result = resolveSquareClick(snapshot, "e2", "e5");

    expect(result.kind).toBe("clear");
    expect(result.selectedSquare).toBeNull();
    expect(result.legalTargets).toEqual([]);
  });

  it("asks for a promotion choice when a pawn reaches the last rank", () => {
    const snapshot = createGameEngine("4k3/P7/8/8/8/8/8/4K3 w - - 0 1").getSnapshot();
    const result = resolveSquareClick(snapshot, "a7", "a8");

    expect(result.kind).toBe("promotion");
    expect(result.move).toEqual({ from: "a7", to: "a8" });
  });
});
