import type { BoardPiece } from "@/lib/chess/types";

export type PieceType = BoardPiece["type"];
export type PieceColor = BoardPiece["color"];

export const stauntonPieceOrder: PieceType[] = [
  "pawn",
  "rook",
  "knight",
  "bishop",
  "queen",
  "king"
];

const silhouettes: Record<
  PieceType,
  {
    height: number;
    baseRadius: number;
    crownRadius: number;
  }
> = {
  pawn: { height: 0.78, baseRadius: 0.34, crownRadius: 0.19 },
  rook: { height: 0.92, baseRadius: 0.36, crownRadius: 0.27 },
  knight: { height: 1.0, baseRadius: 0.35, crownRadius: 0.24 },
  bishop: { height: 1.06, baseRadius: 0.35, crownRadius: 0.23 },
  queen: { height: 1.18, baseRadius: 0.36, crownRadius: 0.28 },
  king: { height: 1.28, baseRadius: 0.37, crownRadius: 0.24 }
};

const materials: Record<
  PieceColor,
  {
    color: string;
    roughness: number;
    metalness: number;
  }
> = {
  white: {
    color: "#f2dfbb",
    roughness: 0.48,
    metalness: 0.05
  },
  black: {
    color: "#2b1a12",
    roughness: 0.42,
    metalness: 0.1
  }
};

const rimMaterials: Record<PieceColor, { color: string; roughness: number; metalness: number }> = {
  white: { color: "#c59b5c", roughness: 0.32, metalness: 0.22 },
  black: { color: "#6c4628", roughness: 0.36, metalness: 0.18 }
};

export function getPieceSilhouette(type: PieceType) {
  return silhouettes[type];
}

export function getPieceMaterial(color: PieceColor) {
  return materials[color];
}

export function getPieceRimMaterial(color: PieceColor) {
  return rimMaterials[color];
}
