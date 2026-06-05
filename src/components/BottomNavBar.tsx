import React from 'react';
import { Home, Sliders, User, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'home' | 'utilities' | 'account' | 'discover';

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'discover' as TabType, label: 'Discover', icon: Compass },
    { id: 'utilities' as TabType, label: 'Tools', icon: Sliders },
    { id: 'account' as TabType, label: 'Account', icon: User },
  ];

  return (
    <div id="android-bottom-nav" className="w-full bg-white/80 backdrop-blur-md border-t border-neutral-200/55 py-3 px-6 flex items-center justify-around select-none z-50">
      <div className="flex w-full max-w-lg justify-around items-center h-12">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              id={`nav-item-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center cursor-pointer focus:outline-none w-18 h-full group"
            >
              {/* Material You active pill indicator */}
              <div className="relative flex items-center justify-center p-1 w-14 h-8 rounded-full transition-all duration-300">
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-indigo-100 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <IconComponent
                  size={20}
                  className={`z-10 transition-colors duration-200 ${
                    isActive ? 'text-indigo-600 stroke-[2.5px]' : 'text-neutral-500 group-hover:text-neutral-800'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 font-medium tracking-wide transition-all ${
                  isActive ? 'text-indigo-800 font-bold' : 'text-neutral-500 group-hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
