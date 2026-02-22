import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export default function Market({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { player, buyItem, cancelOrder, addLog, showToast } = useGame();
  const [filter, setFilter] = useState('全部');
  const [activeMode, setActiveMode] = useState('buy');

  const items = [
    { name: '聚气丹', type: '丹药', quality: '极品', desc: '瞬间恢复大量灵气，提升修炼效率。', price: 500, stock: 99, icon: 'medication', color: 'purple' },
    { name: '青云剑', type: '法宝', quality: '上品', desc: '筑基期修士常用的飞剑，轻便锋利。', price: 1200, stock: 1, icon: 'swords', color: 'orange' },
    { name: '千年寒铁', type: '材料', quality: '珍稀', desc: '极寒之地出产的矿石，是炼制冰属性法宝的上佳材料。', price: 300, stock: 50, icon: 'diamond', color: 'blue' },
    { name: '长生诀', type: '功法', quality: '凡品', desc: '流传甚广的基础功法，中规中矩。', price: 100, stock: 0, icon: 'menu_book', color: 'gray' },
    { name: '筑基丹', type: '丹药', quality: '罕见', desc: '突破筑基期瓶颈的必备丹药。', price: 5000, stock: 5, icon: 'pill', color: 'emerald' },
    { name: '引雷符', type: '符箓', quality: '中品', desc: '封印了一道雷电之力的符纸，可对敌造成雷电伤害。', price: 150, stock: 20, icon: 'receipt_long', color: 'yellow' },
  ];

  const handleBuy = (item: any) => {
    if (item.stock <= 0) return;
    if (buyItem(item.name, item.price, 1)) {
      addLog(<span>在交易行购买了 <span className="text-primary font-bold">{item.name}</span> x1，花费 <span className="text-amber-400">{item.price} 灵石</span>。</span>, 'system');
    } else {
      addLog(<span className="text-red-500">灵石不足，无法购买 {item.name}。</span>, 'system');
    }
  };

  const filteredItems = filter === '全部' ? items : items.filter(i => i.type === filter);

  const renderBuyMode = () => (
    <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4 pt-2 scrollbar-hide">
      {filteredItems.map((item, idx) => (
        <div 
          key={idx} 
          className={`group bg-surface-dark rounded-2xl p-4 border border-white/5 transition-all relative overflow-hidden shadow-lg ${
            item.stock > 0 ? 'hover:border-primary/30 hover:shadow-primary/5 cursor-pointer' : 'opacity-60 grayscale-[80%]'
          }`}
        >
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-7xl text-white">{item.icon}</span>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className={`size-14 rounded-2xl bg-background-dark flex items-center justify-center border border-white/5 shadow-inner transition-all duration-300 ${
                item.stock > 0 ? 'group-hover:scale-110 group-hover:border-primary/20' : ''
              }`}>
                <span className={`material-symbols-outlined text-3xl text-${item.color}-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]`}>{item.icon}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-black text-sm tracking-tight">{item.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-${item.color}-500/10 text-${item.color}-400 border border-${item.color}-500/20`}>
                    {item.quality}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-1">{item.desc}</p>
              </div>
            </div>
            <div className="text-right pl-4">
              <div className={`font-black text-lg font-mono tracking-tighter ${item.stock > 0 ? 'text-primary' : 'text-slate-600'}`}>
                {item.price.toLocaleString()}
              </div>
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">灵石 / Unit</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="size-5 rounded-full border-2 border-surface-dark bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/50?u=${item.name}${i}`} alt="user" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">余量: {item.stock}</span>
            </div>
            
            {item.stock > 0 ? (
              <button 
                onClick={() => handleBuy(item)}
                className="bg-primary hover:bg-primary-dark text-background-dark text-[10px] font-black uppercase tracking-[0.2em] py-2 px-6 rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-95"
              >
                立即购买
              </button>
            ) : (
              <button className="bg-transparent border border-white/10 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] py-2 px-6 rounded-xl cursor-not-allowed" disabled>
                暂时缺货
              </button>
            )}
          </div>
        </div>
      ))}
      
      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-slate-600 flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl opacity-20">inventory_2</span>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">该分类下暂无商品</p>
        </div>
      )}
    </div>
  );

  const renderSellMode = () => {
    const sellingOrders = player.orders.filter(o => o.type === 'sell' && o.status === 'active');
    return (
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4 pt-2 scrollbar-hide">
        {sellingOrders.map((order) => (
          <div key={order.id} className="bg-surface-dark rounded-2xl p-4 border border-white/5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-background-dark flex items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-2xl text-blue-400">inventory_2</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{order.itemName}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">数量: {order.amount}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-primary font-mono font-bold">{order.price.toLocaleString()}</div>
                <div className="text-[9px] text-slate-600 uppercase">单价灵石</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <span className="text-[10px] text-slate-500">{order.time} 发布</span>
              <button 
                onClick={() => cancelOrder(order.id)}
                className="px-4 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors"
              >
                下架
              </button>
            </div>
          </div>
        ))}
        {sellingOrders.length === 0 && (
          <div className="text-center py-20 text-slate-600 flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-5xl opacity-20">sell</span>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">暂无出售中的物品</p>
          </div>
        )}
        
        {/* Floating Sell Button */}
        <button 
          onClick={() => onNavigate('market-list')}
          className="fixed bottom-24 right-6 size-14 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-[0_0_20px_rgba(19,236,91,0.4)] hover:scale-110 transition-transform z-30"
        >
          <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
      </div>
    );
  };

  const renderOrdersMode = () => {
    return (
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4 pt-2 scrollbar-hide">
        {player.orders.map((order) => (
          <div key={order.id} className="bg-surface-dark rounded-2xl p-4 border border-white/5 shadow-lg relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.type === 'buy' ? 'bg-primary' : 'bg-blue-400'}`}></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-background-dark flex items-center justify-center border border-white/5">
                  <span className={`material-symbols-outlined text-xl ${order.type === 'buy' ? 'text-primary' : 'text-blue-400'}`}>
                    {order.type === 'buy' ? 'shopping_cart' : 'sell'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-sm">{order.itemName}</h3>
                    <span className={`text-[8px] px-1 rounded font-black uppercase ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {order.status === 'completed' ? '已完成' : order.status === 'active' ? '进行中' : '已取消'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">{order.time} · {order.type === 'buy' ? '买入' : '卖出'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono font-bold">x{order.amount}</div>
                <div className="text-primary text-xs font-mono">{(order.price * order.amount).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
        {player.orders.length === 0 && (
          <div className="text-center py-20 text-slate-600 flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-5xl opacity-20">history</span>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">暂无订单记录</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark">
      <header className="flex-none bg-ui-dark border-b border-ui-border sticky top-0 z-20 pt-12 pb-4 px-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-white uppercase">万宝阁</h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Marketplace & Trading</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-surface-dark px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
              <span className="material-symbols-outlined text-amber-400 text-[16px]">diamond</span>
              <span className="text-xs font-bold font-mono text-white">{player.resources.spiritStones.toLocaleString()}</span>
              <button className="ml-1 size-5 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/40 transition-colors">
                <span className="material-symbols-outlined text-[14px] font-bold">add</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
          {['buy', 'sell', 'orders'].map((mode) => (
            <button 
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeMode === mode ? 'bg-primary text-background-dark shadow-lg' : 'text-slate-500 hover:text-white'
              }`}
            >
              {mode === 'buy' ? '购买' : mode === 'sell' ? '出售' : '我的订单'}
            </button>
          ))}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Search & Filter - Only show in Buy mode */}
        {activeMode === 'buy' && (
          <div className="px-5 py-4 flex-none space-y-4 bg-background-dark/50 backdrop-blur-sm z-10">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input 
                  className="w-full bg-surface-dark border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all" 
                  placeholder="搜索修仙资源..." 
                  type="text"
                />
              </div>
              <button className="flex items-center justify-center px-4 bg-surface-dark border border-white/5 rounded-xl text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {['全部', '丹药', '法宝', '材料', '功法', '符箓'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    filter === f ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_10px_rgba(19,236,91,0.2)]' : 'bg-surface-dark text-slate-500 border-white/5 hover:border-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Content based on activeMode */}
        {activeMode === 'buy' ? renderBuyMode() : activeMode === 'sell' ? renderSellMode() : renderOrdersMode()}
      </main>
    </div>
  );
}
