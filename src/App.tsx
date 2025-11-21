import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { useBattle } from './hooks/useBattle';

import StarterSelection from './components/StarterSelection';
import Header from './components/Header';
import MonsterStage from './components/MonsterStage';
import TopNavigation from './components/TopNavigation';
import ActionConsole, { ConsoleMode, ModalType } from './components/ActionConsole';
import StatusModal from './components/StatusModal';

// Placeholder Modals
const PlaceholderModal = ({ title, onClose }: { title: string, onClose: () => void }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl w-full max-w-xs">
       <h2 className="text-xl font-bold mb-2 text-slate-300">{title}</h2>
       <p className="text-slate-500 mb-6">Coming Soon...</p>
       <button onClick={onClose} className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold transition-colors">Close</button>
    </div>
  </div>
);

function App() {
  const { myMonster } = useGameStore();
  const [consoleMode, setConsoleMode] = useState<ConsoleMode>('idle');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Battle Hook
  const battle = useBattle();

  // Initialize Game Loop
  useGameLoop();

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

  const handleOpenModal = (modal: ModalType) => {
    setActiveModal(modal);
  };

  // If battle ends (win/lose), user should probably see the result then go back to idle
  // We need to listen to battle result to update UI state if needed,
  // but ActionConsole handles the 'Result View'.
  // If user clicks "Close" on result view, we should go back to idle.
  const handleBattleClose = () => {
    setConsoleMode('idle');
    // Ensure battle is stopped/reset if not already?
    // useBattle handles stop internally on win/lose.
  };

  // If no monster, show selection
  if (!myMonster) {
    return <StarterSelection />;
  }

  return (
    <div className="h-[100dvh] bg-slate-900 text-white flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* 1. Header (Player Info) */}
      <div className="flex-none z-20">
        <Header />
      </div>

      {/* 2. Top Navigation */}
      <div className="flex-none z-20">
        <TopNavigation onModeChange={handleModeChange} onOpenModal={handleOpenModal} />
      </div>

      {/* 3. Monster Stage (Flexible Middle) */}
      <MonsterStage
        background="bg-slate-900" // Default background for now
        onShowStatus={() => setActiveModal('status')}
        enemy={battle.isActive ? battle.enemy : null}
        enemyHp={battle.enemyHp}
        enemyMaxHp={battle.enemy?.stats.maxHp}
      />

      {/* 4. Action Console (Fixed Bottom) */}
      <div className="flex-none h-[35vh] min-h-[250px] z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <ActionConsole
          mode={consoleMode}
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

      {/* Modals */}
      {activeModal === 'status' && <StatusModal onClose={() => setActiveModal(null)} />}

      {/* Placeholders */}
      {['bag', 'evo', 'explore', 'shop', 'settings'].includes(activeModal || '') && (
        <PlaceholderModal title={(activeModal || '').toUpperCase()} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

export default App;
