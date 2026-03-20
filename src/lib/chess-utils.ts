import { Chess, Square, PieceSymbol, Color } from 'chess.js';

export type TimeControl = {
  name: string;
  category: 'bullet' | 'blitz' | 'classical' | 'custom';
  timeInSeconds: number;
  incrementInSeconds: number;
};

export const TIME_CONTROLS: TimeControl[] = [
  { name: '1+0', category: 'bullet', timeInSeconds: 60, incrementInSeconds: 0 },
  { name: '2+1', category: 'bullet', timeInSeconds: 120, incrementInSeconds: 1 },
  { name: '3+0', category: 'blitz', timeInSeconds: 180, incrementInSeconds: 0 },
  { name: '3+2', category: 'blitz', timeInSeconds: 180, incrementInSeconds: 2 },
  { name: '5+0', category: 'blitz', timeInSeconds: 300, incrementInSeconds: 0 },
  { name: '5+3', category: 'blitz', timeInSeconds: 300, incrementInSeconds: 3 },
  { name: '10+0', category: 'classical', timeInSeconds: 600, incrementInSeconds: 0 },
  { name: '15+10', category: 'classical', timeInSeconds: 900, incrementInSeconds: 10 },
  { name: '30+0', category: 'classical', timeInSeconds: 1800, incrementInSeconds: 0 },
];

export type GameMode = 'friend' | 'computer';

export type ComputerLevel = 1 | 2 | 3 | 4 | 5;

export const COMPUTER_LEVELS: { level: ComputerLevel; name: string; elo: string }[] = [
  { level: 1, name: 'Beginner', elo: '~800' },
  { level: 2, name: 'Easy', elo: '~1200' },
  { level: 3, name: 'Medium', elo: '~1600' },
  { level: 4, name: 'Hard', elo: '~2000' },
  { level: 5, name: 'Expert', elo: '~2400' },
];

export const PIECE_UNICODE: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

export function squareColor(square: Square): 'light' | 'dark' {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  return (file + rank) % 2 === 0 ? 'dark' : 'light';
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getStockfishDepth(level: ComputerLevel): number {
  const depths: Record<ComputerLevel, number> = {
    1: 1,
    2: 3,
    3: 6,
    4: 10,
    5: 15,
  };
  return depths[level];
}

export function getStockfishSkillLevel(level: ComputerLevel): number {
  const skills: Record<ComputerLevel, number> = {
    1: 0,
    2: 5,
    3: 10,
    4: 15,
    5: 20,
  };
  return skills[level];
}
