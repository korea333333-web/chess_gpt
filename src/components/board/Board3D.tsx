"use client";

import { Canvas } from "@react-three/fiber";
import type { Square as ChessSquare } from "chess.js";
import { Suspense } from "react";
import { squareToBoardPosition, files, ranks } from "@/lib/board/coordinates";
import type { GameSnapshot } from "@/lib/chess/types";
import { boardViewportClassName } from "@/lib/layout/responsive";
import { fixedCameraView } from "@/lib/scene/camera";
import { Camera } from "@/components/scene/Camera";
import { Lighting } from "@/components/scene/Lighting";
import { Piece } from "./Piece";
import { Square } from "./Square";

type Board3DProps = {
  snapshot: GameSnapshot;
  selectedSquare?: ChessSquare | null;
  legalTargets?: ChessSquare[];
  lastMove?: { from: ChessSquare; to: ChessSquare } | null;
  onSquareClick?: (square: ChessSquare) => void;
};

export default function Board3D({
  snapshot,
  selectedSquare = null,
  legalTargets = [],
  lastMove = null,
  onSquareClick
}: Board3DProps) {
  const squares = ranks
    .slice()
    .reverse()
    .flatMap((rank) => files.map((file) => `${file}${rank}` as ChessSquare));

  return (
    <div className={boardViewportClassName}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.75]}
        camera={{ position: fixedCameraView.position, fov: fixedCameraView.fov }}
      >
        <color attach="background" args={["#18100b"]} />
        <fog attach="fog" args={["#18100b", 11, 19]} />
        <Suspense fallback={null}>
          <Camera />
          <Lighting />
          <group position={[0, 0, 0]}>
            <mesh position={[0, -0.11, 0]} receiveShadow>
              <boxGeometry args={[8.55, 0.18, 8.55]} />
              <meshStandardMaterial color="#24150d" roughness={0.64} />
            </mesh>
            {squares.map((square) => (
              <Square
                key={square}
                square={square}
                isSelected={selectedSquare === square}
                isLegalTarget={legalTargets.includes(square)}
                isLastMove={lastMove?.from === square || lastMove?.to === square}
                onClick={onSquareClick}
              />
            ))}
            {snapshot.board.map((piece) => (
              <Piece
                key={`${piece.color}-${piece.type}-${piece.square}`}
                piece={piece}
                position={squareToBoardPosition(piece.square)}
                onClick={onSquareClick}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
