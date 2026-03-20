import { GameState } from '@/hooks/useChessGame';

type Props = {
  state: GameState;
  onNewGame: () => void;
};

export default function GameOverDialog({ state, onNewGame }: Props) {
  if (!state.isGameOver && state.whiteTime > 0 && state.blackTime > 0) return null;

  let title = 'Game Over';
  let description = '';

  if (state.isCheckmate) {
    const winner = state.turn === 'w' ? 'Black' : 'White';
    title = 'Checkmate!';
    description = `${winner} wins by checkmate`;
  } else if (state.isStalemate) {
    title = 'Stalemate';
    description = 'The game is a draw by stalemate';
  } else if (state.isDraw) {
    title = 'Draw';
    description = 'The game ended in a draw';
  } else if (state.whiteTime <= 0) {
    title = 'Time Out!';
    description = 'Black wins on time';
  } else if (state.blackTime <= 0) {
    title = 'Time Out!';
    description = 'White wins on time';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl p-8 text-center max-w-sm mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <button
          onClick={onNewGame}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 active:scale-[0.97] transition-all duration-150 shadow-lg shadow-primary/20"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
