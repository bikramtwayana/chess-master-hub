import { Chess, Square } from 'chess.js';
import { PIECE_UNICODE, squareColor } from '@/lib/chess-utils';
import { GameState } from '@/hooks/useChessGame';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

type Props = {
  state: GameState;
  onSquareClick: (square: Square) => void;
  flipped: boolean;
};

export default function ChessBoard({ state, onSquareClick, flipped }: Props) {
  const { Chess } = require('chess.js');
  const game = new Chess(state.fen);

  const files = flipped ? [...FILES].reverse() : FILES;
  const ranks = flipped ? [...RANKS].reverse() : RANKS;

  return (
    <div className="relative">
      <div className="grid grid-cols-8 rounded-lg overflow-hidden shadow-2xl border-2 border-border">
        {ranks.map((rank, ri) =>
          files.map((file, fi) => {
            const square = `${file}${rank}` as Square;
            const piece = game.get(square);
            const color = squareColor(square);
            const isSelected = state.selectedSquare === square;
            const isPossible = state.possibleMoves.includes(square);
            const isLastMove =
              state.lastMove?.from === square || state.lastMove?.to === square;
            const isCheck =
              state.isCheck &&
              piece?.type === 'k' &&
              piece?.color === state.turn;

            return (
              <button
                key={square}
                onClick={() => onSquareClick(square)}
                className={cn(
                  'relative aspect-square flex items-center justify-center transition-colors duration-100',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  color === 'light' ? 'bg-board-light' : 'bg-board-dark',
                  isSelected && 'ring-2 ring-inset ring-board-highlight brightness-110',
                  isLastMove && 'brightness-110',
                  isCheck && 'bg-board-check'
                )}
                style={{
                  ...(isLastMove && !isSelected
                    ? {
                        backgroundColor: `hsl(var(--board-last-move) / 0.35)`,
                      }
                    : {}),
                }}
              >
                {/* Coordinate labels */}
                {fi === 0 && (
                  <span
                    className={cn(
                      'absolute top-0.5 left-1 text-[10px] font-mono font-medium leading-none',
                      color === 'light' ? 'text-board-dark/70' : 'text-board-light/70'
                    )}
                  >
                    {rank}
                  </span>
                )}
                {ri === 7 && (
                  <span
                    className={cn(
                      'absolute bottom-0.5 right-1 text-[10px] font-mono font-medium leading-none',
                      color === 'light' ? 'text-board-dark/70' : 'text-board-light/70'
                    )}
                  >
                    {file}
                  </span>
                )}

                {/* Possible move indicator */}
                {isPossible && !piece && (
                  <div className="w-[30%] h-[30%] rounded-full bg-board-possible/40" />
                )}
                {isPossible && piece && (
                  <div className="absolute inset-0 rounded-none border-[3px] border-board-possible/60" />
                )}

                {/* Piece */}
                {piece && (
                  <span
                    className={cn(
                      'chess-piece text-[clamp(1.8rem,5vw,3.2rem)] leading-none',
                      isSelected && 'animate-piece-place'
                    )}
                    style={{
                      textShadow:
                        piece.color === 'w'
                          ? '0 1px 3px rgba(0,0,0,0.4)'
                          : '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {PIECE_UNICODE[piece.color][piece.type]}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
