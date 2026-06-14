"use client";

import type { ComputerDifficulty } from "@/lib/ai/stockfish";
import type { GameMode } from "@/lib/store";

type ControlsProps = {
  mode: GameMode;
  difficulty: ComputerDifficulty;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: ComputerDifficulty) => void;
  onNewGame: () => void;
  onUndo: () => void;
  onResign: () => void;
};

const buttonBase =
  "min-h-11 border border-[#6f5636] px-2 py-2 text-sm text-[#e5dac5] transition hover:border-brass hover:text-ivory disabled:opacity-40 sm:px-3";
const activeButton = "border-brass bg-brass/20 text-ivory";

export function Controls({
  mode,
  difficulty,
  onModeChange,
  onDifficultyChange,
  onNewGame,
  onUndo,
  onResign
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      <div>
        <p className="text-sm text-[#a18d70]">대전 모드</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            className={`${buttonBase} ${mode === "hotseat" ? activeButton : ""}`}
            onClick={() => onModeChange("hotseat")}
            type="button"
          >
            2인
          </button>
          <button
            className={`${buttonBase} ${mode === "computer" ? activeButton : ""}`}
            onClick={() => onModeChange("computer")}
            type="button"
          >
            AI
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm text-[#a18d70]">AI 난이도</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["beginner", "intermediate", "advanced"] as const).map((level) => (
            <button
              className={`${buttonBase} ${
                difficulty === level ? activeButton : ""
              }`}
              disabled={mode !== "computer"}
              key={level}
              onClick={() => onDifficultyChange(level)}
              type="button"
            >
              {getDifficultyLabel(level)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className={buttonBase} onClick={onNewGame} type="button">
          새 게임
        </button>
        <button className={buttonBase} onClick={onUndo} type="button">
          무르기
        </button>
        <button className={buttonBase} onClick={onResign} type="button">
          항복
        </button>
      </div>
    </div>
  );
}

function getDifficultyLabel(difficulty: ComputerDifficulty) {
  switch (difficulty) {
    case "beginner":
      return "초급";
    case "intermediate":
      return "중급";
    case "advanced":
      return "고급";
  }
}
