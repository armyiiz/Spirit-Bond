import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import StarterSelection from './components/StarterSelection';
import Header from './components/Header';
import MonsterStage from './components/MonsterStage';
import StickyToolbar from './components/StickyToolbar';
import CareModal from './components/CareModal';
import TrainModal from './components/TrainModal';
import BattleModal from './components/BattleModal';

function App() {
  const { myMonster } = useGameStore();
  // Added 'settings' to allowed types though it's not handled yet in this list, just to match Toolbar
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Initialize Game Loop
  useGameLoop();

  // If no monster, show selection
  if (!myMonster) {
    return <StarterSelection />;
  }

  const handleCloseModal = () => setActiveModal(null);

  return (
    <div className="h-[100dvh] bg-slate-900 text-white flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Main UI */}
      <Header />

      {/* Content Area - Fills remaining space above toolbar */}
      <div className="flex-1 flex flex-col overflow-hidden pb-[140px]">
         {/* 140px padding bottom to account for the 2-row toolbar */}
         <MonsterStage />

         {/* Placeholder content */}
         <div className="flex-1 flex items-center justify-center px-6 text-center text-slate-600 text-sm">
           <div>
             <p>รักษาค่าอารมณ์และความหิวให้น้องอารมณ์ดีอยู่เสมอ</p>
             <p>พาน้องไปฝึกฝนเพื่อเพิ่มความแข็งแกร่ง!</p>
           </div>
         </div>
      </div>

      <StickyToolbar onAction={setActiveModal} />

      {/* Modals - All using centered opaque style */}
      {activeModal === 'care' && <CareModal onClose={handleCloseModal} />}
      {activeModal === 'train' && <TrainModal onClose={handleCloseModal} />}
      {activeModal === 'battle' && <BattleModal onClose={handleCloseModal} />}

      {/* Placeholders for other modals */}
      {['bag', 'evo', 'explore', 'shop', 'settings'].includes(activeModal || '') && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl w-full max-w-xs">
             <h2 className="text-xl font-bold mb-2 text-slate-300">Coming Soon</h2>
             <p className="text-slate-500 mb-6">ฟีเจอร์นี้จะมาในเวอร์ชั่นถัดไป</p>
             <button onClick={handleCloseModal} className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
