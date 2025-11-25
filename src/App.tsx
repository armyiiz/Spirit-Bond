import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { useBattle } from './hooks/useBattle';

import MainMenu from './components/MainMenu';
import StarterSelection from './components/StarterSelection';
import Header from './components/Header';
import MonsterStage from './components/MonsterStage';
import TopNavigation from './components/TopNavigation';
import ActionConsole, { ConsoleMode } from './components/ActionConsole';
import StatusStrip from './components/StatusStrip';
import SleepSummaryModal from './components/SleepSummaryModal';

function App() {
  const { myMonster, clearActiveRoute } = useGameStore();
  const [isInGame, setIsInGame] = useState(false);
  const [consoleMode, setConsoleMode] = useState<ConsoleMode>('idle');

  // Battle Hook
  const battle = useBattle();

  // Initialize Game Loop
  useGameLoop();

  // On app load, check if we need to wake up
  useEffect(() => {
    useGameStore.getState().wakeUp();
  }, []);

  // Handle Navigation Logic
  const handleModeChange = (mode: ConsoleMode) => {
    if (mode === 'battle') {
      battle.startBattle();
      setConsoleMode('battle');
    } else {
      // If switching away from battle, we might need to pause/stop?
      // For now, we just switch view. Use 'flee' to stop.
      setConsoleMode(mode);
    }
  };

  // If battle ends (win/lose), user should probably see the result then go back to idle
  // We need to listen to battle result to update UI state if needed,
  // but ActionConsole handles the 'Result View'.
  // If user clicks "Close" on result view, we should go back to idle.
  const handleBattleClose = () => {
    setConsoleMode('idle');
    clearActiveRoute();
    // Ensure battle is stopped/reset if not already?
    // useBattle handles stop internally on win/lose.
  };

  // 1. Main Menu Logic
  if (!isInGame) {
     return <MainMenu onStart={() => setIsInGame(true)} />;
  }

  // 2. Starter Selection Logic (if new game)
  if (!myMonster) {
    return <StarterSelection />;
  }

  // 3. Main Game Loop
  return (
    <div className="h-[100dvh] bg-slate-900 text-white flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Overlays */}
      <SleepSummaryModal />

      {/* Header (Player Info) */}
      <div className="flex-none z-20">
        <Header />
      </div>

      {/* Top Navigation */}
      <div className="flex-none z-20">
        <TopNavigation
          onModeChange={handleModeChange}
          disabled={consoleMode === 'battle'}
        />
      </div>

      {/* Monster Stage (Flexible Middle) */}
      <div className="flex-1 bg-slate-800 relative overflow-hidden flex flex-col">
         <MonsterStage
           background="bg-slate-900"
           enemy={battle.isActive ? battle.enemy : null}
         />
         {/* Overlay Poop */}
         {(myMonster.poopCount || 0) > 0 && (
            <div className="absolute bottom-4 right-8 text-2xl animate-bounce z-10">💩</div>
         )}
      </div>

      {/* Status Strip (The Middle Bar) */}
      <StatusStrip
         myMonster={myMonster}
         enemy={battle.enemy}
         battleActive={battle.isActive}
         playerHp={consoleMode === 'battle' ? battle.playerHp : myMonster.stats.hp}
         enemyHp={battle.enemyHp}
      />

      {/* Action Console (Fixed Bottom) */}
      <div className="flex-none h-[40vh] min-h-[250px] z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <ActionConsole
          mode={consoleMode === 'battle' ? 'battle' : consoleMode}
          onModeChange={handleModeChange}
          onReturnToIdle={handleBattleClose}
          battleState={consoleMode === 'battle' ? {
            logs: battle.logs,
            isActive: battle.isActive,
            result: battle.result,
            onFlee: battle.fleeBattle,
            onRestart: handleBattleClose
          } : undefined}
        />
      </div>
    </div>
  );
}

export default App;
