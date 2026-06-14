"use client";

import type { BoardPiece } from "@/lib/chess/types";

type PieceProps = {
  piece: BoardPiece;
  position: [number, number, number];
  onClick?: (square: BoardPiece["square"]) => void;
};

const pieceMaterial = {
  white: {
    color: "#f0dfbd",
    roughness: 0.42,
    metalness: 0.12
  },
  black: {
    color: "#2a1d16",
    roughness: 0.38,
    metalness: 0.18
  }
} as const;

export function Piece({ piece, position, onClick }: PieceProps) {
  const material = pieceMaterial[piece.color];
  const y = 0.03;

  return (
    <group
      position={[position[0], y, position[2]]}
      castShadow
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(piece.square);
      }}
    >
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.32, 0.38, 0.08, 36]} />
        <meshStandardMaterial {...material} />
      </mesh>
      <mesh castShadow position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 0.12, 36]} />
        <meshStandardMaterial {...material} />
      </mesh>
      {renderPieceShape(piece.type, material)}
    </group>
  );
}

function renderPieceShape(
  type: BoardPiece["type"],
  material: (typeof pieceMaterial)[keyof typeof pieceMaterial]
) {
  switch (type) {
    case "pawn":
      return (
        <>
          <mesh castShadow position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.14, 0.18, 0.28, 32]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh castShadow position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.18, 32, 16]} />
            <meshStandardMaterial {...material} />
          </mesh>
        </>
      );
    case "rook":
      return (
        <>
          <mesh castShadow position={[0, 0.39, 0]}>
            <cylinderGeometry args={[0.2, 0.24, 0.42, 32]} />
            <meshStandardMaterial {...material} />
          </mesh>
          {[-0.16, 0, 0.16].map((x) => (
            <mesh key={x} castShadow position={[x, 0.64, 0]}>
              <boxGeometry args={[0.09, 0.14, 0.26]} />
              <meshStandardMaterial {...material} />
            </mesh>
          ))}
        </>
      );
    case "knight":
      return (
        <>
          <mesh castShadow position={[0, 0.36, 0]} rotation={[0.18, 0, -0.18]}>
            <cylinderGeometry args={[0.13, 0.2, 0.42, 24]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh castShadow position={[0.05, 0.61, -0.06]} rotation={[0, 0.35, 0]}>
            <boxGeometry args={[0.24, 0.22, 0.34]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh castShadow position={[0.12, 0.74, -0.17]} rotation={[0.25, 0, 0]}>
            <coneGeometry args={[0.08, 0.16, 4]} />
            <meshStandardMaterial {...material} />
          </mesh>
        </>
      );
    case "bishop":
      return (
        <>
          <mesh castShadow position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.14, 0.21, 0.34, 32]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh castShadow position={[0, 0.63, 0]}>
            <sphereGeometry args={[0.2, 32, 16]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh castShadow position={[0.05, 0.76, 0]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[0.04, 0.22, 0.08]} />
            <meshStandardMaterial color="#c49b5f" roughness={0.38} metalness={0.3} />
          </mesh>
        </>
      );
    case "queen":
      return (
        <>
          <mesh castShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.16, 0.23, 0.42, 36]} />
            <meshStandardMaterial {...material} />
          </mesh>
          {[-0.18, -0.09, 0, 0.09, 0.18].map((x, index) => (
            <mesh key={x} castShadow position={[x, index === 2 ? 0.74 : 0.68, 0]}>
              <sphereGeometry args={[0.055, 16, 8]} />
              <meshStandardMaterial color="#caa464" roughness={0.28} metalness={0.42} />
            </mesh>
          ))}
        </>
      );
    case "king":
      return (
        <>
          <mesh castShadow position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.17, 0.24, 0.46, 36]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh castShadow position={[0, 0.72, 0]}>
            <boxGeometry args={[0.08, 0.28, 0.08]} />
            <meshStandardMaterial color="#caa464" roughness={0.28} metalness={0.42} />
          </mesh>
          <mesh castShadow position={[0, 0.78, 0]}>
            <boxGeometry args={[0.24, 0.055, 0.07]} />
            <meshStandardMaterial color="#caa464" roughness={0.28} metalness={0.42} />
          </mesh>
        </>
      );
  }
}
