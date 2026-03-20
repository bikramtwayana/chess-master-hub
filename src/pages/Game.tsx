import { useChessGame } from '@/hooks/useChessGame';
import ChessBoard from '@/components/chess/ChessBoard';
import PlayerInfo from '@/components/chess/PlayerInfo';
import MoveHistory from '@/components/chess/MoveHistory';
import GameOverDialog from '@/components/chess/GameOverDialog';
import { GameMode, ComputerLevel, TimeControl } from '@/lib/chess-utils';
import { ArrowLeft, RotateCcw } from 'lucide-react';

type Props = {
  mode: GameMode;
  playerColor: 'w' | 'b';
  computerLevel: ComputerLevel;
  timeControl: TimeControl;
  onBack: () => void;
};

export default function Game({ mode, playerColor, computerLevel, timeControl, onBack }: Props) {
  const { state, selectSquare, resetGame } = useChessGame({
    mode,
    playerColor,
    computerLevel,
    timeControl,
  });

  const flipped = playerColor === 'b';
  const topColor = flipped ? 'w' : 'b';
  const bottomColor = flipped ? 'b' : 'w';

  const topName =
    topColor === 'w'
      ? mode === 'computer' && playerColor === 'b'
        ? `Stockfish (Lv ${computerLevel})`
        : 'White'
      : mode === 'computer' && playerColor === 'w'
        ? `Stockfish (Lv ${computerLevel})`
        : 'Black';

  const bottomName =
    bottomColor === 'w'
      ? mode === 'computer' && playerColor === 'b'
        ? `Stockfish (Lv ${computerLevel})`
        : 'White'
      : mode === 'computer' && playerColor === 'w'
        ? `Stockfish (Lv ${computerLevel})`
        : 'Black';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6 items-center lg:items-start">
        {/* Board area */}
        <div className="flex flex-col gap-3 w-full max-w-[min(90vw,480px)]">
          <PlayerInfo
            name={topName}
            color={topColor}
            time={topColor === 'w' ? state.whiteTime : state.blackTime}
            isActive={state.turn === topColor && !state.isGameOver}
            captured={topColor === 'w' ? state.capturedByWhite : state.capturedByBlack}
          />

          <ChessBoard state={state} onSquareClick={selectSquare} flipped={flipped} />

          <PlayerInfo
            name={bottomName}
            color={bottomColor}
            time={bottomColor === 'w' ? state.whiteTime : state.blackTime}
            isActive={state.turn === bottomColor && !state.isGameOver}
            captured={bottomColor === 'w' ? state.capturedByWhite : state.capturedByBlack}
          />
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-3 w-full lg:w-64 lg:mt-14">
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-secondary active:scale-[0.97] transition-all duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-secondary active:scale-[0.97] transition-all duration-150"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              {mode === 'computer' ? `vs Computer • Lv ${computerLevel}` : 'Friend Match'}
            </p>
            <p className="text-sm font-mono text-foreground">
              {timeControl.name} • {timeControl.category}
            </p>
          </div>

          <MoveHistory moves={state.moveHistory} />

          {state.isCheck && !state.isCheckmate && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2 text-sm text-destructive font-medium text-center animate-in fade-in duration-200">
              Check!
            </div>
          )}
        </div>
      </div>

      <GameOverDialog
        state={state}
        onNewGame={() => {
          resetGame();
        }}
      />
    </div>
  );
}
