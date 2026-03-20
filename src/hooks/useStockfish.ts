import { useEffect, useRef, useCallback, useState } from 'react';
import { getStockfishDepth, getStockfishSkillLevel, ComputerLevel } from '@/lib/chess-utils';
import { Chess } from 'chess.js';

const STOCKFISH_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js',
  'https://cdn.jsdelivr.net/npm/stockfish@11.0.0/src/stockfish.js',
];

export function useStockfish(level: ComputerLevel) {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onMoveRef = useRef<((move: string) => void) | null>(null);
  const workerFailed = useRef(false);
  const engineReady = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function initWorker() {
      for (const url of STOCKFISH_URLS) {
        if (cancelled) return;
        try {
          // Fetch the script content to avoid CORS issues with importScripts
          const response = await fetch(url);
          if (!response.ok) continue;
          const scriptText = await response.text();
          const blob = new Blob([scriptText], { type: 'application/javascript' });
          const worker = new Worker(URL.createObjectURL(blob));

          const ready = await new Promise<boolean>((resolve) => {
            const timeout = setTimeout(() => resolve(false), 8000);

            worker.onmessage = (e: MessageEvent) => {
              const msg = typeof e.data === 'string' ? e.data : '';
              if (msg.includes('uciok') || msg.includes('readyok')) {
                if (!engineReady.current) {
                  engineReady.current = true;
                  clearTimeout(timeout);
                  resolve(true);
                }
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
              resolve(false);
            };

            worker.postMessage('uci');
          });

          if (ready && !cancelled) {
            workerRef.current = worker;
            worker.postMessage('isready');
            console.log('[Stockfish] Engine loaded from:', url);
            setIsReady(true);
            return;
          } else {
            worker.terminate();
          }
        } catch {
          continue;
        }
      }

      // All URLs failed
      if (!cancelled) {
        console.warn('[Stockfish] All sources failed, using fallback random moves');
        workerFailed.current = true;
        setIsReady(true);
      }
    }

    initWorker();

    return () => {
      cancelled = true;
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const getMove = useCallback((fen: string, onMove: (move: string) => void) => {
    onMoveRef.current = onMove;

    if (workerFailed.current || !workerRef.current) {
      // Fallback: random legal move
      const game = new Chess(fen);
      const moves = game.moves({ verbose: true });
      if (moves.length > 0) {
        // At least pick captures/checks preferentially for slightly smarter fallback
        const captures = moves.filter(m => m.captured);
        const checks = moves.filter(m => {
          const test = new Chess(fen);
          test.move(m);
          return test.inCheck();
        });
        const preferred = checks.length > 0 ? checks : captures.length > 0 ? captures : moves;
        const move = preferred[Math.floor(Math.random() * preferred.length)];
        const uci = move.from + move.to + (move.promotion || '');
        setTimeout(() => onMove(uci), 400);
      }
      return;
    }

    const worker = workerRef.current;
    const skillLevel = getStockfishSkillLevel(level);
    const depth = getStockfishDepth(level);

    worker.postMessage('ucinewgame');
    worker.postMessage('isready');
    worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  }, [level]);

  const stop = useCallback(() => {
    workerRef.current?.postMessage('stop');
  }, []);

  return { isReady, getMove, stop };
}
