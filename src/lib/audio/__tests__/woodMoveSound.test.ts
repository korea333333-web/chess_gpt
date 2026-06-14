import { primeWoodMoveAudio, woodMoveSoundEnvelope } from "../woodMoveSound";

describe("wood move sound envelope", () => {
  it("is a short wooden tap instead of a long UI chime", () => {
    expect(woodMoveSoundEnvelope.durationSeconds).toBeLessThanOrEqual(0.24);
    expect(woodMoveSoundEnvelope.bodyFrequencyHz).toBeLessThan(260);
    expect(woodMoveSoundEnvelope.clickFrequencyHz).toBeGreaterThan(
      woodMoveSoundEnvelope.bodyFrequencyHz
    );
  });

  it("is loud enough to be clearly audible over the 3D scene", () => {
    expect(woodMoveSoundEnvelope.masterGain).toBeGreaterThanOrEqual(0.32);
    expect(woodMoveSoundEnvelope.masterGain).toBeLessThanOrEqual(0.45);
    expect(woodMoveSoundEnvelope.bodyGain).toBeGreaterThanOrEqual(0.9);
    expect(woodMoveSoundEnvelope.clickGain).toBeGreaterThanOrEqual(0.48);
    expect(woodMoveSoundEnvelope.noiseGain).toBeGreaterThanOrEqual(0.28);
    expect(woodMoveSoundEnvelope.noiseSeconds).toBeLessThan(
      woodMoveSoundEnvelope.durationSeconds
    );
  });

  it("can be safely primed outside a browser without throwing", () => {
    expect(primeWoodMoveAudio()).toBe(false);
  });
});
