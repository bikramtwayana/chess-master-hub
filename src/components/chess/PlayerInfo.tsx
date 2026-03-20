import { PIECE_UNICODE, formatTime } from '@/lib/chess-utils';
import { cn } from '@/lib/utils';
import type { PieceSymbol } from 'chess.js';

type Props = {
  name: string;
  color: 'w' | 'b';
  time: number;
  isActive: boolean;
  captured: string[];
};

const PIECE_ORDER: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p'];

export default function PlayerInfo({ name, color, time, isActive, captured }: Props) {
  const sortedCaptured = [...captured].sort(
    (a, b) => PIECE_ORDER.indexOf(a as PieceSymbol) - PIECE_ORDER.indexOf(b as PieceSymbol)
  );

  // Captured pieces are shown in the color of the opponent (pieces this player took)
  const capturedColor = color === 'w' ? 'b' : 'w';

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-secondary border border-primary/30 shadow-md shadow-primary/5'
          : 'bg-card border border-border'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm',
            color === 'w'
              ? 'bg-white border-neutral-300 text-black'
              : 'bg-neutral-800 border-neutral-600 text-white'
          )}
        >
          {color === 'w' ? '♔' : '♚'}
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <div className="flex gap-0 text-base leading-none mt-0.5 opacity-80">
            {sortedCaptured.map((p, i) => (
              <span
                key={i}
                className={cn(
                  '-mr-0.5',
                  capturedColor === 'w' ? 'chess-piece-white' : 'chess-piece-black'
                )}
              >
                {PIECE_UNICODE[capturedColor][p as PieceSymbol]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'font-mono text-lg font-semibold px-3 py-1.5 rounded-md tabular-nums',
          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
          time <= 30 && isActive && 'text-destructive bg-destructive/10'
        )}
      >
        {formatTime(time)}
      </div>
    </div>
  );
}
