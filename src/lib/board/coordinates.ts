import type { Square } from "chess.js";

export const BOARD_SIZE = 8;
export const SQUARE_SIZE = 1;
export const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const ranks = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type BoardPosition = [x: number, y: number, z: number];
export type SquareShade = "light" | "dark";

export function squareToBoardPosition(square: Square): BoardPosition {
  const fileIndex = files.indexOf(square[0] as (typeof files)[number]);
  const rankIndex = Number(square[1]) - 1;
  const offset = (BOARD_SIZE - 1) / 2;

  return [
    (fileIndex - offset) * SQUARE_SIZE,
    0,
    (offset - rankIndex) * SQUARE_SIZE
  ];
}

export function getSquareColor(square: Square): SquareShade {
  const fileIndex = files.indexOf(square[0] as (typeof files)[number]);
  const rankIndex = Number(square[1]) - 1;

  return (fileIndex + rankIndex) % 2 === 0 ? "dark" : "light";
}
