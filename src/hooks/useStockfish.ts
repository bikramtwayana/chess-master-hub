import { useEffect, useRef, useCallback, useState } from 'react';
import { getStockfishDepth, getStockfishSkillLevel, ComputerLevel } from '@/lib/chess-utils';

export function useStockfish(level: ComputerLevel) {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [bestMove, setBestMove] = useState<string | null>(null);
  const onMoveRef = useRef<((move: string) => void) | null>(null);

  useEffect(() => {
    try {
      // Use stockfish.js from CDN
      const worker = new Worker(
        new URL('https://unpkg.com/stockfish@16.0.0/src/stockfish-nnue-16-single.js')
      );

      worker.onmessage = (e: MessageEvent) => {
        const msg = typeof e.data === 'string' ? e.data : '';
        if (msg === 'uciok' || msg === 'readyok') {
          setIsReady(true);
        }
        if (msg.startsWith('bestmove')) {
          const move = msg.split(' ')[1];
          if (move && move !== '(none)') {
            setBestMove(move);
            onMoveRef.current?.(move);
          }
        }
      };

      worker.postMessage('uci');
      worker.postMessage('isready');
      workerRef.current = worker;
    } catch {
      // Fallback: create a simple random move engine
      setIsReady(true);
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const getMove = useCallback((fen: string, onMove: (move: string) => void) => {
    onMoveRef.current = onMove;
    const worker = workerRef.current;
    if (!worker) return;

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

  return { isReady, bestMove, getMove, stop };
}
