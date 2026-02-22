import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';

interface MarketListProps {
  onBack: () => void;
}

export default function MarketList({ onBack }: MarketListProps) {
  const { player, listItem } = useGame();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(10);
  const [isSelecting, setIsSelecting] = useState(false);

  const selectedItem = player.inventory.find(i => i.id === selectedItemId);

  const handleConfirm = () => {
    if (!selectedItemId) return;
    if (listItem(selectedItemId, amount, price)) {
      onBack();
    }
  };

  const handleMax = () => {
    if (selectedItem) {
      setAmount(selectedItem.count);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-slate-100 font-body">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-surface-dark border-b border-white/5 sticky top-0 z-20">
        <button onClick={onBack} className="text-white/70 hover:text-primary transition-colors p-1 rounded-full hover:bg-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-wide text-white">上架物品</h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6 space-y-6">
        {/* Section: Item Selection */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-white/60">选择物品</h2>
            <span className="text-xs text-primary font-display">背包容量: {player.inventory.length}/100</span>
          </div>

          {selectedItem ? (
            <div className="relative group cursor-pointer" onClick={() => setIsSelecting(true)}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-surface-dark border border-primary/30 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-black/20">
                {/* Item Icon */}
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-slate-900 to-black border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                  <span className={`material-symbols-outlined text-3xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`} style={{ color: selectedItem.color === 'primary' ? '#13ec5b' : selectedItem.color }}>
                    {selectedItem.icon}
                  </span>
                </div>
                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold truncate" style={{ color: selectedItem.color === 'primary' ? '#13ec5b' : selectedItem.color }}>{selectedItem.name}</h3>
                    <button className="text-xs text-white/40 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30 transition-colors">更换</button>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-1 mt-1">{selectedItem.desc}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">{selectedItem.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">{selectedItem.quality}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsSelecting(true)}
              className="w-full bg-surface-dark border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-primary hover:border-primary/30 transition-all"
            >
              <span className="material-symbols-outlined text-4xl">add_circle</span>
              <span className="text-sm font-medium">点击选择要上架的物品</span>
            </button>
          )}
        </section>

        {selectedItem && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Section: Settings */}
            <section className="space-y-4">
              {/* Quantity Input */}
              <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-white/80">出售数量</label>
                  <span className="text-xs text-white/40">拥有: <span className="text-white font-display">{selectedItem.count}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setAmount(Math.max(1, amount - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">remove</span>
                  </button>
                  <div className="flex-1 relative">
                    <input 
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-center text-white font-display text-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none" 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(Math.min(selectedItem.count, Math.max(1, parseInt(e.target.value) || 1)))}
                    />
                  </div>
                  <button 
                    onClick={() => setAmount(Math.min(selectedItem.count, amount + 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                  <button 
                    onClick={handleMax}
                    className="h-10 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold border border-primary/20 uppercase tracking-wide transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Price Input */}
              <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-white/80">单价 (灵石)</label>
                  <span className="text-xs text-white/40">参考价: <span className="text-white font-display">45~55</span></span>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                    <span className="material-symbols-outlined text-lg">diamond</span>
                  </div>
                  <input 
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-left text-white font-display text-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-white/20" 
                    placeholder="设定单价" 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>
            </section>

            {/* Section: Summary */}
            <section className="bg-black/20 rounded-xl p-5 border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">商品总价</span>
                <span className="font-display text-white">{amount * price}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50 flex items-center gap-1">
                  宗门税费 <span className="text-[10px] px-1 bg-red-500/20 text-red-400 rounded">5%</span>
                </span>
                <span className="font-display text-red-400">-{Math.floor(amount * price * 0.05)}</span>
              </div>
              <div className="h-px bg-white/10 my-1"></div>
              <div className="flex justify-between items-end">
                <span className="text-white/80 text-sm font-medium pb-1">预计收入</span>
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-xl fill-current">diamond</span>
                  <span className="font-display text-3xl font-bold leading-none">{amount * price - Math.floor(amount * price * 0.05)}</span>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </main>

      {/* Floating Action Area */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-2 pt-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-10 max-w-md mx-auto">
        <button 
          disabled={!selectedItemId}
          onClick={handleConfirm}
          className={`w-full font-bold text-lg py-3.5 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group ${
            selectedItemId ? 'bg-primary text-black shadow-[0_0_20px_rgba(19,236,91,0.3)]' : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
        >
          <span>确认上架</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>

      {/* Item Selection Modal */}
      <AnimatePresence>
        {isSelecting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setIsSelecting(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-surface-dark rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">选择物品</h3>
                <button onClick={() => setIsSelecting(false)} className="text-white/40 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {player.inventory.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setAmount(1);
                      setIsSelecting(false);
                    }}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedItemId === item.id ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ color: item.color === 'primary' ? '#13ec5b' : item.color }}>{item.icon}</span>
                    <span className="text-[10px] font-bold truncate w-full px-1">{item.name}</span>
                    <span className="text-[8px] opacity-50">x{item.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
