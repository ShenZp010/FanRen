import React from 'react';
import { useGame } from '../context/GameContext';

interface CultivateProps {
  onNavigate: (tab: string) => void;
}

export default function Cultivate({ onNavigate }: CultivateProps) {
  const { player, toggleCultivation, cultivationRate, totalStats } = useGame();
  const hasDailyRewards = player.dailyTasks.some(t => t.current >= t.target && !t.claimed) || 
                         [25, 50, 75, 100].some(m => player.activityValue >= m && !player.activityRewardsClaimed.includes(m));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark">
      {/* Header */}
      <header className="flex-none pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md border-b border-primary/10 px-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-full bg-surface-highlight flex items-center justify-center overflow-hidden border border-primary/30 shadow-inner">
              <img 
                alt="Avatar" 
                className="w-full h-full object-cover opacity-90" 
                src="https://picsum.photos/seed/cultivator/100/100"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background-dark ${player.isCultivating ? 'bg-primary animate-pulse' : 'bg-slate-500'}`}></div>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-slate-100">{player.name}</h1>
            <p className="text-[10px] text-primary/80 font-bold uppercase tracking-tighter">{player.sect}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-highlight/50 px-2 py-1 rounded-full border border-white/5">
            <span className="material-symbols-outlined text-amber-400 text-[14px]">diamond</span>
            <span className="text-[10px] font-bold font-mono text-white">{player.resources.spiritStones.toLocaleString()}</span>
          </div>
          <button className="p-2 rounded-full hover:bg-surface-highlight transition-colors text-slate-400 hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-24 space-y-6 pt-4">
        {/* Main Cultivation Circle */}
        <section className="flex flex-col items-center justify-center text-center relative py-4">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl -z-10 opacity-20"></div>
          <div className="relative w-52 h-52 flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle className="text-surface-highlight" cx="50" cy="50" fill="none" r="46" stroke="currentColor" strokeWidth="2"></circle>
              <circle 
                className="text-primary drop-shadow-[0_0_12px_rgba(19,236,91,0.6)] transition-all duration-1000 ease-linear" 
                cx="50" cy="50" fill="none" r="46" stroke="currentColor" 
                strokeDasharray="289" 
                strokeDashoffset={289 - (289 * player.realm.progress) / 100} 
                strokeLinecap="round" strokeWidth="4"
              ></circle>
            </svg>
            <div className={`absolute inset-0 m-auto w-36 h-36 bg-surface-dark rounded-full flex flex-col items-center justify-center border border-primary/20 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] ${player.isCultivating ? 'cultivate-pulse' : ''}`}>
              <span className={`material-symbols-outlined text-4xl mb-1 transition-colors duration-500 ${player.isCultivating ? 'text-primary' : 'text-slate-600'}`}>self_improvement</span>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${player.isCultivating ? 'text-primary' : 'text-slate-500'}`}>
                {player.isCultivating ? '修炼中' : '未修炼'}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight">{player.realm.name}</h2>
            <p className="text-primary text-sm font-bold tracking-[0.3em] uppercase">{player.realm.stage} · {player.realm.level}层</p>
          </div>

          <div className="w-full max-w-xs mt-6 space-y-3">
            <div className="flex justify-between items-end text-[10px] text-slate-400 px-1 font-bold uppercase tracking-widest">
              <span>境界进度</span>
              <span className="text-white text-sm font-mono">{Math.floor(player.realm.progress)}%</span>
            </div>
            <div className="h-2 w-full bg-surface-highlight rounded-full overflow-hidden border border-white/5 p-[1px]">
              <div className="h-full bg-primary shadow-[0_0_15px_rgba(19,236,91,0.8)] transition-all duration-1000 ease-linear rounded-full" style={{ width: `${player.realm.progress}%` }}></div>
            </div>
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase">
                <span className="material-symbols-outlined text-[14px] animate-bounce">bolt</span>
                {player.isCultivating ? `+${cultivationRate.toFixed(2)} 灵气 / 秒` : '修炼已停止'}
              </span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-100">属性</h3>
            <button className="text-xs font-medium text-primary hover:underline">查看详情</button>
          </div>
          
          {/* Main Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-dark rounded-xl p-4 border-l-4 border-l-red-500 border border-white/5 relative overflow-hidden group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-white">favorite</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">气血</p>
              <p className="text-xl font-mono font-black text-slate-100">{totalStats.hp.toLocaleString()}</p>
              <div className="w-full bg-black/40 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-red-500 h-full" style={{ width: `${(totalStats.hp / totalStats.maxHp) * 100}%` }}></div>
              </div>
            </div>
            <div className="bg-surface-dark rounded-xl p-4 border-l-4 border-l-orange-500 border border-white/5 relative overflow-hidden group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-white">swords</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">攻击</p>
              <p className="text-xl font-mono font-black text-slate-100">{totalStats.attack.toLocaleString()}</p>
            </div>
            <div className="bg-surface-dark rounded-xl p-4 border-l-4 border-l-blue-500 border border-white/5 relative overflow-hidden group">
              <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-white">shield</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">防御</p>
              <p className="text-xl font-mono font-black text-slate-100">{totalStats.defense.toLocaleString()}</p>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-surface-dark rounded-xl p-3 border border-white/5 flex flex-col gap-1">
              <p className="text-[9px] text-slate-500 font-bold uppercase">命中值</p>
              <p className="text-sm font-mono font-black text-slate-200">{totalStats.hit}</p>
            </div>
            <div className="bg-surface-dark rounded-xl p-3 border border-white/5 flex flex-col gap-1">
              <p className="text-[9px] text-slate-500 font-bold uppercase">闪避值</p>
              <p className="text-sm font-mono font-black text-slate-200">{totalStats.evasion}</p>
            </div>
            <div className="bg-surface-dark rounded-xl p-3 border border-white/5 flex flex-col gap-1">
              <p className="text-[9px] text-slate-500 font-bold uppercase">暴击率</p>
              <p className="text-sm font-mono font-black text-amber-500">{Math.round(totalStats.critRate * 100)}%</p>
            </div>
            <div className="bg-surface-dark rounded-xl p-3 border border-white/5 flex flex-col gap-1">
              <p className="text-[9px] text-slate-500 font-bold uppercase">暴击伤害</p>
              <p className="text-sm font-mono font-black text-slate-200">{Math.round(totalStats.critDamage * 100)}%</p>
            </div>
          </div>
        </section>

        {/* Action Quick Access */}
        <section className="bg-surface-dark/50 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">快捷指令</h3>
            <span className="w-8 h-[1px] bg-white/10"></span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { id: 'storage', icon: 'backpack', label: '储物', color: 'text-blue-400' },
              { id: 'skills', icon: 'menu_book', label: '功法', color: 'text-emerald-400' },
              { id: 'professions', icon: 'science', label: '炼丹', color: 'text-amber-400' },
              { id: 'daily', icon: 'calendar_month', label: '日常', color: 'text-rose-400', badge: hasDailyRewards },
            ].map((action, i) => (
              <button 
                key={i} 
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-surface-dark border border-surface-highlight flex items-center justify-center group-hover:border-primary/50 group-hover:bg-surface-highlight transition-all relative shadow-lg">
                  {action.badge && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>}
                  <span className={`material-symbols-outlined text-2xl ${action.color} group-hover:scale-110 transition-transform`}>{action.icon}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-200 transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
      
      {/* Floating Action Button */}
      <div className="absolute bottom-6 right-5 z-40">
        <button 
          onClick={toggleCultivation}
          className={`w-14 h-14 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300 active:scale-90 ${
            player.isCultivating 
              ? 'bg-surface-highlight text-primary border border-primary/50 ring-4 ring-primary/10' 
              : 'bg-primary text-background-dark hover:shadow-primary/20'
          }`}
        >
          <span className="material-symbols-outlined text-[32px] font-bold">
            {player.isCultivating ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </div>
    </div>
  );
}
