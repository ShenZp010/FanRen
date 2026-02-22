import React, { useState } from 'react';
import { useGame, Item } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Storage() {
  const { player, useItem, discardItem } = useGame();
  const [filter, setFilter] = useState('全部');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [discardCount, setDiscardCount] = useState(1);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const categories = ['全部', '丹药', '材料', '装备', '其他'];
  
  const filteredItems = player.inventory.filter(item => {
    if (filter === '全部') return true;
    if (filter === '丹药') return item.type === 'consumable';
    if (filter === '材料') return item.type === 'material';
    if (filter === '装备') return item.type === 'equipment';
    if (filter === '其他') return item.type === 'other';
    return true;
  });

  const handleUse = () => {
    if (selectedItem) {
      useItem(selectedItem.id);
      setSelectedItem(null);
    }
  };

  const handleDiscard = () => {
    if (selectedItem) {
      if (selectedItem.count > 1 && !isDiscarding) {
        setIsDiscarding(true);
        setDiscardCount(1);
        return;
      }
      // If count is 1 or we are in discarding mode
      // Note: discardItem in GameContext currently removes the whole item.
      // I should update discardItem to handle quantity if I want to be precise, 
      // but the user just said "fill in discard quantity".
      // Let's check GameContext's discardItem first.
      discardItem(selectedItem.id); // I'll need to update this in GameContext too if I want quantity support
      setSelectedItem(null);
      setIsDiscarding(false);
    }
  };

  const confirmDiscard = () => {
    if (selectedItem) {
      discardItem(selectedItem.id, discardCount); 
      setSelectedItem(null);
      setIsDiscarding(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-4 py-3 bg-surface-dark/50 backdrop-blur-md sticky top-0 z-30 border-b border-border-dark pt-12">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold font-display tracking-tight text-white">储物袋</h1>
        </div>
        <div className="flex items-center justify-center gap-1 bg-black/20 px-3 py-1 rounded-full border border-border-dark">
          <span className="material-symbols-outlined text-primary text-[16px]">backpack</span>
          <span className="text-xs font-medium font-display text-text-secondary">{player.inventory.length}/100</span>
        </div>
      </header>

      {/* Currency Display */}
      <div className="px-4 pt-4 pb-2 flex-none">
        <div className="flex items-center justify-between bg-gradient-to-r from-surface-dark to-background-dark border border-border-dark rounded-xl p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="relative z-10">
            <p className="text-xs text-text-secondary mb-1">当前持有</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white font-display tracking-tight">{player.resources.spiritStones.toLocaleString()}</span>
              <span className="text-sm font-medium text-primary">灵石</span>
            </div>
          </div>
          <button className="relative z-10 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-black transition-all">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[65px] z-20 bg-background-dark/95 backdrop-blur-sm pt-2 pb-3 border-b border-border-dark flex-none">
        <div className="flex overflow-x-auto scrollbar-hide px-4 gap-6">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className="flex flex-col items-center gap-1 min-w-[3rem] group"
            >
              <span className={`text-sm font-bold transition-colors ${filter === cat ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>{cat}</span>
              <div className={`w-full h-0.5 rounded-full transition-all ${filter === cat ? 'bg-primary shadow-[0_0_8px_rgba(19,236,91,0.6)]' : 'bg-transparent group-hover:bg-white/20'}`}></div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Item Grid */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28 scrollbar-hide">
        <div className="grid grid-cols-6 gap-2">
          {filteredItems.map((item) => (
            <button 
              key={item.id} 
              className="flex flex-col gap-1.5 group text-left"
              onClick={() => setSelectedItem(item)}
            >
              <div className={`aspect-square bg-surface-dark rounded-lg border relative overflow-hidden transition-colors shadow-lg ${
                item.quality === '传说' ? 'border-orange-500/50 hover:border-orange-400 shadow-orange-900/10' :
                item.quality === '极品' ? 'border-purple-500/50 hover:border-purple-400' :
                item.quality === '二品' ? 'border-primary/40 hover:border-primary' :
                'border-border-dark hover:border-white/20'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  <span className={`material-symbols-outlined text-2xl ${
                    item.quality === '传说' ? 'text-orange-300' :
                    item.quality === '极品' ? 'text-purple-300' :
                    item.quality === '二品' ? 'text-primary' :
                    'text-slate-400'
                  }`}>{item.icon}</span>
                </div>
                <div className={`absolute bottom-0 right-0 backdrop-blur-sm px-1 py-0 rounded-tl-lg border-t border-l ${
                  item.quality === '传说' ? 'bg-orange-500/20 border-orange-500/30 text-orange-300' :
                  item.quality === '极品' ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' :
                  item.quality === '二品' ? 'bg-primary/10 border-primary/20 text-primary' :
                  'bg-black/40 border-white/5 text-white'
                }`}>
                  <span className="text-[8px] font-bold">{item.count}</span>
                </div>
              </div>
              <div className="space-y-0">
                <p className={`text-[10px] font-medium truncate ${
                  item.quality === '传说' ? 'text-orange-200' :
                  item.quality === '极品' ? 'text-purple-200' :
                  item.quality === '二品' ? 'text-primary/90' :
                  'text-slate-300'
                }`}>{item.name}</p>
              </div>
            </button>
          ))}
          
          {/* Empty Slots */}
          {Array.from({ length: Math.max(0, 30 - filteredItems.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-surface-dark/20 rounded-lg border border-white/5 flex items-center justify-center">
              {i === 24 && <span className="material-symbols-outlined text-white/5 text-xl">lock</span>}
            </div>
          ))}
        </div>
        <div className="h-6"></div>
      </main>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => { setSelectedItem(null); setIsDiscarding(false); }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#1c2e24] w-full max-w-sm rounded-2xl border border-border-dark shadow-2xl overflow-hidden relative" 
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-3 right-3 text-text-secondary hover:text-white z-10 p-1" 
                onClick={() => { setSelectedItem(null); setIsDiscarding(false); }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="p-6">
                {!isDiscarding ? (
                  <>
                    <div className="flex gap-4 mb-5">
                      <div className={`w-20 h-20 shrink-0 bg-surface-dark rounded-xl border flex items-center justify-center shadow-lg ${
                        selectedItem.quality === '传说' ? 'border-orange-500/50' :
                        selectedItem.quality === '极品' ? 'border-purple-500/50' :
                        'border-border-dark'
                      }`}>
                        <span className={`material-symbols-outlined text-5xl ${
                          selectedItem.quality === '传说' ? 'text-orange-300' :
                          selectedItem.quality === '极品' ? 'text-purple-300' :
                          'text-slate-400'
                        }`}>{selectedItem.icon}</span>
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <h3 className="text-xl font-bold text-white font-body">{selectedItem.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                            selectedItem.quality === '传说' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                            selectedItem.quality === '极品' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            'bg-slate-500/20 text-slate-300 border-white/10'
                          }`}>{selectedItem.quality}</span>
                          <span className="text-xs text-text-secondary">
                            {selectedItem.type === 'consumable' ? '消耗品' : 
                             selectedItem.type === 'equipment' ? '装备' : 
                             selectedItem.type === 'material' ? '材料' : '其他'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 border border-border-dark/50 mb-6">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {selectedItem.desc}
                      </p>
                      <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-xs text-text-secondary font-display">
                        <span>数量: {selectedItem.count}</span>
                        {selectedItem.price && <span>售价: {selectedItem.price} 灵石</span>}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        className="flex-1 py-3 px-4 rounded-lg border border-border-dark text-text-secondary hover:bg-white/5 hover:text-white transition-colors font-medium" 
                        onClick={handleDiscard}
                      >
                        丢弃
                      </button>
                      {selectedItem.type === 'consumable' && (
                        <button 
                          className="flex-1 py-3 px-4 rounded-lg bg-primary text-black font-bold shadow-[0_0_15px_rgba(19,236,91,0.3)] hover:shadow-[0_0_20px_rgba(19,236,91,0.5)] hover:bg-[#34f574] transition-all"
                          onClick={handleUse}
                        >
                          使用
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-4">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400">delete_forever</span>
                      确认丢弃 {selectedItem.name}？
                    </h3>
                    <div className="bg-black/20 rounded-xl p-6 border border-white/5 mb-6">
                      <p className="text-xs text-slate-400 mb-4 uppercase tracking-widest text-center">选择丢弃数量 (最大: {selectedItem.count})</p>
                      <div className="flex items-center justify-center gap-6">
                        <button 
                          className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                          onClick={() => setDiscardCount(Math.max(1, discardCount - 1))}
                        >
                          <span className="material-symbols-outlined">remove</span>
                        </button>
                        <div className="flex flex-col items-center">
                          <input 
                            type="number" 
                            className="bg-transparent text-3xl font-bold text-white text-center w-20 focus:outline-none"
                            value={discardCount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) setDiscardCount(Math.min(selectedItem.count, Math.max(1, val)));
                            }}
                          />
                        </div>
                        <button 
                          className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                          onClick={() => setDiscardCount(Math.min(selectedItem.count, discardCount + 1))}
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <button 
                          className="flex-1 py-1.5 rounded-lg bg-white/5 text-[10px] text-slate-400 font-bold uppercase"
                          onClick={() => setDiscardCount(Math.floor(selectedItem.count / 2) || 1)}
                        >
                          一半
                        </button>
                        <button 
                          className="flex-1 py-1.5 rounded-lg bg-white/5 text-[10px] text-slate-400 font-bold uppercase"
                          onClick={() => setDiscardCount(selectedItem.count)}
                        >
                          全部
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        className="flex-1 py-3 px-4 rounded-lg border border-border-dark text-text-secondary hover:bg-white/5 transition-colors font-medium" 
                        onClick={() => setIsDiscarding(false)}
                      >
                        取消
                      </button>
                      <button 
                        className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-all"
                        onClick={confirmDiscard}
                      >
                        确认丢弃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
