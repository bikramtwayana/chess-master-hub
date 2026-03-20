import { Move } from 'chess.js';
import { useEffect, useRef } from 'react';

type Props = {
  moves: Move[];
};

export default function MoveHistory({ moves }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves.length]);

  const pairs: { num: number; white?: string; black?: string }[] = [];
  moves.forEach((m, i) => {
    if (i % 2 === 0) {
      pairs.push({ num: Math.floor(i / 2) + 1, white: m.san });
    } else {
      pairs[pairs.length - 1].black = m.san;
    }
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-border">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Moves
        </h3>
      </div>
      <div ref={scrollRef} className="max-h-48 overflow-y-auto p-2">
        {pairs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No moves yet</p>
        ) : (
          <div className="grid grid-cols-[2rem_1fr_1fr] gap-y-0.5 text-sm font-mono">
            {pairs.map((pair) => (
              <div key={pair.num} className="contents">
                <span className="text-muted-foreground pr-1 text-right">{pair.num}.</span>
                <span className="px-2 py-0.5 rounded hover:bg-muted/50 cursor-default">
                  {pair.white}
                </span>
                <span className="px-2 py-0.5 rounded hover:bg-muted/50 cursor-default">
                  {pair.black || ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
