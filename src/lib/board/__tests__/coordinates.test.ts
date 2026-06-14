import {
  BOARD_SIZE,
  getSquareColor,
  squareToBoardPosition
} from "../coordinates";

describe("board coordinate mapping", () => {
  it("maps corner squares to stable 3D positions with white at the near side", () => {
    expect(squareToBoardPosition("a1")).toEqual([-3.5, 0, 3.5]);
    expect(squareToBoardPosition("h1")).toEqual([3.5, 0, 3.5]);
    expect(squareToBoardPosition("a8")).toEqual([-3.5, 0, -3.5]);
    expect(squareToBoardPosition("h8")).toEqual([3.5, 0, -3.5]);
  });

  it("keeps one world unit between adjacent square centers", () => {
    const a1 = squareToBoardPosition("a1");
    const b1 = squareToBoardPosition("b1");
    const a2 = squareToBoardPosition("a2");

    expect(b1[0] - a1[0]).toBe(1);
    expect(a1[2] - a2[2]).toBe(1);
    expect(BOARD_SIZE).toBe(8);
  });

  it("uses chessboard color parity where a1 is dark", () => {
    expect(getSquareColor("a1")).toBe("dark");
    expect(getSquareColor("b1")).toBe("light");
    expect(getSquareColor("a2")).toBe("light");
    expect(getSquareColor("h8")).toBe("dark");
  });
});
