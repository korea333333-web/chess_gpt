"use client";

import { Canvas } from "@react-three/fiber";
import type { Square as ChessSquare } from "chess.js";
import { Suspense } from "react";
import { squareToBoardPosition, files, ranks } from "@/lib/board/coordinates";
import type { GameSnapshot } from "@/lib/chess/types";
import { Camera } from "@/components/scene/Camera";
import { Lighting } from "@/components/scene/Lighting";
import { Piece } from "./Piece";
import { Square } from "./Square";

type Board3DProps = {
  snapshot: GameSnapshot;
};

export default function Board3D({ snapshot }: Board3DProps) {
  const squares = ranks
    .slice()
    .reverse()
    .flatMap((rank) => files.map((file) => `${file}${rank}` as ChessSquare));

  return (
    <div className="h-[min(72vh,760px)] min-h-[520px] w-full overflow-hidden border border-[#6f5636] bg-[#18100b]">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 7.2, 7.6], fov: 42 }}
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
              <Square key={square} square={square} />
            ))}
            {snapshot.board.map((piece) => (
              <Piece
                key={`${piece.color}-${piece.type}-${piece.square}`}
                piece={piece}
                position={squareToBoardPosition(piece.square)}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
