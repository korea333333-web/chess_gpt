"use client";

import dynamic from "next/dynamic";
import { Controls } from "@/components/ui/Controls";
import { MoveList } from "@/components/ui/MoveList";
import { StatusBar } from "@/components/ui/StatusBar";
import {
  boardViewportClassName,
  gameMainClassName,
  sidePanelClassName
} from "@/lib/layout/responsive";
import { useGameStore } from "@/lib/store";

const Board3D = dynamic(() => import("@/components/board/Board3D"), {
  ssr: false,
  loading: () => (
    <div className={`${boardViewportClassName} flex items-center justify-center text-[#d5c7ad]`}>
      3D 체스판을 준비하는 중입니다
    </div>
  )
});

export function GameScreen() {
  const {
    snapshot,
    mode,
    difficulty,
    selectedSquare,
    legalTargets,
    pendingPromotion,
    lastMove,
    result,
    isComputerThinking,
    setMode,
    setDifficulty,
    selectSquare,
    promote,
    newGame,
    undo,
    resign
  } = useGameStore();

  const resultMessage =
    result.type === "finished"
      ? result.message
      : result.type === "resigned"
        ? `${result.winner === "white" ? "백" : "흑"} 항복승`
        : null;

  return (
    <main className={gameMainClassName}>
      <section className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-5">
        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <div>
            <p className="text-sm uppercase text-brass">Playable Sprint</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-ivory sm:mt-2 sm:text-5xl">
              GAMBIT
            </h1>
          </div>
          <StatusBar
            snapshot={snapshot}
            mode={mode}
            isComputerThinking={isComputerThinking}
            resultMessage={resultMessage}
          />
          <Board3D
            snapshot={snapshot}
            selectedSquare={selectedSquare}
            legalTargets={legalTargets}
            lastMove={lastMove}
            onSquareClick={selectSquare}
          />
        </div>

        <aside className={sidePanelClassName}>
          <Controls
            mode={mode}
            difficulty={difficulty}
            onModeChange={setMode}
            onDifficultyChange={setDifficulty}
            onNewGame={newGame}
            onUndo={undo}
            onResign={resign}
          />
          {pendingPromotion ? (
            <div className="border border-brass bg-brass/10 p-4">
              <p className="text-sm text-[#d5c7ad]">승급할 말을 선택하세요</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["queen", "rook", "bishop", "knight"] as const).map((piece) => (
                  <button
                    className="border border-[#6f5636] px-3 py-2 text-sm text-[#e5dac5] transition hover:border-brass hover:text-ivory"
                    key={piece}
                    onClick={() => promote(piece)}
                    type="button"
                  >
                    {getPromotionLabel(piece)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <MoveList history={snapshot.history} />
        </aside>
      </section>
    </main>
  );
}

function getPromotionLabel(piece: "queen" | "rook" | "bishop" | "knight") {
  switch (piece) {
    case "queen":
      return "퀸";
    case "rook":
      return "룩";
    case "bishop":
      return "비숍";
    case "knight":
      return "나이트";
  }
}
