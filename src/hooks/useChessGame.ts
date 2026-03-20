import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { GameMode, ComputerLevel, TimeControl } from '@/lib/chess-utils';
import { useStockfish } from './useStockfish';

export type GameState = {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  moveHistory: Move[];
  selectedSquare: Square | null;
  possibleMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  whiteTime: number;
  blackTime: number;
  capturedByWhite: string[];
  capturedByBlack: string[];
};

type UseChessGameProps = {
  mode: GameMode;
  playerColor: 'w' | 'b';
  computerLevel: ComputerLevel;
  timeControl: TimeControl;
};

export function useChessGame({ mode, playerColor, computerLevel, timeControl }: UseChessGameProps) {
  const gameRef = useRef(new Chess());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const [state, setState] = useState<GameState>(() => ({
    fen: gameRef.current.fen(),
    turn: 'w',
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    isGameOver: false,
    moveHistory: [],
    selectedSquare: null,
    possibleMoves: [],
    lastMove: null,
    whiteTime: timeControl.timeInSeconds,
    blackTime: timeControl.timeInSeconds,
    capturedByWhite: [],
    capturedByBlack: [],
  }));

  const { getMove: getStockfishMove, isReady: stockfishReady } = useStockfish(computerLevel);

  const syncState = useCallback((extra?: Partial<GameState>) => {
    const game = gameRef.current;
    const history = game.history({ verbose: true });
    const capturedByWhite: string[] = [];
    const capturedByBlack: string[] = [];

    history.forEach((m) => {
      if (m.captured) {
        if (m.color === 'w') capturedByWhite.push(m.captured);
        else capturedByBlack.push(m.captured);
      }
    });

    setState((prev) => ({
      ...prev,
      fen: game.fen(),
      turn: game.turn(),
      isCheck: game.inCheck(),
      isCheckmate: game.isCheckmate(),
      isStalemate: game.isStalemate(),
      isDraw: game.isDraw(),
      isGameOver: game.isGameOver(),
      moveHistory: history,
      capturedByWhite,
      capturedByBlack,
      ...extra,
    }));
  }, []);

  // Timer
  useEffect(() => {
    if (!gameStarted || state.isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.isGameOver) return prev;
        const newState = { ...prev };
        if (prev.turn === 'w') {
          newState.whiteTime = Math.max(0, prev.whiteTime - 1);
          if (newState.whiteTime === 0) newState.isGameOver = true;
        } else {
          newState.blackTime = Math.max(0, prev.blackTime - 1);
          if (newState.blackTime === 0) newState.isGameOver = true;
        }
        return newState;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, state.isGameOver, state.turn]);

  // Computer move
  // Auto-start game when player is black (computer moves first)
  useEffect(() => {
    if (mode === 'computer' && playerColor === 'b' && !gameStarted && stockfishReady) {
      setGameStarted(true);
    }
  }, [mode, playerColor, gameStarted, stockfishReady]);

  // Computer move
  useEffect(() => {
    if (mode !== 'computer') return;
    if (state.isGameOver) return;
    if (state.turn === playerColor) return;
    if (!stockfishReady) return;
    if (!gameStarted) return;

    const timeout = setTimeout(() => {
      getStockfishMove(state.fen, (uciMove) => {
        const game = gameRef.current;
        const from = uciMove.slice(0, 2) as Square;
        const to = uciMove.slice(2, 4) as Square;
        const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

        try {
          game.move({ from, to, promotion: promotion as any });
          syncState({
            selectedSquare: null,
            possibleMoves: [],
            lastMove: { from, to },
          });
          // Add increment for computer
          setState((prev) => ({
            ...prev,
            ...(state.turn === 'w'
              ? { whiteTime: prev.whiteTime + timeControl.incrementInSeconds }
              : { blackTime: prev.blackTime + timeControl.incrementInSeconds }),
          }));
        } catch {
          // Invalid move from engine, ignore
        }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [mode, state.turn, state.fen, state.isGameOver, playerColor, stockfishReady, gameStarted, getStockfishMove, syncState, timeControl.incrementInSeconds]);

  const selectSquare = useCallback((square: Square) => {
    const game = gameRef.current;

    if (state.isGameOver) return;
    if (mode === 'computer' && state.turn !== playerColor) return;

    // If a piece is already selected and this is a valid target, make the move
    if (state.selectedSquare) {
      const validMove = state.possibleMoves.includes(square);
      if (validMove) {
        try {
          // Check for promotion
          const piece = game.get(state.selectedSquare);
          const isPromotion =
            piece?.type === 'p' &&
            ((piece.color === 'w' && square[1] === '8') ||
              (piece.color === 'b' && square[1] === '1'));

          game.move({
            from: state.selectedSquare,
            to: square,
            promotion: isPromotion ? 'q' : undefined,
          });

          if (!gameStarted) setGameStarted(true);

          // Add increment
          setState((prev) => ({
            ...prev,
            ...(state.turn === 'w'
              ? { whiteTime: prev.whiteTime + timeControl.incrementInSeconds }
              : { blackTime: prev.blackTime + timeControl.incrementInSeconds }),
          }));

          syncState({
            selectedSquare: null,
            possibleMoves: [],
            lastMove: { from: state.selectedSquare, to: square },
          });
          return;
        } catch {
          // Invalid move
        }
      }
    }

    // Select this square if it has a piece of the current turn
    const piece = game.get(square);
    if (piece && piece.color === state.turn) {
      const moves = game.moves({ square, verbose: true });
      setState((prev) => ({
        ...prev,
        selectedSquare: square,
        possibleMoves: moves.map((m) => m.to as Square),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        selectedSquare: null,
        possibleMoves: [],
      }));
    }
  }, [state.selectedSquare, state.possibleMoves, state.turn, state.isGameOver, mode, playerColor, gameStarted, syncState, timeControl.incrementInSeconds]);

  const resetGame = useCallback(() => {
    gameRef.current = new Chess();
    setGameStarted(false);
    setState({
      fen: gameRef.current.fen(),
      turn: 'w',
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      isDraw: false,
      isGameOver: false,
      moveHistory: [],
      selectedSquare: null,
      possibleMoves: [],
      lastMove: null,
      whiteTime: timeControl.timeInSeconds,
      blackTime: timeControl.timeInSeconds,
      capturedByWhite: [],
      capturedByBlack: [],
    });
  }, [timeControl.timeInSeconds]);

  return { state, selectSquare, resetGame };
}
