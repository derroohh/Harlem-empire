import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Bell, CloudSun } from 'lucide-react';
import type { GoogleUser } from '../types';

interface StatusBarProps {
  user: GoogleUser | null;
  onLogout: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ user, onLogout }) => {
  const [time, setTime] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(88);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Softly simulate battery discharging slightly or staying premium
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => (prev > 10 ? prev - 1 : 99));
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="android-status-bar" className="w-full h-11 px-6 flex items-center justify-between text-neutral-600 bg-neutral-100/30 backdrop-blur-md border-b border-neutral-200/40 select-none font-sans text-xs font-semibold z-50">
      {/* Left side: Clock and active quick notifications */}
      <div className="flex items-center space-x-2">
        <span className="text-neutral-800 tracking-tight">{time || '10:00 AM'}</span>
        <div className="flex items-center space-x-1.5 pl-2 border-l border-neutral-300">
          <CloudSun size={13} className="text-amber-500 animate-pulse" />
          <Bell size={13} className="text-neutral-500" />
        </div>
      </div>

      {/* Center notch/pill (modern Android style element) */}
      <div className="hidden sm:flex h-5 w-24 bg-neutral-200/70 rounded-full border border-neutral-300/40 items-center justify-center text-[9px] text-neutral-500 font-mono tracking-widest uppercase">
        Pixel Frame
      </div>

      {/* Right side: Connection states, Battery details, & User badge */}
      <div className="flex items-center space-x-3.5">
        <div className="flex items-center space-x-1.5 text-neutral-600">
          <Signal size={14} className="text-neutral-700" />
          <Wifi size={14} className="text-neutral-700" />
          <div className="flex items-center space-x-1">
            <Battery size={15} className="text-neutral-700" />
            <span className="text-[10px] tracking-tight">{batteryLevel}%</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-2 pl-2 border-l border-neutral-300">
            <span className="hidden md:inline text-[11px] text-neutral-700 font-medium max-w-[120px] truncate">
              {user.displayName || 'Me'}
            </span>
            <button 
              onClick={onLogout}
              className="group relative flex items-center focus:outline-none"
              title="Sign Out"
              id="btn-statusbar-avatar"
            >
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full border border-neutral-300 hover:ring-2 hover:ring-indigo-400 transition-all shadow-sm object-cover" 
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm hover:ring-2 hover:ring-indigo-400 transition-all">
                  {user.displayName ? user.displayName.charAt(0) : 'G'}
                </div>
              )}
              {/* Tooltip */}
              <div className="absolute top-8 right-0 scale-0 group-hover:scale-100 transition-all origin-top-right bg-neutral-800 text-white text-[9px] px-2 py-1 rounded shadow-md z-50 whitespace-nowrap">
                Sign Out
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
