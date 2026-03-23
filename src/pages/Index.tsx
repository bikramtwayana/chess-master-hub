import { useState } from 'react';
import Home from '@/components/chess/Home';
import TimeSelection from '@/components/chess/TimeSelection';
import Game from '@/pages/Game';
import { GameMode, ComputerLevel, TimeControl } from '@/lib/chess-utils';

type Screen = 'home' | 'time-select' | 'game';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<GameMode>('friend');
  const [timeControl, setTimeControl] = useState<TimeControl | null>(null);

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setScreen('time-select');
  };

  const handleTimeSelect = (tc: TimeControl) => {
    setTimeControl(tc);
    setScreen('game');
  };

  if (screen === 'game' && timeControl) {
    return (
      <Game
        mode={mode}
        playerColor="w"
        computerLevel={3}
        timeControl={timeControl}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'time-select') {
    return <TimeSelection onSelect={handleTimeSelect} onBack={() => setScreen('home')} />;
  }

  return <Home onSelectMode={handleModeSelect} />;
}
