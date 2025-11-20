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
  const [activeModal, setActiveModal] = useState<'bag' | 'evo' | 'care' | 'train' | 'battle' | 'explore' | 'shop' | null>(null);

  // Initialize Game Loop
  useGameLoop();

  // If no monster, show selection
  if (!myMonster) {
    return <StarterSelection />;
  }

  const handleCloseModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Main UI */}
      <Header />

      <div className="flex-1 flex flex-col pb-24 overflow-y-auto">
         <MonsterStage />

         {/* Placeholder content for scrolling test */}
         <div className="px-6 text-center text-slate-600 text-sm mt-4">
           <p>รักษาค่าอารมณ์และความหิวให้น้องอารมณ์ดีอยู่เสมอ</p>
           <p>พาน้องไปฝึกฝนเพื่อเพิ่มความแข็งแกร่ง!</p>
         </div>
      </div>

      <StickyToolbar onAction={setActiveModal} />

      {/* Modals */}
      {activeModal === 'care' && <CareModal onClose={handleCloseModal} />}
      {activeModal === 'train' && <TrainModal onClose={handleCloseModal} />}
      {activeModal === 'battle' && <BattleModal onClose={handleCloseModal} />}

      {/* Placeholders for other modals */}
      {['bag', 'evo', 'explore', 'shop'].includes(activeModal || '') && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-slate-800 p-8 rounded-2xl text-center">
             <h2 className="text-xl font-bold mb-2 text-slate-300">Coming Soon</h2>
             <p className="text-slate-500 mb-4">ฟีเจอร์นี้จะมาในเวอร์ชั่นถัดไป</p>
             <button onClick={handleCloseModal} className="px-4 py-2 bg-slate-600 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
