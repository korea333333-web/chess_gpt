import type { Square as ChessSquare } from "chess.js";
import { getSquareColor, squareToBoardPosition } from "@/lib/board/coordinates";

type SquareProps = {
  square: ChessSquare;
  isSelected?: boolean;
  isLegalTarget?: boolean;
  isLastMove?: boolean;
  onClick?: (square: ChessSquare) => void;
};

export function Square({
  square,
  isSelected = false,
  isLegalTarget = false,
  isLastMove = false,
  onClick
}: SquareProps) {
  const [x, , z] = squareToBoardPosition(square);
  const shade = getSquareColor(square);
  const color = getSquareMaterialColor(shade, isSelected, isLegalTarget, isLastMove);

  return (
    <mesh
      position={[x, -0.035, z]}
      receiveShadow
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(square);
      }}
    >
      <boxGeometry args={[0.98, 0.07, 0.98]} />
      <meshStandardMaterial
        color={color}
        roughness={0.72}
        metalness={0.03}
        emissive={isSelected || isLegalTarget ? color : "#000000"}
        emissiveIntensity={isSelected ? 0.25 : isLegalTarget ? 0.14 : 0}
      />
    </mesh>
  );
}

function getSquareMaterialColor(
  shade: "light" | "dark",
  isSelected: boolean,
  isLegalTarget: boolean,
  isLastMove: boolean
) {
  if (isSelected) {
    return "#c49a45";
  }

  if (isLegalTarget) {
    return "#6f8f5a";
  }

  if (isLastMove) {
    return "#7e6846";
  }

  return shade === "light" ? "#d6c09a" : "#4a2f1f";
}
