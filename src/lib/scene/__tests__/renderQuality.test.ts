import {
  boardDprRange,
  getBoardDprRange,
  getBoardDprRangeForWidth,
  highQualityGlOptions
} from "../renderQuality";

describe("3D render quality", () => {
  it("raises the default board render resolution above the old soft setting", () => {
    expect(boardDprRange[0]).toBeGreaterThanOrEqual(1.25);
    expect(boardDprRange[1]).toBeGreaterThanOrEqual(2);
  });

  it("keeps phone rendering below desktop quality for performance", () => {
    expect(getBoardDprRange("phone")[1]).toBeLessThan(getBoardDprRange("desktop")[1]);
    expect(getBoardDprRange("phone")[1]).toBeLessThanOrEqual(1.6);
  });

  it("selects phone quality for narrow screens", () => {
    expect(getBoardDprRangeForWidth(390)).toEqual(getBoardDprRange("phone"));
    expect(getBoardDprRangeForWidth(1024)).toEqual(getBoardDprRange("desktop"));
  });

  it("uses high-performance WebGL settings for the board canvas", () => {
    expect(highQualityGlOptions).toEqual({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance"
    });
  });
});
