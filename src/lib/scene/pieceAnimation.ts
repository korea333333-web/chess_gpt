import type { BoardPosition } from "@/lib/board/coordinates";

export const pieceMoveAnimation = {
  baseY: 0.02,
  liftHeight: 0.36,
  durationMs: 560
} as const;

export function smoothMoveProgress(progress: number) {
  const clamped = clamp01(progress);

  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

export function shouldStartMoveAnimation(
  previousAnimationId: number | undefined,
  nextAnimationId: number | undefined
) {
  return nextAnimationId !== undefined && nextAnimationId !== previousAnimationId;
}

export function getLiftedMovePosition(
  from: BoardPosition,
  to: BoardPosition,
  progress: number
): [number, number, number] {
  const clamped = clamp01(progress);

  if (clamped === 0) {
    return [from[0], pieceMoveAnimation.baseY, from[2]];
  }

  if (clamped === 1) {
    return [to[0], pieceMoveAnimation.baseY, to[2]];
  }

  const eased = smoothMoveProgress(clamped);
  const lift = Math.sin(Math.PI * clamped) * pieceMoveAnimation.liftHeight;

  return [
    lerp(from[0], to[0], eased),
    pieceMoveAnimation.baseY + lift,
    lerp(from[2], to[2], eased)
  ];
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
