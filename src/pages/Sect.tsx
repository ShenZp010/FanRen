import React from 'react';
import { useGame } from '../context/GameContext';

export default function Sect({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { player, claimDailySalary, completeSectTask, addLog } = useGame();

  const handleClaimSalary = () => {
    if (claimDailySalary()) {
      addLog(<span>领取了宗门每日供奉 <span className="text-amber-400">50 灵石</span>。</span>, 'system');
    } else {
      addLog(<span className="text-red-500">今日已领取过供奉，请明天再来。</span>, 'system');
    }
  };

  const handleCompleteTask = (taskName: string, reward: number) => {
    if (completeSectTask(reward)) {
      addLog(<span>完成了宗门任务 <span className="text-primary font-bold">{taskName}</span>，获得 <span className="text-amber-400">{reward} 贡献</span>。</span>, 'system');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="flex-none flex items-center justify-between pb-3 sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 px-4 pt-12 shadow-lg">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-slate-100">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold tracking-wide">宗门</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-slate-100">
          <span className="material-symbols-outlined text-2xl">help</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-6">
        <section className="relative overflow-hidden rounded-2xl bg-surface-dark border border-white/5 p-5 shadow-lg">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">青云宗</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-background-dark uppercase tracking-wider">LV.5</span>
                </div>
                <p className="text-sm text-slate-400">正道第一大宗 · 浩然正气</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-highlight flex items-center justify-center text-primary border border-white/5 shadow-inner">
                <span className="material-symbols-outlined text-3xl">temple_buddhist</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>宗门威望</span>
                <span className="text-primary">6,500 <span className="text-slate-500">/ 10,000</span></span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_10px_rgba(19,236,91,0.5)] rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-dark rounded-xl border border-white/5 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">badge</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">当前职位</p>
              <p className="text-base font-bold text-white">内门弟子</p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-slate-400">每日供奉: <span className="text-primary font-bold">50</span> 灵石</p>
            <button 
              onClick={handleClaimSalary}
              disabled={player.dailySalaryClaimed}
              className={`px-3 py-1 text-xs font-medium border rounded transition-all flex items-center gap-1 ${
                player.dailySalaryClaimed 
                  ? 'bg-surface-dark text-slate-500 border-white/10 cursor-not-allowed' 
                  : 'bg-surface-highlight hover:bg-white/10 text-primary border-primary/30 active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {player.dailySalaryClaimed ? 'check_circle' : 'redeem'}
              </span>
              {player.dailySalaryClaimed ? '已领取' : '领取'}
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <button className="bg-surface-dark active:scale-[0.98] transition-transform rounded-xl border border-white/5 p-4 flex flex-col items-start gap-3 relative overflow-hidden group">
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.8)] animate-pulse"></div>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <span className="material-symbols-outlined text-2xl">checklist</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">宗门任务</h3>
              <p className="text-xs text-slate-400 text-left">剩余: 3/5</p>
            </div>
          </button>
          <button 
            onClick={() => onNavigate('sect-treasure')}
            className="bg-surface-dark active:scale-[0.98] transition-transform rounded-xl border border-white/5 p-4 flex flex-col items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <span className="material-symbols-outlined text-2xl">storefront</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">藏宝阁</h3>
              <p className="text-xs text-slate-400 text-left">贡献兑换</p>
            </div>
          </button>
          <button className="bg-surface-dark active:scale-[0.98] transition-transform rounded-xl border border-white/5 p-4 flex flex-col items-start gap-3 group">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">成员列表</h3>
              <p className="text-xs text-slate-400 text-left">342 人</p>
            </div>
          </button>
          <button 
            onClick={() => onNavigate('sect-skills')}
            className="bg-surface-dark active:scale-[0.98] transition-transform rounded-xl border border-white/5 p-4 flex flex-col items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <span className="material-symbols-outlined text-2xl">auto_stories</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">宗门功法</h3>
              <p className="text-xs text-slate-400 text-left">秘籍研修</p>
            </div>
          </button>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-white">进行中任务</h3>
            <button className="text-xs text-primary hover:text-primary/80 transition-colors">查看全部</button>
          </div>
          <div className="space-y-2">
            <div className="bg-surface-dark rounded-lg p-3 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-surface-highlight flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-400">eco</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">采集灵草</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 bg-black/20 px-1.5 py-0.5 rounded">简单</span>
                  <span className="text-[10px] text-primary">奖励: 10 贡献</span>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400">8/10</div>
            </div>
            <div className="bg-surface-dark rounded-lg p-3 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-surface-highlight flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-rose-400">swords</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">讨伐山贼</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 bg-black/20 px-1.5 py-0.5 rounded">普通</span>
                  <span className="text-[10px] text-primary">奖励: 20 贡献</span>
                </div>
              </div>
              <button 
                onClick={() => handleCompleteTask('讨伐山贼', 20)}
                className="px-2 py-1 bg-primary text-background-dark text-xs font-bold rounded"
              >
                完成
              </button>
            </div>
          </div>
        </section>

        <section className="bg-surface-highlight/50 rounded-lg p-3 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">monetization_on</span>
            <span className="text-sm text-slate-300">当前宗门贡献</span>
          </div>
          <span className="font-mono text-lg font-bold text-primary">{player.resources.sectContribution.toLocaleString()}</span>
        </section>
      </main>
    </div>
  );
}
