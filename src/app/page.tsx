import { createGameEngine } from "@/lib/chess/engine";
import dynamic from "next/dynamic";

const Board3D = dynamic(() => import("@/components/board/Board3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(72vh,760px)] min-h-[520px] items-center justify-center border border-[#6f5636] bg-[#18100b] text-[#d5c7ad]">
      3D 체스판을 준비하는 중입니다
    </div>
  )
});

export default function Home() {
  const snapshot = createGameEngine().getSnapshot();

  return (
    <main className="min-h-screen px-5 py-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-5">
          <div>
            <p className="text-sm uppercase text-brass">Sprint 2</p>
            <h1 className="mt-2 text-5xl font-semibold tracking-normal text-ivory">
              GAMBIT
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#d5c7ad]">
              Sprint 1의 체스 상태를 3D 체스판에 연결했습니다. 지금은
              플레이 조작 전 단계이며, 보드와 32개의 말 배치를 확인할 수
              있습니다.
            </p>
          </div>

          <Board3D snapshot={snapshot} />
        </div>

        <aside className="flex flex-col gap-5 border border-[#6f5636] bg-black/20 p-5">
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

          <div>
            <p className="text-sm text-[#a18d70]">렌더링</p>
            <p className="mt-2 text-base leading-7 text-[#d5c7ad]">
              버드아이뷰 카메라, 드래그 회전, 휠 줌 제한, 절차적 6종 기물
              형태가 적용되었습니다.
            </p>
          </div>

          <pre className="overflow-x-auto border border-[#6f5636] bg-black/25 p-4 text-sm text-[#e5dac5]">
            {snapshot.fen}
          </pre>
        </aside>
      </section>
    </main>
  );
}
