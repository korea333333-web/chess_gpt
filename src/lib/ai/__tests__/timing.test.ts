import { getComputerMoveDelay } from "../timing";

describe("computer move timing", () => {
  it("keeps every AI response slow enough to feel like a real turn", () => {
    expect(getComputerMoveDelay("beginner")).toBeGreaterThanOrEqual(900);
    expect(getComputerMoveDelay("intermediate")).toBeGreaterThanOrEqual(1200);
    expect(getComputerMoveDelay("advanced")).toBeGreaterThanOrEqual(1500);
  });

  it("uses a longer thinking pause for stronger difficulty levels", () => {
    const beginner = getComputerMoveDelay("beginner");
    const intermediate = getComputerMoveDelay("intermediate");
    const advanced = getComputerMoveDelay("advanced");

    expect(intermediate).toBeGreaterThan(beginner);
    expect(advanced).toBeGreaterThan(intermediate);
  });
});
