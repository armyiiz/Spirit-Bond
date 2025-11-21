import React from 'react';
import { Backpack, Sparkles, HeartHandshake, Dumbbell, Swords, Map, ShoppingCart, Settings } from 'lucide-react';

type MenuAction = 'bag' | 'evo' | 'care' | 'train' | 'battle' | 'explore' | 'shop' | 'settings';

interface StickyToolbarProps {
  onAction: (action: MenuAction) => void;
}

const StickyToolbar: React.FC<StickyToolbarProps> = ({ onAction }) => {
  const buttons = [
    { id: 'battle', icon: Swords, label: 'ต่อสู้', color: 'text-red-400' },
    { id: 'train', icon: Dumbbell, label: 'ฝึกฝน', color: 'text-orange-400' },
    { id: 'care', icon: HeartHandshake, label: 'ดูแล', color: 'text-pink-400' },
    { id: 'explore', icon: Map, label: 'สำรวจ', color: 'text-emerald-400' },
    { id: 'bag', icon: Backpack, label: 'กระเป๋า', color: 'text-amber-400' },
    { id: 'shop', icon: ShoppingCart, label: 'ร้านค้า', color: 'text-blue-400' },
    { id: 'evo', icon: Sparkles, label: 'วิวัฒนาการ', color: 'text-purple-400' },
    { id: 'settings', icon: Settings, label: 'ตั้งค่า', color: 'text-slate-400' }, // Added 8th button to balance grid
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-4 gap-2 p-4">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => onAction(btn.id as MenuAction)}
            className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <div className={`p-2 rounded-full bg-slate-800/50 border border-slate-700 ${btn.color}`}>
              <btn.icon size={20} />
            </div>
            <span className="text-[10px] font-medium text-slate-400">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickyToolbar;
