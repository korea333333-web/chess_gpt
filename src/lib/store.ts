"use client";

import type { Square } from "chess.js";
import { create } from "zustand";
import { chooseComputerMove, type ComputerDifficulty } from "./ai/stockfish";
import { getComputerMoveDelay } from "./ai/timing";
import { createGameEngine } from "./chess/engine";
import type {
  GameSnapshot,
  MoveInput,
  MoveResult,
  PromotionPiece
} from "./chess/types";
import { resolveSquareClick } from "./game/controller";

export type GameMode = "hotseat" | "computer";

type GameResult =
  | { type: "active" }
  | { type: "resigned"; winner: "white" | "black" }
  | { type: "finished"; message: string };

export type VisualMove = {
  from: Square;
  to: Square;
  animationId?: number;
};

type GameStore = {
  snapshot: GameSnapshot;
  mode: GameMode;
  difficulty: ComputerDifficulty;
  selectedSquare: Square | null;
  legalTargets: Square[];
  pendingPromotion: Omit<MoveInput, "promotion"> | null;
  lastMove: VisualMove | null;
  moveAnimationId: number;
  result: GameResult;
  isComputerThinking: boolean;
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: ComputerDifficulty) => void;
  selectSquare: (square: Square) => void;
  promote: (piece: PromotionPiece) => void;
  move: (input: MoveInput) => MoveResult;
  undo: () => void;
  newGame: () => void;
  resign: () => void;
  load: (fen: string) => void;
};

const engine = createGameEngine();

export const useGameStore = create<GameStore>((set) => ({
  snapshot: engine.getSnapshot(),
  mode: "hotseat",
  difficulty: "intermediate",
  selectedSquare: null,
  legalTargets: [],
  pendingPromotion: null,
  lastMove: null,
  moveAnimationId: 0,
  result: { type: "active" },
  isComputerThinking: false,
  setMode(mode) {
    engine.reset();
    set({
      mode,
      snapshot: engine.getSnapshot(),
      selectedSquare: null,
      legalTargets: [],
      pendingPromotion: null,
      lastMove: null,
      moveAnimationId: 0,
      result: { type: "active" },
      isComputerThinking: false
    });
  },
  setDifficulty(difficulty) {
    set({ difficulty });
  },
  selectSquare(square) {
    const state = useGameStore.getState();

    if (
      state.result.type !== "active" ||
      state.isComputerThinking ||
      state.pendingPromotion
    ) {
      return;
    }

    if (state.mode === "computer" && state.snapshot.turn === "black") {
      return;
    }

    const resolution = resolveSquareClick(
      state.snapshot,
      state.selectedSquare,
      square
    );

    if (resolution.kind === "promotion") {
      set({
        pendingPromotion: resolution.move,
        selectedSquare: null,
        legalTargets: []
      });
      return;
    }

    if (resolution.kind === "move") {
      const result = engine.move(resolution.move);

      if (!result.ok) {
        set({
          selectedSquare: null,
          legalTargets: [],
          pendingPromotion: null,
          snapshot: result.snapshot
        });
        return;
      }

      const animationId = state.moveAnimationId + 1;

      set({
        snapshot: result.snapshot,
        selectedSquare: null,
        legalTargets: [],
        pendingPromotion: null,
        moveAnimationId: animationId,
        lastMove: {
          from: resolution.move.from,
          to: resolution.move.to,
          animationId
        },
        result: getResultState(result.snapshot)
      });

      maybeQueueComputerMove();
      return;
    }

    set({
      selectedSquare: resolution.selectedSquare,
      legalTargets: resolution.legalTargets
    });
  },
  promote(piece) {
    const state = useGameStore.getState();

    if (!state.pendingPromotion) {
      return;
    }

    const move: MoveInput = {
      ...state.pendingPromotion,
      promotion: piece
    };
    const result = engine.move(move);
    const animationId = state.moveAnimationId + 1;

    set({
      snapshot: result.snapshot,
      selectedSquare: null,
      legalTargets: [],
      pendingPromotion: null,
      moveAnimationId: result.ok ? animationId : state.moveAnimationId,
      lastMove: result.ok
        ? { from: move.from, to: move.to, animationId }
        : state.lastMove,
      result: getResultState(result.snapshot)
    });

    maybeQueueComputerMove();
  },
  move(input) {
    const state = useGameStore.getState();
    const result = engine.move(input);
    const animationId = state.moveAnimationId + 1;

    set({
      snapshot: result.snapshot,
      selectedSquare: null,
      legalTargets: [],
      pendingPromotion: null,
      moveAnimationId: result.ok ? animationId : state.moveAnimationId,
      lastMove: result.ok ? { from: input.from, to: input.to, animationId } : null,
      result: getResultState(result.snapshot)
    });

    return result;
  },
  undo() {
    engine.undo();

    if (useGameStore.getState().mode === "computer") {
      engine.undo();
    }

    const snapshot = engine.getSnapshot();
    const lastHistoryMove = snapshot.history.at(-1);
    set({
      snapshot,
      selectedSquare: null,
      legalTargets: [],
      pendingPromotion: null,
      lastMove: lastHistoryMove
        ? {
            from: lastHistoryMove.from,
            to: lastHistoryMove.to
          }
        : null,
      result: getResultState(snapshot),
      isComputerThinking: false
    });
  },
  newGame() {
    const snapshot = engine.reset();
    set({
      snapshot,
      selectedSquare: null,
      legalTargets: [],
      pendingPromotion: null,
      lastMove: null,
      moveAnimationId: 0,
      result: { type: "active" },
      isComputerThinking: false
    });
  },
  resign() {
    const snapshot = engine.getSnapshot();
    set({
      result: {
        type: "resigned",
        winner: snapshot.turn === "white" ? "black" : "white"
      },
      selectedSquare: null,
      legalTargets: [],
      pendingPromotion: null,
      isComputerThinking: false
    });
  },
  load(fen) {
    const snapshot = engine.load(fen);
    set({
      snapshot,
      selectedSquare: null,
      legalTargets: [],
      pendingPromotion: null,
      lastMove: null,
      moveAnimationId: 0,
      result: getResultState(snapshot),
      isComputerThinking: false
    });
  }
}));

function maybeQueueComputerMove() {
  const state = useGameStore.getState();

  if (
    state.mode !== "computer" ||
    state.snapshot.turn !== "black" ||
    state.result.type !== "active"
  ) {
    return;
  }

  useGameStore.setState({ isComputerThinking: true });
  const delayMs = getComputerMoveDelay(state.difficulty);

  setTimeout(() => {
    const latest = useGameStore.getState();

    if (
      latest.mode !== "computer" ||
      latest.snapshot.turn !== "black" ||
      latest.result.type !== "active"
    ) {
      useGameStore.setState({ isComputerThinking: false });
      return;
    }

    const aiMove = chooseComputerMove(latest.snapshot, latest.difficulty);

    if (!aiMove) {
      useGameStore.setState({ isComputerThinking: false });
      return;
    }

    const result = engine.move(aiMove);
    const animationId = latest.moveAnimationId + 1;
    useGameStore.setState({
      snapshot: result.snapshot,
      selectedSquare: null,
      legalTargets: [],
      pendingPromotion: null,
      moveAnimationId: result.ok ? animationId : latest.moveAnimationId,
      lastMove: result.ok
        ? { from: aiMove.from, to: aiMove.to, animationId }
        : latest.lastMove,
      result: getResultState(result.snapshot),
      isComputerThinking: false
    });

  }, delayMs);
}

function getResultState(snapshot: GameSnapshot): GameResult {
  if (snapshot.status === "checkmate") {
    return {
      type: "finished",
      message: `${snapshot.winner === "white" ? "백" : "흑"} 체크메이트 승리`
    };
  }

  if (snapshot.status === "stalemate") {
    return { type: "finished", message: "스테일메이트 무승부" };
  }

  if (snapshot.status === "draw") {
    return { type: "finished", message: "무승부" };
  }

  return { type: "active" };
}
