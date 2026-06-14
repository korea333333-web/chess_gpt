import { createGameEngine } from "@/lib/chess/engine";
import { chooseComputerMove } from "../stockfish";

describe("computer move selection", () => {
  it.each(["beginner", "intermediate", "advanced"] as const)(
    "returns a legal move for %s difficulty",
    (difficulty) => {
      const engine = createGameEngine();
      const move = chooseComputerMove(engine.getSnapshot(), difficulty);

      expect(move).not.toBeNull();
      expect(engine.getLegalMoves(move?.from).map((legal) => legal.to)).toContain(
        move?.to
      );
    }
  );

  it("prefers a capture on intermediate and advanced difficulty", () => {
    const engine = createGameEngine(
      "rnbqkbnr/pppp1ppp/8/4p3/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 1 3"
    );

    const intermediate = chooseComputerMove(engine.getSnapshot(), "intermediate");
    const advanced = chooseComputerMove(engine.getSnapshot(), "advanced");

    expect(intermediate).toEqual(
      expect.objectContaining({ from: "e5", to: "d4" })
    );
    expect(advanced).toEqual(expect.objectContaining({ from: "e5", to: "d4" }));
  });
});
