import { getPieceImageUrl, formatTime } from '@/lib/chess-utils';
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
            'w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden',
            color === 'w'
              ? 'bg-foreground/90 border-foreground/20'
              : 'bg-background border-foreground/30'
          )}
        >
          <img
            src={getPieceImageUrl(color, 'k')}
            alt={color === 'w' ? 'White' : 'Black'}
            className="w-6 h-6"
          />
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <div className="flex gap-0 leading-none mt-0.5 opacity-80">
            {sortedCaptured.map((p, i) => (
              <img
                key={i}
                src={getPieceImageUrl(capturedColor, p as PieceSymbol)}
                alt={p}
                className="w-4 h-4 -mr-0.5"
              />
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
