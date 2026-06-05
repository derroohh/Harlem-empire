import { useState, useEffect } from 'react';
import { 
  subscribeToAuthChanges, 
  signInWithGoogle, 
  logoutUser 
} from './firebase';
import type { GoogleUser } from './types';
import { StatusBar } from './components/StatusBar';
import { BottomNavBar, type TabType } from './components/BottomNavBar';
import { LoginScreen } from './components/LoginScreen';
import { Calculator } from './components/Calculator';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { 
  WeatherWidget, 
  FitnessWidget, 
  TasksWidget, 
  NotesWidget, 
  CalendarWidget, 
  AndroidTipsWidget 
} from './components/Widgets';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, UserCheck, Shield, KeyRound, Sparkles, Smartphone, Code2, Sliders } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [toolSegment, setToolSegment] = useState<'calc' | 'java'>('java');
  const [appInitializing, setAppInitializing] = useState(true);

  // Subscribe to persistent Firebase authentication state modifications on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setAppInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login sequence error:", error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setActiveTab('home'); // Reset to default home tab
    } catch (error) {
      console.error("Sign-out sequence error:", error);
    }
  };

  // Rendering a gorgeous Material You loading state during initial session lookup
  if (appInitializing) {
    return (
      <div id="android-preloader" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-neutral-600 select-none">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-12 h-12 rounded-full border-4 border-indigo-200 animate-pulse" />
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-bold text-neutral-400 font-mono tracking-widest uppercase">Initializing Pixel System</p>
      </div>
    );
  }

  return (
    <div 
      id="android-system-root" 
      className="min-h-screen font-sans bg-gradient-to-tr from-rose-50/80 via-indigo-50/60 to-cyan-50/70 text-neutral-800 transition-all duration-300 flex items-center justify-center p-0 md:p-6"
    >
      {/* 
        This acts as a premium interactive physical smartphone shell/tablet canvas in desktops, 
        and fluidly expands to full screen on real mobile devices for authentic Android look and feel.
      */}
      <div 
        id="device-container-shell" 
        className="w-full h-full md:max-w-4xl min-h-screen md:min-h-[850px] md:h-[880px] bg-neutral-50/90 backdrop-blur-3xl md:rounded-[42px] border border-neutral-200/50 shadow-[0_24px_70px_rgba(0,0,0,0.06)] md:shadow-[0_45px_120px_rgba(99,102,241,0.07)] flex flex-col overflow-hidden relative"
      >
        {/* Decorative corner highlights for the smooth frame curved notches */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-neutral-300/10 rounded-tl-[42px] pointer-events-none hidden md:block" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-neutral-300/10 rounded-tr-[42px] pointer-events-none hidden md:block" />

        {/* Global android top notifications and hour status layout */}
        <StatusBar user={user} onLogout={handleLogout} />

        {/* Scrollable central content area mimicking high contrast Material screen workspace */}
        <div id="android-screen-workspace" className="flex-1 overflow-y-auto px-6 py-6 font-sans">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex items-center justify-center min-h-[600px]"
              >
                <LoginScreen onLogin={handleLogin} isLoggingIn={isLoggingIn} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full space-y-6"
              >
                {/* Active Tab Panel routing with fluid animations */}
                {activeTab === 'home' && (
                  <div key="tab-home" className="space-y-6">
                    {/* Welcome Header greeting */}
                    <div className="flex items-center justify-between select-none p-1 shrink-0">
                      <div>
                        <h2 id="home-greeting-headline" className="text-2xl font-black text-neutral-800 tracking-tight">
                          Hello, {user.displayName ? user.displayName.split(' ')[0] : 'Developer'}!
                        </h2>
                        <span className="text-xs font-semibold text-neutral-400">Welcome to your floating widgets hub</span>
                      </div>
                      <div className="hidden sm:flex text-right flex-col text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        <span>Light Theme</span>
                        <span className="text-indigo-600 font-black">Activated</span>
                      </div>
                    </div>

                    {/* Highly responsive layout hosting rounded cards with elevation shadows */}
                    <div id="widgets-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
                      <WeatherWidget />
                      <FitnessWidget />
                      <div className="md:col-span-2">
                        <TasksWidget />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'discover' && (
                  <div key="tab-discover" className="space-y-6">
                    <div className="flex items-center justify-between select-none p-1">
                      <div>
                        <h2 id="discover-headline" className="text-x2 text-xl font-extrabold text-neutral-800 tracking-tight">Creative Space</h2>
                        <span className="text-xs font-semibold text-neutral-400">Uncover tips and keep logs</span>
                      </div>
                    </div>

                    <div id="discover-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <NotesWidget />
                      <CalendarWidget />
                      <div className="md:col-span-2">
                        <AndroidTipsWidget />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'utilities' && (
                  <motion.div 
                    key="tab-utilities"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full space-y-6"
                  >
                    {/* Modern Segmented Toggle Bar */}
                    <div className="flex bg-neutral-200/60 p-1.5 rounded-2xl w-full max-w-md mx-auto select-none border border-neutral-300/30">
                      <button
                        id="btn-segment-java-code"
                        onClick={() => setToolSegment('java')}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                          toolSegment === 'java'
                            ? 'bg-white text-indigo-700 shadow-md ring-1 ring-neutral-200/50'
                            : 'text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        <Code2 size={14} />
                        <span>Support v4 Java Exporter</span>
                      </button>
                      <button
                        id="btn-segment-calculator"
                        onClick={() => setToolSegment('calc')}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                          toolSegment === 'calc'
                            ? 'bg-white text-indigo-700 shadow-md ring-1 ring-neutral-200/50'
                            : 'text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        <Sliders size={14} />
                        <span>Interactive Calculator</span>
                      </button>
                    </div>

                    {/* Render active tool */}
                    {toolSegment === 'java' ? (
                      <div className="animate-fade-in">
                        <AndroidCodeViewer />
                      </div>
                    ) : (
                      <div className="flex justify-center animate-fade-in">
                        <Calculator />
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'account' && (
                  <div key="tab-account" className="max-w-xl mx-auto space-y-6">
                    <div className="select-none p-1">
                      <h2 id="account-headline" className="text-xl font-extrabold text-neutral-800 tracking-tight">User Profile System</h2>
                      <span className="text-xs font-semibold text-neutral-400">Authenticated Google Account Credentials</span>
                    </div>

                    {/* Profile detail card */}
                    <div id="account-identity-card" className="bg-white rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.035)] border border-neutral-100 flex flex-col items-center text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full filter blur-xl -mr-10 -mt-10 pointer-events-none" />

                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Account Avatar" 
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-full border-2 border-indigo-500 shadow-md object-cover mb-4"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md mb-4">
                          {user.displayName ? user.displayName.charAt(0) : 'U'}
                        </div>
                      )}

                      <h3 id="account-display-name" className="text-lg font-bold text-neutral-800 tracking-tight">{user.displayName || 'OAuth Account'}</h3>
                      <p id="account-email" className="text-xs text-neutral-400 font-semibold mb-6">{user.email}</p>

                      <div className="w-full text-left space-y-3 pt-5 border-t border-neutral-100">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 flex items-center space-x-1.5">
                          <Shield size={13} className="text-indigo-500" />
                          <span>Credentials Registry</span>
                        </h4>

                        <div className="flex justify-between items-center bg-neutral-50 px-3 py-2.5 rounded-xl border border-neutral-100">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                            <KeyRound size={11} className="text-neutral-500" />
                            <span>System ID</span>
                          </span>
                          <span id="account-uid-badge" className="text-[10px] font-mono font-bold text-neutral-700 bg-neutral-200/50 px-2 py-0.5 rounded-md max-w-[150px] truncate">
                            {user.uid}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-neutral-50 px-3 py-2.5 rounded-xl border border-neutral-100">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                            <UserCheck size={11} className="text-neutral-500" />
                            <span>Auth Core</span>
                          </span>
                          <span id="account-auth-domain" className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                            Google identity-v3
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-neutral-50 px-3 py-2.5 rounded-xl border border-neutral-100">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                            <ShieldAlert size={11} className="text-amber-500" />
                            <span>Scopes Authorized</span>
                          </span>
                          <span id="account-scopes-count" className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            3 Scopes
                          </span>
                        </div>
                      </div>

                      {/* Log out primary button */}
                      <button
                        id="btn-profile-signout"
                        onClick={handleLogout}
                        className="w-full mt-6 py-2.5 bg-neutral-100 hover:bg-neutral-200/90 text-neutral-700 hover:text-neutral-800 font-bold text-xs rounded-xl transition-all cursor-pointer select-none"
                      >
                        Sign out of account
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global bottom navigation control bar */}
        {user && (
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}
