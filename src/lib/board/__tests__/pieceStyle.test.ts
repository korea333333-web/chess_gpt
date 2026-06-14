import {
  getPieceMaterial,
  getPieceRimMaterial,
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

  it("uses glossy ivory and ebony style materials", () => {
    expect(getPieceMaterial("white").color).not.toBe(getPieceMaterial("black").color);
    expect(getPieceMaterial("white").roughness).toBeLessThanOrEqual(0.24);
    expect(getPieceMaterial("black").roughness).toBeLessThanOrEqual(0.22);
    expect(getPieceMaterial("black").metalness).toBeGreaterThanOrEqual(0.14);
  });

  it("uses bright gold trim on both sides like a luxury display set", () => {
    expect(getPieceRimMaterial("white").color).toBe("#d7a83f");
    expect(getPieceRimMaterial("black").color).toBe("#d7a83f");
    expect(getPieceRimMaterial("black").metalness).toBeGreaterThan(0.45);
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
