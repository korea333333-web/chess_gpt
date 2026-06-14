export type RenderDeviceClass = "phone" | "desktop";

export const boardDprRange = [1.25, 2.15] as [number, number];

const phoneDprRange = [1, 1.55] as [number, number];

export const highQualityGlOptions = {
  alpha: false,
  antialias: true,
  powerPreference: "high-performance"
} as const;

export function getBoardDprRange(deviceClass: RenderDeviceClass) {
  return deviceClass === "phone" ? phoneDprRange : boardDprRange;
}

export function getBoardDprRangeForWidth(width: number) {
  return getBoardDprRange(width < 640 ? "phone" : "desktop");
}
