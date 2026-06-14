"use client";

import type { GameSnapshot } from "@/lib/chess/types";
import type { GameMode } from "@/lib/store";

type StatusBarProps = {
  snapshot: GameSnapshot;
  mode: GameMode;
  isComputerThinking: boolean;
  resultMessage: string | null;
};

export function StatusBar({
  snapshot,
  mode,
  isComputerThinking,
  resultMessage
}: StatusBarProps) {
  const turnLabel = snapshot.turn === "white" ? "백 차례" : "흑 차례";
  const modeLabel = mode === "hotseat" ? "2인 대전" : "컴퓨터 대전";
  const stateLabel =
    resultMessage ??
    (isComputerThinking
      ? "컴퓨터가 생각 중"
      : snapshot.inCheck
        ? "체크"
        : "대국 진행 중");

  return (
    <div className="grid grid-cols-3 gap-2 border border-[#6f5636] bg-black/25 p-3 text-xs text-[#e5dac5] sm:gap-3 sm:p-4 sm:text-sm">
      <div>
        <p className="text-[#a18d70]">차례</p>
        <p className="mt-1 text-sm font-semibold text-ivory sm:text-xl">
          {turnLabel}
        </p>
      </div>
      <div>
        <p className="text-[#a18d70]">모드</p>
        <p className="mt-1 text-sm font-semibold text-ivory sm:text-xl">
          {modeLabel}
        </p>
      </div>
      <div>
        <p className="text-[#a18d70]">상태</p>
        <p className="mt-1 text-sm font-semibold text-ivory sm:text-xl">
          {stateLabel}
        </p>
      </div>
    </div>
  );
}
