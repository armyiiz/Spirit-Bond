import React from 'react';
import { Backpack, Sparkles, HeartHandshake, Dumbbell, Swords, Map, ShoppingCart, Settings } from 'lucide-react';

export type ConsoleMode = 'idle' | 'care' | 'train' | 'battle';
export type ModalType = 'bag' | 'evo' | 'explore' | 'shop' | 'settings' | 'status' | null;

interface TopNavigationProps {
  onModeChange: (mode: ConsoleMode) => void;
  onOpenModal: (modal: ModalType) => void;
  disabled?: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onModeChange, onOpenModal, disabled }) => {
  const buttons = [
    { id: 'battle', label: 'ต่อสู้', icon: Swords, color: 'text-red-400', type: 'console', target: 'battle' },
    { id: 'train', label: 'ฝึกฝน', icon: Dumbbell, color: 'text-orange-400', type: 'console', target: 'train' },
    { id: 'care', label: 'ดูแล', icon: HeartHandshake, color: 'text-pink-400', type: 'console', target: 'care' },
    { id: 'explore', label: 'สำรวจ', icon: Map, color: 'text-emerald-400', type: 'modal', target: 'explore' },
    { id: 'bag', label: 'กระเป๋า', icon: Backpack, color: 'text-amber-400', type: 'modal', target: 'bag' },
    { id: 'shop', label: 'ร้านค้า', icon: ShoppingCart, color: 'text-blue-400', type: 'modal', target: 'shop' },
    { id: 'evo', label: 'วิวัฒนาการ', icon: Sparkles, color: 'text-purple-400', type: 'modal', target: 'evo' },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings, color: 'text-slate-400', type: 'modal', target: 'settings' },
  ] as const;

  const handleClick = (btn: typeof buttons[number]) => {
    if (disabled) return;
    if (btn.type === 'console') {
      onModeChange(btn.target as ConsoleMode);
    } else {
      onOpenModal(btn.target as ModalType);
    }
  };

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-2">
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            data-testid={`nav-btn-${btn.id}`}
            onClick={() => handleClick(btn)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
          >
            <div className={`p-1.5 rounded-full bg-slate-800/50 border border-slate-700 ${btn.color}`}>
              <btn.icon size={18} />
            </div>
            <span className="text-[10px] font-medium text-slate-400">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopNavigation;
