"use client";

import { create } from "zustand";
import { createGameEngine } from "./chess/engine";
import type { GameSnapshot, MoveInput, MoveResult } from "./chess/types";

type GameStore = {
  snapshot: GameSnapshot;
  move: (input: MoveInput) => MoveResult;
  undo: () => void;
  reset: () => void;
  load: (fen: string) => void;
};

const engine = createGameEngine();

export const useGameStore = create<GameStore>((set) => ({
  snapshot: engine.getSnapshot(),
  move(input) {
    const result = engine.move(input);
    set({ snapshot: result.snapshot });
    return result;
  },
  undo() {
    set({ snapshot: engine.undo() });
  },
  reset() {
    set({ snapshot: engine.reset() });
  },
  load(fen) {
    set({ snapshot: engine.load(fen) });
  }
}));
