import { useState } from 'react';
import GameSetup from '@/components/chess/GameSetup';
import Game from '@/pages/Game';
import { GameMode, ComputerLevel, TimeControl } from '@/lib/chess-utils';

type GameConfig = {
  mode: GameMode;
  playerColor: 'w' | 'b';
  computerLevel: ComputerLevel;
  timeControl: TimeControl;
};

export default function Index() {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  if (gameConfig) {
    return (
      <Game
        mode={gameConfig.mode}
        playerColor={gameConfig.playerColor}
        computerLevel={gameConfig.computerLevel}
        timeControl={gameConfig.timeControl}
        onBack={() => setGameConfig(null)}
      />
    );
  }

  return <GameSetup onStart={setGameConfig} />;
}
