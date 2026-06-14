export const ambientLightConfig = {
  intensity: 0.82
} as const;

export const keyLightConfig = {
  position: [3.5, 6, 3] as [number, number, number],
  intensity: 1.25,
  color: "#fff1d0"
} as const;

export const backLightConfig = {
  position: [0, 3.2, -5.2] as [number, number, number],
  intensity: 1.85,
  color: "#f4c46b",
  angle: 0.72,
  penumbra: 0.86
} as const;

export const blackPieceFillLightConfig = {
  position: [0, 1.7, -3.8] as [number, number, number],
  intensity: 0.78,
  color: "#d7a83f"
} as const;

export const contactShadowConfig = {
  opacity: 0.32,
  scale: 10,
  blur: 2.5,
  far: 4,
  resolution: 1024,
  color: "#130d09"
} as const;
