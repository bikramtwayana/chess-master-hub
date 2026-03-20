import { useEffect, useRef, useCallback, useState } from 'react';
import { getStockfishDepth, getStockfishSkillLevel, ComputerLevel } from '@/lib/chess-utils';
import { Chess } from 'chess.js';

export function useStockfish(level: ComputerLevel) {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onMoveRef = useRef<((move: string) => void) | null>(null);
  const workerFailed = useRef(false);

  useEffect(() => {
    try {
      const blob = new Blob(
        [`importScripts('https://unpkg.com/stockfish@16.0.0/src/stockfish-nnue-16-single.js');`],
        { type: 'application/javascript' }
      );
      const worker = new Worker(URL.createObjectURL(blob));

      const timeout = setTimeout(() => {
        // If not ready after 5s, fall back to random moves
        if (!workerFailed.current) {
          workerFailed.current = true;
          setIsReady(true);
        }
      }, 5000);

      worker.onmessage = (e: MessageEvent) => {
        const msg = typeof e.data === 'string' ? e.data : '';
        if (msg === 'uciok' || msg === 'readyok') {
          clearTimeout(timeout);
          setIsReady(true);
        }
        if (msg.startsWith('bestmove')) {
          const move = msg.split(' ')[1];
          if (move && move !== '(none)') {
            onMoveRef.current?.(move);
          }
        }
      };

      worker.onerror = () => {
        clearTimeout(timeout);
        workerFailed.current = true;
        setIsReady(true);
      };

      worker.postMessage('uci');
      worker.postMessage('isready');
      workerRef.current = worker;
    } catch {
      workerFailed.current = true;
      setIsReady(true);
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const getMove = useCallback((fen: string, onMove: (move: string) => void) => {
    onMoveRef.current = onMove;

    // If worker failed, use random legal move with slight delay
    if (workerFailed.current || !workerRef.current) {
      const game = new Chess(fen);
      const moves = game.moves({ verbose: true });
      if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        const uci = move.from + move.to + (move.promotion || '');
        setTimeout(() => onMove(uci), 400);
      }
      return;
    }

    const worker = workerRef.current;
    const skillLevel = getStockfishSkillLevel(level);
    const depth = getStockfishDepth(level);

    worker.postMessage('ucinewgame');
    worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  }, [level]);

  const stop = useCallback(() => {
    workerRef.current?.postMessage('stop');
  }, []);

  return { isReady, getMove, stop };
}
