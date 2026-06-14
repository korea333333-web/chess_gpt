import type { Square as ChessSquare } from "chess.js";
import { getSquareColor, squareToBoardPosition } from "@/lib/board/coordinates";

type SquareProps = {
  square: ChessSquare;
};

export function Square({ square }: SquareProps) {
  const [x, , z] = squareToBoardPosition(square);
  const shade = getSquareColor(square);
  const color = shade === "light" ? "#d6c09a" : "#4a2f1f";

  return (
    <mesh position={[x, -0.035, z]} receiveShadow>
      <boxGeometry args={[0.98, 0.07, 0.98]} />
      <meshStandardMaterial color={color} roughness={0.72} metalness={0.03} />
    </mesh>
  );
}
