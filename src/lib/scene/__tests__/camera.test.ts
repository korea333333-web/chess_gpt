import { fixedCameraControls, fixedCameraView } from "../camera";

describe("fixed camera view", () => {
  it("keeps the chessboard fixed while users play", () => {
    expect(fixedCameraView.position[0]).toBe(0);
    expect(fixedCameraView.position[1]).toBeGreaterThanOrEqual(7.8);
    expect(fixedCameraView.position[2]).toBeGreaterThanOrEqual(8.4);
    expect(fixedCameraView.fov).toBeGreaterThanOrEqual(43);
    expect(fixedCameraControls.enableRotate).toBe(false);
    expect(fixedCameraControls.enableZoom).toBe(false);
    expect(fixedCameraControls.enablePan).toBe(false);
  });
});
