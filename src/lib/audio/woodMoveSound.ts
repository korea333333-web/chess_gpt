export const woodMoveSoundEnvelope = {
  durationSeconds: 0.18,
  noiseSeconds: 0.045,
  bodyFrequencyHz: 145,
  clickFrequencyHz: 520,
  masterGain: 0.36,
  bodyGain: 0.95,
  clickGain: 0.52,
  noiseGain: 0.32
} as const;

type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let sharedAudioContext: AudioContext | null = null;

export function primeWoodMoveAudio() {
  const context = getAudioContext();

  if (!context) {
    return false;
  }

  if (context.state === "suspended") {
    void context.resume().catch(() => undefined);
  }

  return true;
}

export function playWoodMoveSound() {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context
      .resume()
      .then(() => scheduleWoodMoveSound(context))
      .catch(() => undefined);
    return;
  }

  scheduleWoodMoveSound(context);
}

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const audioWindow = window as WebAudioWindow;
  const AudioContextConstructor =
    audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  const context =
    sharedAudioContext ??
    new AudioContextConstructor({
      latencyHint: "interactive"
    });
  sharedAudioContext = context;

  return context;
}

function scheduleWoodMoveSound(context: AudioContext) {
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(
    woodMoveSoundEnvelope.masterGain,
    now + 0.008
  );
  master.gain.exponentialRampToValueAtTime(
    0.0001,
    now + woodMoveSoundEnvelope.durationSeconds
  );
  master.connect(context.destination);

  const body = context.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(woodMoveSoundEnvelope.bodyFrequencyHz, now);
  body.frequency.exponentialRampToValueAtTime(90, now + 0.13);

  const bodyGain = context.createGain();
  bodyGain.gain.setValueAtTime(woodMoveSoundEnvelope.bodyGain, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  body.connect(bodyGain).connect(master);
  body.start(now);
  body.stop(now + woodMoveSoundEnvelope.durationSeconds);

  const click = context.createOscillator();
  click.type = "square";
  click.frequency.setValueAtTime(woodMoveSoundEnvelope.clickFrequencyHz, now);

  const clickGain = context.createGain();
  clickGain.gain.setValueAtTime(woodMoveSoundEnvelope.clickGain, now);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
  click.connect(clickGain).connect(master);
  click.start(now);
  click.stop(now + 0.035);

  const noise = context.createBufferSource();
  noise.buffer = makeWoodNoiseBuffer(context);

  const lowPass = context.createBiquadFilter();
  lowPass.type = "lowpass";
  lowPass.frequency.setValueAtTime(1250, now);

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(woodMoveSoundEnvelope.noiseGain, now);
  noiseGain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + woodMoveSoundEnvelope.noiseSeconds
  );
  noise.connect(lowPass).connect(noiseGain).connect(master);
  noise.start(now);
  noise.stop(now + woodMoveSoundEnvelope.noiseSeconds);
}

function makeWoodNoiseBuffer(context: AudioContext) {
  const frameCount = Math.max(
    1,
    Math.floor(context.sampleRate * woodMoveSoundEnvelope.noiseSeconds)
  );
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    const decay = 1 - index / frameCount;
    data[index] = (Math.random() * 2 - 1) * decay * decay;
  }

  return buffer;
}
