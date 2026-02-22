import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

interface CombatProps {
  onExitCombat: () => void;
}

export default function Combat({ onExitCombat }: CombatProps) {
  const { player, totalStats, addLog, winCombat } = useGame();
  const [enemyHp, setEnemyHp] = useState(10000);
  const [playerHp, setPlayerHp] = useState(totalStats.hp);
  const [turn, setTurn] = useState(1);
  const [combatLogs, setCombatLogs] = useState<any[]>([]);

  const enemyStats = {
    maxHp: 10000,
    attack: 400,
    defense: 300,
    hit: 100,
    evasion: 80,
    critRate: 0.05,
    critDamage: 1.5
  };

  useEffect(() => {
    // Initial combat log
    setCombatLogs([
      { type: 'system', text: '遭遇了 铁甲熊！战斗开始！' }
    ]);
  }, []);

  const calculateDamage = (attacker: any, defender: any) => {
    // 1. Hit/Evasion Check
    const hitProb = Math.min(0.9, Math.max(0.1, attacker.hit / (attacker.hit + defender.evasion)));
    const isHit = Math.random() < hitProb;
    
    if (!isHit) return { damage: 0, isCrit: false, isMiss: true };

    // 2. Base Damage
    let baseDmg = attacker.attack - defender.defense;
    if (baseDmg <= 0) {
      baseDmg = Math.floor(attacker.attack * 0.05);
    }

    // 3. Crit Check
    const isCrit = Math.random() < attacker.critRate;
    const finalDmg = isCrit ? Math.floor(baseDmg * attacker.critDamage) : baseDmg;

    return { damage: finalDmg, isCrit, isMiss: false };
  };

  const handleAttack = () => {
    // Player attacks Enemy
    const playerResult = calculateDamage(totalStats, enemyStats);
    const newEnemyHp = Math.max(0, enemyHp - playerResult.damage);

    // Enemy attacks Player
    const enemyResult = calculateDamage(enemyStats, totalStats);
    const newPlayerHp = Math.max(0, playerHp - enemyResult.damage);

    setEnemyHp(newEnemyHp);
    setPlayerHp(newPlayerHp);
    setTurn(turn + 1);

    const playerLogText = playerResult.isMiss 
      ? <span className="text-slate-400 italic">你的攻击被 <span className="text-red-400">铁甲熊</span> 闪避了！</span>
      : <span>{playerResult.isCrit && <span className="text-amber-400 font-black mr-1">【暴击】</span>}你对 <span className="text-red-400">铁甲熊</span> 造成了 <span className={playerResult.isCrit ? "text-amber-400 font-bold text-lg" : "text-primary font-bold"}>{playerResult.damage}</span> 点伤害。</span>;
    
    const enemyLogText = enemyResult.isMiss
      ? <span className="text-slate-400 italic">你闪避了 <span className="text-red-400">铁甲熊</span> 的攻击！</span>
      : <span>{enemyResult.isCrit && <span className="text-red-500 font-black mr-1">【暴击】</span>}<span className="text-red-400">铁甲熊</span> 对你造成了 <span className={enemyResult.isCrit ? "text-red-500 font-bold text-lg" : "text-red-400 font-bold"}>{enemyResult.damage}</span> 点伤害。</span>;

    const newLogs = [
      { type: 'player', text: playerLogText, isCrit: playerResult.isCrit, isMiss: playerResult.isMiss, turn },
      { type: 'enemy', text: enemyLogText, isCrit: enemyResult.isCrit, isMiss: enemyResult.isMiss, turn },
      ...combatLogs
    ];
    setCombatLogs(newLogs.slice(0, 20));

    if (newEnemyHp <= 0) {
      addLog(<span className="text-primary font-bold">击败了 铁甲熊！获得 100 灵石，10 修为。</span>, 'system');
      winCombat(100, 10, newPlayerHp);
      onExitCombat();
    } else if (newPlayerHp <= 0) {
      addLog(<span className="text-red-500 font-bold">战斗失败... 你重伤逃走了。</span>, 'system');
      // Update global HP even on loss (maybe keep at least 1 HP to avoid softlock if no healing implemented)
      winCombat(0, 0, 1); 
      onExitCombat();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-dark min-h-screen z-50 absolute inset-0">
      <div className="flex items-center justify-between p-4 bg-ui-dark border-b border-ui-border pt-12">
        <button onClick={onExitCombat} className="flex items-center text-slate-100 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-slate-100 text-lg font-bold tracking-tight">上古遗迹 - 第九层</h2>
        <button className="flex items-center text-slate-100 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">pause</span>
        </button>
      </div>
      
      <div className="flex-none bg-[#14261b] p-4 pb-6 shadow-lg z-10">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">{player.name}</p>
                <p className="text-xs text-primary/80">{player.realm.name}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="relative w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
                <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-300" style={{ width: `${(playerHp / totalStats.maxHp) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-primary font-mono leading-none">
                <span>气血</span>
                <span>{playerHp}/{totalStats.maxHp}</span>
              </div>
              <div className="relative w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10 mt-1">
                <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-blue-400 font-mono leading-none">
                <span>真元</span>
                <span>420/700</span>
              </div>
            </div>
          </div>
          
          <div className="flex-none pt-2">
            <div className="bg-red-900/30 text-red-500 border border-red-500/30 text-xs font-black px-2 py-1 rounded italic">
              VS
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-2 items-end text-right">
            <div className="flex items-center gap-2 mb-1 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center border border-red-500/50 overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-bl from-red-600/40 to-red-900/10"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-red-100 leading-tight">铁甲熊</p>
                <p className="text-xs text-red-400/80">灵兽</p>
              </div>
            </div>
            <div className="space-y-1.5 w-full">
              <div className="relative w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemyHp / enemyStats.maxHp) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-red-400 font-mono leading-none flex-row-reverse">
                <span>气血</span>
                <span>{enemyHp}/{enemyStats.maxHp}</span>
              </div>
              <div className="flex gap-1 justify-end mt-1">
                <span className="px-1 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-[9px] text-red-300">狂暴</span>
                <span className="px-1 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[9px] text-blue-300">冰冻</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-[#0c1a11] relative pb-48">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0c1a11] via-transparent to-transparent h-20 bottom-0 z-10"></div>
        <div className="space-y-3 pb-8 text-sm">
          <div className="text-center text-xs text-slate-500 my-4">--- 第 {turn} 回合 ---</div>
          {combatLogs.map((log, idx) => (
            <div key={idx} className={`flex gap-3 ${log.type === 'player' ? 'bg-primary/5 p-2 rounded-lg border border-primary/10' : log.type === 'enemy' ? 'bg-red-500/5 p-2 rounded-lg border border-red-500/10' : ''}`}>
              <div className={`mt-1 flex-none ${log.type === 'player' ? 'text-primary' : log.type === 'enemy' ? 'text-red-500' : 'text-blue-400'}`}>
                <span className="material-symbols-outlined text-[18px]">
                  {log.type === 'player' ? 'bolt' : log.type === 'enemy' ? 'swords' : 'info'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                    {log.type === 'player' ? 'Player Turn' : log.type === 'enemy' ? 'Enemy Turn' : 'System'}
                  </span>
                  {log.turn && <span className="text-[10px] opacity-20 font-mono">T-{log.turn}</span>}
                </div>
                <div className={`${log.type === 'player' ? 'text-slate-200' : 'text-slate-300'} text-sm leading-relaxed`}>
                  {log.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 z-20">
        <div className="bg-[#112217]/95 backdrop-blur-sm border border-ui-border rounded-xl p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <button 
            onClick={handleAttack}
            className="w-full bg-primary hover:bg-[#10d650] active:scale-[0.98] transition-all text-background-dark font-bold text-lg h-12 rounded-lg flex items-center justify-center gap-2 mb-3 shadow-[0_0_15px_rgba(19,236,91,0.3)]"
          >
            <span className="material-symbols-outlined text-[24px]">swords</span>
            普通攻击
          </button>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <button className="flex flex-col items-center justify-center gap-1 bg-[#1c3625] hover:bg-[#254630] border border-ui-border rounded-lg h-14 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-primary text-[20px]">auto_fix_high</span>
              <span className="text-[10px] font-medium text-slate-200">术法</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 bg-[#1c3625] hover:bg-[#254630] border border-ui-border rounded-lg h-14 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-blue-400 text-[20px]">backpack</span>
              <span className="text-[10px] font-medium text-slate-200">道具</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 bg-[#1c3625] hover:bg-[#254630] border border-ui-border rounded-lg h-14 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-purple-400 text-[20px]">pets</span>
              <span className="text-[10px] font-medium text-slate-200">灵宠</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 bg-[#1c3625] hover:bg-[#254630] border border-ui-border rounded-lg h-14 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-yellow-400 text-[20px]">shield</span>
              <span className="text-[10px] font-medium text-slate-200">防御</span>
            </button>
          </div>
          <div className="flex justify-center">
            <button onClick={onExitCombat} className="text-xs font-medium text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors px-4 py-1">
              <span className="material-symbols-outlined text-[16px]">logout</span>
              逃跑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
