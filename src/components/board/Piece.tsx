"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, Vector2 } from "three";
import type { BoardPosition } from "@/lib/board/coordinates";
import type { BoardPiece } from "@/lib/chess/types";
import {
  getPieceMaterial,
  getPieceRimMaterial,
  type PieceColor,
  type PieceType
} from "@/lib/board/pieceStyle";
import { playWoodMoveSound } from "@/lib/audio/woodMoveSound";
import {
  getLiftedMovePosition,
  pieceMoveAnimation,
  shouldStartMoveAnimation
} from "@/lib/scene/pieceAnimation";

type PieceProps = {
  piece: BoardPiece;
  position: BoardPosition;
  animationFrom?: BoardPosition;
  animationId?: number;
  onClick?: (square: BoardPiece["square"]) => void;
};

type MaterialProps = ReturnType<typeof getPieceMaterial>;

const latheProfiles: Record<PieceType, Array<[number, number]>> = {
  pawn: [
    [0, 0],
    [0.31, 0],
    [0.35, 0.03],
    [0.32, 0.08],
    [0.22, 0.12],
    [0.18, 0.25],
    [0.15, 0.47],
    [0.21, 0.54],
    [0.1, 0.58],
    [0, 0.58]
  ],
  rook: [
    [0, 0],
    [0.34, 0],
    [0.38, 0.04],
    [0.34, 0.1],
    [0.24, 0.16],
    [0.2, 0.57],
    [0.26, 0.65],
    [0.27, 0.79],
    [0.21, 0.84],
    [0, 0.84]
  ],
  knight: [
    [0, 0],
    [0.34, 0],
    [0.37, 0.04],
    [0.32, 0.1],
    [0.23, 0.16],
    [0.2, 0.53],
    [0.25, 0.6],
    [0.18, 0.66],
    [0, 0.66]
  ],
  bishop: [
    [0, 0],
    [0.33, 0],
    [0.37, 0.04],
    [0.33, 0.1],
    [0.23, 0.17],
    [0.18, 0.52],
    [0.25, 0.68],
    [0.2, 0.86],
    [0.07, 0.96],
    [0, 0.98]
  ],
  queen: [
    [0, 0],
    [0.34, 0],
    [0.38, 0.04],
    [0.34, 0.1],
    [0.24, 0.17],
    [0.2, 0.62],
    [0.28, 0.74],
    [0.23, 0.91],
    [0.18, 1.02],
    [0, 1.03]
  ],
  king: [
    [0, 0],
    [0.35, 0],
    [0.39, 0.04],
    [0.35, 0.1],
    [0.24, 0.17],
    [0.2, 0.66],
    [0.28, 0.8],
    [0.22, 0.99],
    [0.16, 1.08],
    [0, 1.08]
  ]
};

export function Piece({
  piece,
  position,
  animationFrom,
  animationId,
  onClick
}: PieceProps) {
  const material = getPieceMaterial(piece.color);
  const rimMaterial = getPieceRimMaterial(piece.color);
  const groupRef = useRef<Group>(null);
  const animationStartMsRef = useRef<number | null>(null);
  const startedAnimationIdRef = useRef<number | undefined>(undefined);
  const soundPlayedRef = useRef(false);
  const animationFromX = animationFrom?.[0] ?? null;
  const animationFromZ = animationFrom?.[2] ?? null;
  const positionX = position[0];
  const positionZ = position[2];

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }

    if (
      animationFromX !== null &&
      animationFromZ !== null &&
      shouldStartMoveAnimation(startedAnimationIdRef.current, animationId)
    ) {
      startedAnimationIdRef.current = animationId;
      animationStartMsRef.current = null;
      soundPlayedRef.current = false;
      groupRef.current.position.set(
        animationFromX,
        pieceMoveAnimation.baseY,
        animationFromZ
      );
      return;
    }

    if (animationFromX === null || animationFromZ === null) {
      animationStartMsRef.current = null;
      soundPlayedRef.current = true;
      groupRef.current.position.set(
        positionX,
        pieceMoveAnimation.baseY,
        positionZ
      );
    }
  }, [animationFromX, animationFromZ, animationId, positionX, positionZ]);

  useFrame(({ clock }) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    if (!animationFrom) {
      group.position.set(position[0], pieceMoveAnimation.baseY, position[2]);
      return;
    }

    const nowMs = clock.elapsedTime * 1000;

    if (animationStartMsRef.current === null) {
      animationStartMsRef.current = nowMs;
    }

    const progress =
      (nowMs - animationStartMsRef.current) / pieceMoveAnimation.durationMs;
    const animatedPosition = getLiftedMovePosition(
      animationFrom,
      position,
      progress
    );

    group.position.set(...animatedPosition);

    if (progress >= 1 && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playWoodMoveSound();
    }
  });

  return (
    <group
      ref={groupRef}
      position={[
        animationFrom?.[0] ?? position[0],
        pieceMoveAnimation.baseY,
        animationFrom?.[2] ?? position[2]
      ]}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(piece.square);
      }}
    >
      <LatheBody material={material} type={piece.type} />
      <LuxuryBaseBand color={piece.color} material={rimMaterial} type={piece.type} />
      <GoldRing material={rimMaterial} radius={0.34} tube={0.018} y={0.055} />
      <Collar material={rimMaterial} radius={0.29} y={0.115} />
      <DiamondBand color={piece.color} material={rimMaterial} type={piece.type} />
      <Collar material={rimMaterial} radius={0.2} y={0.19} />
      <GoldRing material={rimMaterial} radius={0.205} tube={0.012} y={0.58} />
      {renderPieceTop(piece.type, piece.color, material, rimMaterial)}
    </group>
  );
}

function LatheBody({ type, material }: { type: PieceType; material: MaterialProps }) {
  const points = useMemo(
    () => latheProfiles[type].map(([x, y]) => new Vector2(x, y)),
    [type]
  );

  return (
    <mesh castShadow receiveShadow>
      <latheGeometry args={[points, 64]} />
      <meshStandardMaterial {...material} />
    </mesh>
  );
}

function Collar({
  y,
  radius,
  material
}: {
  y: number;
  radius: number;
  material: MaterialProps;
}) {
  return (
    <mesh castShadow position={[0, y, 0]}>
      <cylinderGeometry args={[radius, radius, 0.035, 56]} />
      <meshStandardMaterial {...material} />
    </mesh>
  );
}

function GoldRing({
  y,
  radius,
  tube,
  material
}: {
  y: number;
  radius: number;
  tube: number;
  material: MaterialProps;
}) {
  return (
    <mesh castShadow position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, 12, 72]} />
      <meshStandardMaterial {...material} />
    </mesh>
  );
}

function LuxuryBaseBand({
  color,
  type,
  material
}: {
  color: PieceColor;
  type: PieceType;
  material: MaterialProps;
}) {
  const darkInlay = color === "white" ? "#1a100b" : "#f8f1df";
  const shouldUseWideBand = type === "rook" || type === "queen" || type === "king";

  return (
    <>
      <GoldRing material={material} radius={0.33} tube={0.02} y={0.015} />
      <GoldRing material={material} radius={0.31} tube={0.014} y={0.095} />
      {shouldUseWideBand ? (
        <mesh castShadow position={[0, 0.255, 0]}>
          <cylinderGeometry args={[0.255, 0.275, 0.08, 56]} />
          <meshStandardMaterial color={darkInlay} roughness={0.26} metalness={0.08} />
        </mesh>
      ) : null}
    </>
  );
}

function DiamondBand({
  color,
  type,
  material
}: {
  color: PieceColor;
  type: PieceType;
  material: MaterialProps;
}) {
  if (type === "pawn" || type === "bishop") {
    return null;
  }

  const alternateColor = color === "white" ? "#1a100b" : "#f8f1df";

  return (
    <group position={[0, 0.255, 0]}>
      {Array.from({ length: 16 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 16;
        const radius = 0.282;
        const isGold = index % 2 === 0;

        return (
          <mesh
            castShadow
            key={angle}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle, Math.PI / 4]}
          >
            <boxGeometry args={[0.055, 0.055, 0.018]} />
            <meshStandardMaterial
              {...(isGold
                ? material
                : { color: alternateColor, roughness: 0.22, metalness: 0.08 })}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function renderPieceTop(
  type: PieceType,
  color: PieceColor,
  material: MaterialProps,
  rimMaterial: MaterialProps
) {
  switch (type) {
    case "pawn":
      return (
        <>
          <GoldRing material={rimMaterial} radius={0.17} tube={0.012} y={0.535} />
          <mesh castShadow position={[0, 0.67, 0]} scale={[0.19, 0.19, 0.19]}>
            <sphereGeometry args={[1, 40, 20]} />
            <meshStandardMaterial {...material} />
          </mesh>
        </>
      );
    case "rook":
      return (
        <>
          <mesh castShadow position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.08, 56]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>
          <GoldRing material={rimMaterial} radius={0.26} tube={0.016} y={0.79} />
          {Array.from({ length: 6 }, (_, index) => {
            const angle = (Math.PI * 2 * index) / 6;
            return (
              <mesh
                castShadow
                key={angle}
                position={[Math.cos(angle) * 0.2, 0.93, Math.sin(angle) * 0.2]}
                rotation={[0, -angle, 0]}
              >
                <boxGeometry args={[0.1, 0.14, 0.12]} />
                <meshStandardMaterial {...rimMaterial} />
              </mesh>
            );
          })}
        </>
      );
    case "knight":
      return <KnightHead color={color} material={material} rimMaterial={rimMaterial} />;
    case "bishop":
      return (
        <>
          <mesh castShadow position={[0, 0.79, 0]} scale={[0.23, 0.31, 0.23]}>
            <sphereGeometry args={[1, 48, 24]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh castShadow position={[0.065, 0.88, 0]} rotation={[0, 0, -0.54]}>
            <boxGeometry args={[0.055, 0.3, 0.07]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>
          <mesh castShadow position={[0, 1.06, 0]} scale={[0.07, 0.07, 0.07]}>
            <sphereGeometry args={[1, 24, 12]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>
        </>
      );
    case "queen":
      return (
        <>
          <GoldRing material={rimMaterial} radius={0.23} tube={0.015} y={1.035} />
          <CrownPearls material={rimMaterial} radius={0.25} y={1.1} />
          <mesh castShadow position={[0, 1.15, 0]} scale={[0.075, 0.075, 0.075]}>
            <sphereGeometry args={[1, 24, 12]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>
        </>
      );
    case "king":
      return (
        <>
          <mesh castShadow position={[0, 1.13, 0]} scale={[0.12, 0.12, 0.12]}>
            <sphereGeometry args={[1, 28, 14]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <GoldRing material={rimMaterial} radius={0.16} tube={0.014} y={1.14} />
          <mesh castShadow position={[0, 1.28, 0]}>
            <boxGeometry args={[0.065, 0.28, 0.065]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>
          <mesh castShadow position={[0, 1.36, 0]}>
            <boxGeometry args={[0.24, 0.055, 0.055]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>
        </>
      );
  }
}

function CrownPearls({
  radius,
  y,
  material
}: {
  radius: number;
  y: number;
  material: MaterialProps;
}) {
  return (
    <>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 8;
        const isTallPoint = index % 2 === 0;

        return (
          <mesh
            castShadow
            key={angle}
            position={[
              Math.cos(angle) * radius,
              isTallPoint ? y + 0.035 : y,
              Math.sin(angle) * radius
            ]}
            scale={[0.055, 0.055, 0.055]}
          >
            <sphereGeometry args={[1, 20, 10]} />
            <meshStandardMaterial {...material} />
          </mesh>
        );
      })}
    </>
  );
}

function KnightHead({
  color,
  material,
  rimMaterial
}: {
  color: PieceColor;
  material: MaterialProps;
  rimMaterial: MaterialProps;
}) {
  const eyeColor = color === "white" ? "#2b1a10" : "#d3a968";

  return (
    <group position={[0, 0.66, 0.02]} rotation={[0, -0.2, -0.08]}>
      <mesh castShadow position={[-0.02, 0.06, 0]} scale={[0.16, 0.34, 0.13]}>
        <sphereGeometry args={[1, 36, 18]} />
        <meshStandardMaterial {...material} />
      </mesh>
      <mesh
        castShadow
        position={[0.05, 0.32, -0.06]}
        rotation={[0.18, -0.34, -0.18]}
        scale={[0.22, 0.26, 0.12]}
      >
        <sphereGeometry args={[1, 36, 18]} />
        <meshStandardMaterial {...material} />
      </mesh>
      <mesh
        castShadow
        position={[0.12, 0.27, -0.22]}
        rotation={[0.15, -0.2, -0.12]}
        scale={[0.16, 0.12, 0.18]}
      >
        <sphereGeometry args={[1, 28, 14]} />
        <meshStandardMaterial {...material} />
      </mesh>
      <mesh castShadow position={[-0.03, 0.55, -0.03]} rotation={[0.25, 0, -0.12]}>
        <coneGeometry args={[0.055, 0.16, 4]} />
        <meshStandardMaterial {...material} />
      </mesh>
      <mesh castShadow position={[0.11, 0.5, -0.08]} rotation={[0.25, 0.3, 0.12]}>
        <coneGeometry args={[0.05, 0.14, 4]} />
        <meshStandardMaterial {...material} />
      </mesh>
      {[-0.02, 0.08, 0.18].map((offset) => (
        <mesh
          castShadow
          key={offset}
          position={[-0.12, 0.38 - offset, 0.08]}
          rotation={[0.16, 0, 0.72]}
        >
          <boxGeometry args={[0.035, 0.15, 0.065]} />
          <meshStandardMaterial {...rimMaterial} />
        </mesh>
      ))}
      <mesh position={[0.19, 0.34, -0.12]} scale={[0.018, 0.018, 0.018]}>
        <sphereGeometry args={[1, 12, 6]} />
        <meshStandardMaterial color={eyeColor} roughness={0.35} metalness={0.1} />
      </mesh>
    </group>
  );
}
