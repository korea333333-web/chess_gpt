import {
  getPieceMaterial,
  getPieceSilhouette,
  stauntonPieceOrder
} from "../pieceStyle";

describe("staunton piece styling", () => {
  it("gives royal pieces taller silhouettes than minor pieces", () => {
    expect(getPieceSilhouette("king").height).toBeGreaterThan(
      getPieceSilhouette("queen").height
    );
    expect(getPieceSilhouette("queen").height).toBeGreaterThan(
      getPieceSilhouette("bishop").height
    );
    expect(getPieceSilhouette("bishop").height).toBeGreaterThan(
      getPieceSilhouette("pawn").height
    );
  });

  it("uses distinguishable ivory and ebony style materials", () => {
    expect(getPieceMaterial("white").color).not.toBe(getPieceMaterial("black").color);
    expect(getPieceMaterial("white").roughness).toBeGreaterThan(0.3);
    expect(getPieceMaterial("black").roughness).toBeGreaterThan(0.3);
  });

  it("covers every chess piece type", () => {
    expect(stauntonPieceOrder).toEqual([
      "pawn",
      "rook",
      "knight",
      "bishop",
      "queen",
      "king"
    ]);
  });
});
