import { fixedCameraControls, fixedCameraView } from "../camera";

describe("fixed camera view", () => {
  it("keeps the chessboard fixed while users play", () => {
    expect(fixedCameraView.position).toEqual([0, 7.2, 7.6]);
    expect(fixedCameraView.fov).toBe(42);
    expect(fixedCameraControls.enableRotate).toBe(false);
    expect(fixedCameraControls.enableZoom).toBe(false);
    expect(fixedCameraControls.enablePan).toBe(false);
  });
});
