import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  GameMode,
  ComputerLevel,
  COMPUTER_LEVELS,
  TIME_CONTROLS,
  TimeControl,
} from '@/lib/chess-utils';

type Props = {
  onStart: (config: {
    mode: GameMode;
    playerColor: 'w' | 'b';
    computerLevel: ComputerLevel;
    timeControl: TimeControl;
  }) => void;
};

export default function GameSetup({ onStart }: Props) {
  const [mode, setMode] = useState<GameMode>('friend');
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [computerLevel, setComputerLevel] = useState<ComputerLevel>(3);
  const [timeCategory, setTimeCategory] = useState<string>('blitz');
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(4); // 5+0
  const [customMinutes, setCustomMinutes] = useState(10);
  const [customIncrement, setCustomIncrement] = useState(0);

  const filteredTimes = TIME_CONTROLS.filter((tc) => tc.category === timeCategory);

  const getTimeControl = (): TimeControl => {
    if (timeCategory === 'custom') {
      return {
        name: `${customMinutes}+${customIncrement}`,
        category: 'custom',
        timeInSeconds: customMinutes * 60,
        incrementInSeconds: customIncrement,
      };
    }
    return TIME_CONTROLS[selectedTimeIndex];
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg scroll-reveal">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="text-primary">♔</span> Chess Arena
          </h1>
          <p className="text-muted-foreground">Set up your game and start playing</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-xl shadow-black/20">
          {/* Game Mode */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'friend' as const, label: 'Play a Friend', icon: '👥' },
                { value: 'computer' as const, label: 'vs Computer', icon: '🤖' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMode(opt.value)}
                  className={cn(
                    'px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-150',
                    'hover:border-primary/50 active:scale-[0.97]',
                    mode === opt.value
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  <span className="text-lg mr-2">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Computer Level */}
          {mode === 'computer' && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                Difficulty
              </label>
              <div className="grid grid-cols-5 gap-2">
                {COMPUTER_LEVELS.map((cl) => (
                  <button
                    key={cl.level}
                    onClick={() => setComputerLevel(cl.level)}
                    className={cn(
                      'px-2 py-2.5 rounded-lg border-2 text-xs font-medium transition-all duration-150',
                      'hover:border-primary/50 active:scale-[0.97] flex flex-col items-center gap-0.5',
                      computerLevel === cl.level
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    <span className="font-semibold">{cl.name}</span>
                    <span className="text-[10px] opacity-70">{cl.elo}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Play as
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'w' as const, label: 'White', symbol: '♔' },
                { value: 'b' as const, label: 'Black', symbol: '♚' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPlayerColor(opt.value)}
                  className={cn(
                    'px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-150',
                    'hover:border-primary/50 active:scale-[0.97]',
                    playerColor === opt.value
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  <span className="text-2xl mr-2">{opt.symbol}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Control */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Time Control
            </label>
            <div className="flex gap-2 mb-3">
              {['bullet', 'blitz', 'classical', 'custom'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTimeCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-150',
                    'active:scale-[0.97]',
                    timeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat === 'bullet' && '⚡ '}
                  {cat === 'blitz' && '🔥 '}
                  {cat === 'classical' && '🏛️ '}
                  {cat === 'custom' && '⚙️ '}
                  {cat}
                </button>
              ))}
            </div>

            {timeCategory !== 'custom' ? (
              <div className="grid grid-cols-3 gap-2">
                {filteredTimes.map((tc) => {
                  const idx = TIME_CONTROLS.indexOf(tc);
                  return (
                    <button
                      key={tc.name}
                      onClick={() => setSelectedTimeIndex(idx)}
                      className={cn(
                        'px-3 py-2.5 rounded-lg border-2 text-sm font-mono font-medium transition-all duration-150',
                        'hover:border-primary/50 active:scale-[0.97]',
                        selectedTimeIndex === idx
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border text-muted-foreground'
                      )}
                    >
                      {tc.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Minutes</label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Increment (sec)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={customIncrement}
                    onChange={(e) => setCustomIncrement(Number(e.target.value))}
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={() =>
              onStart({
                mode,
                playerColor,
                computerLevel,
                timeControl: getTimeControl(),
              })
            }
            className={cn(
              'w-full py-3.5 rounded-lg font-semibold text-base transition-all duration-150',
              'bg-primary text-primary-foreground',
              'hover:brightness-110 active:scale-[0.98]',
              'shadow-lg shadow-primary/20'
            )}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
