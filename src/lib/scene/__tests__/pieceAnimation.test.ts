import {
  getLiftedMovePosition,
  pieceMoveAnimation,
  smoothMoveProgress
} from "../pieceAnimation";

describe("piece movement animation", () => {
  it("starts exactly on the previous square and ends exactly on the target square", () => {
    const from: [number, number, number] = [-1, 0, 2];
    const to: [number, number, number] = [3, 0, -2];

    expect(getLiftedMovePosition(from, to, 0)).toEqual([
      from[0],
      pieceMoveAnimation.baseY,
      from[2]
    ]);
    expect(getLiftedMovePosition(from, to, 1)).toEqual([
      to[0],
      pieceMoveAnimation.baseY,
      to[2]
    ]);
  });

  it("lifts the piece during the middle of a move", () => {
    const from: [number, number, number] = [0, 0, 0];
    const to: [number, number, number] = [1, 0, 1];
    const middle = getLiftedMovePosition(from, to, 0.5);

    expect(middle[1]).toBeGreaterThan(pieceMoveAnimation.baseY + 0.2);
    expect(middle[0]).toBeCloseTo(0.5, 4);
    expect(middle[2]).toBeCloseTo(0.5, 4);
  });

  it("uses an elegant eased progress curve", () => {
    expect(pieceMoveAnimation.durationMs).toBeGreaterThanOrEqual(450);
    expect(pieceMoveAnimation.durationMs).toBeLessThanOrEqual(700);
    expect(smoothMoveProgress(0.25)).toBeLessThan(0.25);
    expect(smoothMoveProgress(0.75)).toBeGreaterThan(0.75);
  });
});
