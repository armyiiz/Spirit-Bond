import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { useBattleSystem } from './hooks/useBattleSystem';
import StarterSelection from './components/StarterSelection';
import Header from './components/Header';
import MonsterStage from './components/MonsterStage';
import ActionConsole, { ConsoleMode } from './components/ActionConsole';
import TopMenu from './components/TopMenu';
import StatusModal from './components/StatusModal';
import { X } from 'lucide-react';

function App() {
  const { myMonster } = useGameStore();
  const { battleState, startBattle, surrender, resetBattle } = useBattleSystem();

  // State
  const [consoleMode, setConsoleMode] = useState<ConsoleMode>('default');
  const [showStatus, setShowStatus] = useState(false);
  const [background, setBackground] = useState('bg-slate-900'); // Default bg

  // Full Screen Modals
  const [activeModal, setActiveModal] = useState<'bag' | 'shop' | 'evo' | 'wiki' | null>(null);

  // Initialize Game Loop
  useGameLoop();

  // If no monster, show selection
  if (!myMonster) {
    return <StarterSelection />;
  }

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'battle':
        if (!battleState.isActive) {
          // Start Battle Logic
          startBattle();
          setConsoleMode('battle');
        } else {
          // Return to battle view if already active
          setConsoleMode('battle');
        }
        break;
      case 'care':
      case 'train':
      case 'explore':
        setConsoleMode(action as ConsoleMode);
        break;
      case 'bag':
      case 'shop':
      case 'evo':
      case 'wiki':
        setActiveModal(action as any);
        break;
    }
  };

  const handleConsoleAction = (action: string, payload?: any) => {
     if (action === 'surrender') {
       surrender();
     }
     if (action === 'finishBattle') {
       resetBattle();
       setConsoleMode('default');
     }
     if (action === 'explore') {
       // payload is location id
       switch(payload) {
         case 'forest': setBackground('bg-emerald-900'); break;
         case 'ocean': setBackground('bg-blue-900'); break;
         case 'mountain': setBackground('bg-stone-800'); break;
         case 'volcano': setBackground('bg-red-900'); break;
       }
       setConsoleMode('default');
       // Add a log? The Console component handles its own logs usually,
       // but since logs are in useBattleSystem or local...
       // We might need a global log system later. For now, visual change is enough.
     }
     if (action === 'bath') {
       // Logic handled in component via store, just switching back
       setConsoleMode('default');
     }
  };

  // Sync Battle Background
  useEffect(() => {
     if (battleState.isActive && battleState.enemy) {
        // Override background based on enemy element
        switch(battleState.enemy.element) {
           case 'Pyro': setBackground('bg-red-950'); break;
           case 'Aqua': setBackground('bg-blue-950'); break;
           case 'Aero': setBackground('bg-sky-950'); break;
           case 'Terra': setBackground('bg-stone-900'); break;
           default: setBackground('bg-slate-900');
        }
     } else if (!battleState.isActive && consoleMode === 'default' && background.includes('-950')) {
        // Reset to default if coming back from battle (optional, or keep last location)
        setBackground('bg-slate-900');
     }
  }, [battleState.isActive, battleState.enemy]);

  return (
    <div className="h-[100dvh] bg-black text-white flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      {/* 1. Top Header & Menu */}
      <div className="flex-none z-20 relative">
         <Header />
         <TopMenu onAction={handleMenuAction} />
      </div>

      {/* 2. Middle Stage (Flexible) */}
      <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
         <MonsterStage
           background={background}
           battleState={battleState}
           onShowStatus={() => setShowStatus(true)}
         />
      </div>

      {/* 3. Bottom Action Console (Fixed Height ~35%) */}
      <div className="h-[35vh] flex-none z-30 relative">
         <ActionConsole
           mode={consoleMode}
           logs={battleState.logs} // We use battle logs as main logs for now.
                                   // Ideally we'd merge system logs + battle logs.
           battleState={battleState}
           onAction={handleConsoleAction}
           onModeChange={setConsoleMode}
         />
      </div>

      {/* --- Modals --- */}
      {showStatus && <StatusModal onClose={() => setShowStatus(false)} />}

      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl w-full max-w-xs relative">
             <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
             <h2 className="text-xl font-bold mb-2 text-slate-300 capitalize">{activeModal}</h2>
             <p className="text-slate-500 mb-6">ฟีเจอร์นี้จะมาในเวอร์ชั่นถัดไป</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
