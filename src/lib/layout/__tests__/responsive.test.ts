import {
  boardViewportClassName,
  gameMainClassName,
  sidePanelClassName
} from "../responsive";

describe("responsive game layout classes", () => {
  it("keeps the board phone-sized before desktop breakpoints", () => {
    expect(boardViewportClassName).toContain("h-[min(82vw,58vh)]");
    expect(boardViewportClassName).toContain("min-h-[300px]");
    expect(boardViewportClassName).toContain("sm:min-h-[520px]");
  });

  it("uses compact phone spacing with wider desktop spacing", () => {
    expect(gameMainClassName).toContain("px-3");
    expect(gameMainClassName).toContain("sm:px-5");
    expect(sidePanelClassName).toContain("p-3");
    expect(sidePanelClassName).toContain("sm:p-5");
  });
});
