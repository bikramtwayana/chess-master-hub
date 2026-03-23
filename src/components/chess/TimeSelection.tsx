import { ArrowLeft } from 'lucide-react';
import { TimeControl } from '@/lib/chess-utils';

const TIME_OPTIONS: { time: string; label: string; seconds: number; increment: number }[] = [
  { time: '1+0', label: 'Bullet', seconds: 60, increment: 0 },
  { time: '2+1', label: 'Bullet', seconds: 120, increment: 1 },
  { time: '3+0', label: 'Blitz', seconds: 180, increment: 0 },
  { time: '3+2', label: 'Blitz', seconds: 180, increment: 2 },
  { time: '5+0', label: 'Blitz', seconds: 300, increment: 0 },
  { time: '5+3', label: 'Blitz', seconds: 300, increment: 3 },
  { time: '10+0', label: 'Rapid', seconds: 600, increment: 0 },
  { time: '10+5', label: 'Rapid', seconds: 600, increment: 5 },
  { time: '15+10', label: 'Rapid', seconds: 900, increment: 10 },
  { time: '30+0', label: 'Classical', seconds: 1800, increment: 0 },
  { time: '30+20', label: 'Classical', seconds: 1800, increment: 20 },
  { time: 'Custom', label: 'Custom', seconds: 600, increment: 0 },
];

type Props = {
  onSelect: (tc: TimeControl) => void;
  onBack: () => void;
};

export default function TimeSelection({ onSelect, onBack }: Props) {
  const handleSelect = (opt: typeof TIME_OPTIONS[number]) => {
    onSelect({
      name: opt.time,
      category: opt.label.toLowerCase() as TimeControl['category'],
      timeInSeconds: opt.seconds,
      incrementInSeconds: opt.increment,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-3 gap-3">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.time}
              onClick={() => handleSelect(opt)}
              className="flex flex-col items-center justify-center gap-1 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-secondary/50 active:scale-[0.97] transition-all duration-150"
            >
              <span className="text-sm font-semibold text-foreground">{opt.time}</span>
              <span className="text-xs text-muted-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
