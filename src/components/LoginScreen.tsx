import React, { useState } from 'react';
import { Smartphone, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: () => Promise<void>;
  isLoggingIn: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoggingIn }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setErrorMsg(null);
      await onLogin();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication could not complete. Please retry.');
    }
  };

  return (
    <div id="android-login-screen" className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-md mx-auto p-6 text-neutral-800">
      {/* Decorative Mock Status Area */}
      <Smartphone className="w-12 h-12 text-indigo-500 mb-4 animate-bounce" />

      <h1 className="text-3xl font-bold font-sans tracking-tight text-neutral-900 text-center mb-1">
        Android Cards Hub
      </h1>
      <p className="text-sm text-neutral-500 text-center font-medium max-w-xs mb-8">
        Floating widgets and cards styled with Material Design 3 and Google OAuth
      </p>

      {/* Floating Login Card */}
      <motion.div 
        id="login-card-root"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(99,102,241,0.08)] border border-neutral-100 flex flex-col items-center relative overflow-hidden"
      >
        {/* Subtle decorative color blob inside card */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full filter blur-xl -mr-10 -mt-10 pointer-events-none" />

        <div className="relative p-3 bg-indigo-50 rounded-2xl mb-4">
          <Lock className="w-6 h-6 text-indigo-600" />
        </div>

        <h2 className="text-lg font-bold text-neutral-800 mb-1 z-10">
          Seamless Sign In
        </h2>
        <p className="text-xs text-neutral-400 text-center max-w-xs mb-6 px-4 z-10">
          Instantly load your user details, custom widgets, and avatar directly from your secure Google Profile.
        </p>

        {/* Custom official-looking sign in with Google button */}
        <button 
          id="btn-google-oauth-signin"
          onClick={handleSignIn}
          disabled={isLoggingIn}
          className="relative inline-flex items-center justify-between w-full max-w-xs h-12 px-4 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 font-semibold text-sm rounded-full border border-neutral-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-60 cursor-pointer select-none group"
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center w-full space-x-3">
              <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-neutral-500 font-medium">Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full relative">
              <div className="absolute left-0 w-6 h-6 flex items-center justify-center">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="text-neutral-700 text-sm font-semibold pl-8">Sign in with Google</span>
            </div>
          )}
        </button>

        {errorMsg && (
          <p id="oauth-error-text" className="mt-4 text-xs font-semibold text-rose-500 max-w-xs text-center">
            {errorMsg}
          </p>
        )}

        {/* Feature benefits inside login card */}
        <div className="w-full mt-6 pt-5 border-t border-neutral-100 flex flex-col space-y-2.5">
          <div className="flex items-center space-x-2.5 text-neutral-600 text-xs text-left">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>Interactive floating widgets with dynamic shadows</span>
          </div>
          <div className="flex items-center space-x-2.5 text-neutral-600 text-xs text-left">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>Responsive layout adapting seamlessly to screen size</span>
          </div>
          <div className="flex items-center space-x-2.5 text-neutral-600 text-xs text-left">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>Fully persistent Quick Notes & Task tracker</span>
          </div>
        </div>
      </motion.div>

      {/* Aesthetic hint */}
      <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase mt-6 flex items-center space-x-1.5 select-none">
        <Sparkles size={11} className="text-amber-400" />
        <span>Material You Experience</span>
      </span>
    </div>
  );
};
