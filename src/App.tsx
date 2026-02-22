import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Cultivate from './pages/Cultivate';
import Skills from './pages/Skills';
import Adventure from './pages/Adventure';
import Sect from './pages/Sect';
import Market from './pages/Market';
import MarketList from './pages/MarketList';
import SectTreasure from './pages/SectTreasure';
import SectSkills from './pages/SectSkills';
import Professions from './pages/Professions';
import Combat from './pages/Combat';
import Storage from './pages/Storage';
import DailyTasks from './pages/DailyTasks';
import { useGame } from './context/GameContext';
import { AnimatePresence, motion } from 'motion/react';

const ToastContainer = () => {
  const { toasts } = useGame();
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`px-4 py-2 rounded-full shadow-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md ${
              toast.type === 'success' ? 'bg-primary/20 border-primary/40 text-primary' :
              toast.type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-400' :
              'bg-blue-500/20 border-blue-500/40 text-blue-400'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('cultivate');
  const [inCombat, setInCombat] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'cultivate':
        return <Cultivate onNavigate={setActiveTab} />;
      case 'skills':
        return <Skills />;
      case 'adventure':
        return <Adventure onEnterCombat={() => setInCombat(true)} />;
      case 'sect':
        return <Sect onNavigate={setActiveTab} />;
      case 'market':
        return <Market onNavigate={setActiveTab} />;
      case 'market-list':
        return <MarketList onBack={() => setActiveTab('market')} />;
      case 'sect-treasure':
        return <SectTreasure onBack={() => setActiveTab('sect')} />;
      case 'sect-skills':
        return <SectSkills onBack={() => setActiveTab('sect')} />;
      case 'professions':
        return <Professions />;
      case 'storage':
        return <Storage />;
      case 'daily':
        return <DailyTasks />;
      default:
        return <Cultivate onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="bg-black h-[100dvh] w-full flex justify-center overflow-hidden font-chinese">
      <div className="w-full max-w-md bg-background-dark h-full flex flex-col relative shadow-2xl overflow-hidden border-x border-white/5">
        <ToastContainer />
        {inCombat ? (
          <Combat onExitCombat={() => setInCombat(false)} />
        ) : (
          <>
            <div className="flex-1 overflow-hidden flex flex-col relative">
              {renderContent()}
            </div>
            <BottomNav activeTab={activeTab} onChange={setActiveTab} />
          </>
        )}
      </div>
    </div>
  );
}
