import { Monitor, Users, Settings, Info } from 'lucide-react';
import { GameMode } from '@/lib/chess-utils';

type Props = {
  onSelectMode: (mode: GameMode) => void;
};

export default function Home({ onSelectMode }: Props) {
  const items = [
    { icon: Monitor, label: 'Play with Computer', action: () => onSelectMode('computer') },
    { icon: Users, label: 'Play with Friends', action: () => onSelectMode('friend') },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: Info, label: 'About', action: () => {} },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-secondary/50 active:scale-[0.97] transition-all duration-150"
            >
              <item.icon className="w-7 h-7 text-foreground" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
