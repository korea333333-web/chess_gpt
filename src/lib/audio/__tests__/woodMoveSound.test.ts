import { woodMoveSoundEnvelope } from "../woodMoveSound";

describe("wood move sound envelope", () => {
  it("is a short wooden tap instead of a long UI chime", () => {
    expect(woodMoveSoundEnvelope.durationSeconds).toBeLessThanOrEqual(0.24);
    expect(woodMoveSoundEnvelope.bodyFrequencyHz).toBeLessThan(260);
    expect(woodMoveSoundEnvelope.clickFrequencyHz).toBeGreaterThan(
      woodMoveSoundEnvelope.bodyFrequencyHz
    );
  });

  it("keeps the sound quiet enough for repeated chess moves", () => {
    expect(woodMoveSoundEnvelope.masterGain).toBeLessThanOrEqual(0.22);
    expect(woodMoveSoundEnvelope.noiseSeconds).toBeLessThan(
      woodMoveSoundEnvelope.durationSeconds
    );
  });
});
