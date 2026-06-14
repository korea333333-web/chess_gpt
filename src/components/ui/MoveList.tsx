"use client";

import type { MoveRecord } from "@/lib/chess/types";

type MoveListProps = {
  history: MoveRecord[];
};

export function MoveList({ history }: MoveListProps) {
  const rows: Array<{ turn: number; white?: string; black?: string }> = [];

  history.forEach((move, index) => {
    const rowIndex = Math.floor(index / 2);

    if (!rows[rowIndex]) {
      rows[rowIndex] = { turn: rowIndex + 1 };
    }

    if (index % 2 === 0) {
      rows[rowIndex].white = move.san;
    } else {
      rows[rowIndex].black = move.san;
    }
  });

  return (
    <div>
      <p className="text-sm text-[#a18d70]">기보</p>
      <div className="mt-2 max-h-40 overflow-y-auto border border-[#6f5636] bg-black/20 sm:max-h-64">
        {rows.length === 0 ? (
          <p className="p-3 text-sm text-[#d5c7ad]">아직 둔 수가 없습니다.</p>
        ) : (
          rows.map((row) => (
            <div
              className="grid grid-cols-[48px_1fr_1fr] gap-2 border-b border-[#3d2a1d] px-3 py-2 text-sm text-[#e5dac5] last:border-b-0"
              key={row.turn}
            >
              <span className="text-[#a18d70]">{row.turn}.</span>
              <span>{row.white ?? ""}</span>
              <span>{row.black ?? ""}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
