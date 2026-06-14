import { createGameEngine } from "@/lib/chess/engine";

export default function Home() {
  const snapshot = createGameEngine().getSnapshot();

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-brass">
            Sprint 1
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-normal text-ivory">
            GAMBIT
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#d5c7ad]">
            체스 규칙 엔진과 게임 상태가 화면과 분리되어 준비되었습니다.
            다음 스프린트에서 이 상태를 3D 체스판에 연결합니다.
          </p>
        </div>

        <div className="grid gap-4 border-y border-[#6f5636] py-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-[#a18d70]">현재 차례</p>
            <p className="mt-2 text-2xl font-semibold">
              {snapshot.turn === "white" ? "백" : "흑"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#a18d70]">상태</p>
            <p className="mt-2 text-2xl font-semibold">{snapshot.status}</p>
          </div>
          <div>
            <p className="text-sm text-[#a18d70]">기물 수</p>
            <p className="mt-2 text-2xl font-semibold">
              {snapshot.board.length}
            </p>
          </div>
        </div>

        <pre className="overflow-x-auto border border-[#6f5636] bg-black/25 p-4 text-sm text-[#e5dac5]">
          {snapshot.fen}
        </pre>
      </section>
    </main>
  );
}
