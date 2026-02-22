import React from 'react';
import { useGame } from '../context/GameContext';

export default function DailyTasks() {
  const { player, claimTaskReward, claimActivityReward } = useGame();

  const milestones = [25, 50, 75, 100];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark select-none">
      {/* Top Navigation / Header */}
      <header className="flex-none flex items-center justify-between px-4 py-3 border-b border-border-dark bg-background-dark z-10 pt-12">
        <h1 className="text-lg font-bold tracking-tight text-white">日常历练</h1>
        <button className="text-white p-1 rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Daily Activity Progress Section */}
        <section className="p-4 bg-background-dark border-b border-border-dark sticky top-0 z-10 shadow-lg shadow-black/20">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h2 className="text-sm text-text-secondary font-medium">今日活跃度</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">{player.activityValue}</span>
                <span className="text-sm text-gray-500">/ 100</span>
              </div>
            </div>
            <div className="text-xs text-text-secondary mb-1">已领取 {player.activityRewardsClaimed.length}/4 宝箱</div>
          </div>
          {/* Progress Bar */}
          <div className="relative h-2 bg-card-dark rounded-full overflow-hidden mb-6">
            <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-500" style={{ width: `${player.activityValue}%` }}></div>
          </div>
          {/* Milestone Chests */}
          <div className="flex justify-between px-2 relative">
            <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-border-dark -z-10 -translate-y-1/2"></div>
            {milestones.map((m) => {
              const isClaimed = player.activityRewardsClaimed.includes(m);
              const isReady = player.activityValue >= m && !isClaimed;
              return (
                <div 
                  key={m} 
                  className={`flex flex-col items-center gap-1 group cursor-pointer ${!isReady && !isClaimed ? 'opacity-50' : ''}`}
                  onClick={() => isReady && claimActivityReward(m)}
                >
                  <div className="relative">
                    {isReady && <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isClaimed ? 'bg-card-dark border border-primary text-primary shadow-[0_0_10px_rgba(19,236,91,0.2)]' :
                      isReady ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(19,236,91,0.6)] z-10' :
                      'bg-card-dark border border-border-dark text-gray-500'
                    }`}>
                      <span className={`material-symbols-outlined text-[20px] ${isReady ? 'animate-bounce' : ''}`}>
                        {isClaimed ? 'check_circle' : isReady ? 'redeem' : 'lock'}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${isClaimed || isReady ? 'text-primary' : 'text-gray-500'}`}>{m}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Task List */}
        <div className="flex flex-col gap-3 p-4">
          {player.dailyTasks.map((task) => (
            <div 
              key={task.id} 
              className={`bg-card-dark rounded-lg p-4 border flex items-center gap-4 relative overflow-hidden transition-all ${
                task.claimed ? 'opacity-60 border-border-dark' : 
                task.current >= task.target ? 'border-primary/30 shadow-[0_0_10px_rgba(19,236,91,0.05)]' : 
                'border-border-dark'
              }`}
            >
              {task.current >= task.target && !task.claimed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
              <div className={`w-12 h-12 rounded-lg bg-background-dark flex items-center justify-center shrink-0 ${
                task.claimed ? 'text-gray-500' : 
                task.current >= task.target ? 'text-primary' : 
                'text-text-secondary'
              }`}>
                <span className="material-symbols-outlined text-[24px]">{task.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-white font-medium truncate">{task.name}</h3>
                  <span className="text-xs text-primary font-bold">+{task.rewardActivity} 活跃</span>
                </div>
                <div className="flex gap-2 mb-2">
                  {task.rewardStones && <span className="text-[10px] bg-background-dark px-1.5 py-0.5 rounded text-yellow-500 border border-yellow-500/20">灵石 x{task.rewardStones}</span>}
                  {task.rewardExp && <span className="text-[10px] bg-background-dark px-1.5 py-0.5 rounded text-blue-400 border border-blue-400/20">修为 x{task.rewardExp}</span>}
                  {task.rewardContribution && <span className="text-[10px] bg-background-dark px-1.5 py-0.5 rounded text-purple-400 border border-purple-400/20">贡献 x{task.rewardContribution}</span>}
                  {!task.rewardStones && !task.rewardExp && !task.rewardContribution && <p className="text-xs text-text-secondary truncate">{task.desc}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-background-dark rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${task.claimed ? 'bg-gray-500' : 'bg-primary'}`} 
                      style={{ width: `${(task.current / task.target) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs ${task.claimed ? 'text-gray-400' : task.current >= task.target ? 'text-primary' : 'text-text-secondary'}`}>
                    {task.current}/{task.target}
                  </span>
                </div>
              </div>
              
              {task.claimed ? (
                <button className="shrink-0 px-4 py-1.5 rounded bg-transparent border border-gray-600 text-gray-500 text-xs font-medium" disabled>
                  已完成
                </button>
              ) : task.current >= task.target ? (
                <button 
                  onClick={() => claimTaskReward(task.id)}
                  className="shrink-0 px-4 py-1.5 rounded bg-primary text-background-dark text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 animate-pulse"
                >
                  领取
                </button>
              ) : (
                <button className="shrink-0 px-4 py-1.5 rounded bg-border-dark text-white text-xs font-medium hover:bg-[#2f5e3e] transition-colors border border-transparent hover:border-primary/50">
                  前往
                </button>
              )}
            </div>
          ))}
          <div className="h-8"></div>
        </div>
      </main>
    </div>
  );
}
