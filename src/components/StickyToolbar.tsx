import React from 'react';
import { Backpack, Sparkles, HeartHandshake, Dumbbell, Swords, Map, ShoppingCart } from 'lucide-react';

type MenuAction = 'bag' | 'evo' | 'care' | 'train' | 'battle' | 'explore' | 'shop';

interface StickyToolbarProps {
  onAction: (action: MenuAction) => void;
}

const StickyToolbar: React.FC<StickyToolbarProps> = ({ onAction }) => {
  const buttons = [
    { id: 'bag', icon: Backpack, label: 'กระเป๋า', color: 'text-amber-400' },
    { id: 'evo', icon: Sparkles, label: 'วิวัฒนาการ', color: 'text-purple-400' },
    { id: 'care', icon: HeartHandshake, label: 'ดูแล', color: 'text-pink-400' },
    { id: 'train', icon: Dumbbell, label: 'ฝึกฝน', color: 'text-orange-400' },
    { id: 'battle', icon: Swords, label: 'ต่อสู้', color: 'text-red-400' },
    { id: 'explore', icon: Map, label: 'สำรวจ', color: 'text-emerald-400' },
    { id: 'shop', icon: ShoppingCart, label: 'ร้านค้า', color: 'text-blue-400' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 pb-safe pt-2 z-50 shadow-2xl">
      <div className="flex overflow-x-auto no-scrollbar px-4 gap-6 pb-4 justify-between md:justify-center">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => onAction(btn.id as MenuAction)}
            className="flex flex-col items-center gap-1 min-w-[60px] hover:opacity-80 transition-opacity"
          >
            <div className={`p-3 bg-slate-800 rounded-2xl border border-slate-700 shadow-sm ${btn.color}`}>
              <btn.icon size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-300">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickyToolbar;
