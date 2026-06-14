import {
  backLightConfig,
  contactShadowConfig,
  keyLightConfig
} from "../lightingConfig";

describe("luxury board lighting", () => {
  it("adds a warm backlight behind the black pieces", () => {
    expect(backLightConfig.position[2]).toBeLessThan(-4);
    expect(backLightConfig.intensity).toBeGreaterThanOrEqual(1.6);
    expect(backLightConfig.color).toBe("#f4c46b");
  });

  it("keeps the main light softer than the back rim light", () => {
    expect(keyLightConfig.intensity).toBeLessThan(backLightConfig.intensity);
    expect(contactShadowConfig.opacity).toBeLessThanOrEqual(0.34);
  });
});
