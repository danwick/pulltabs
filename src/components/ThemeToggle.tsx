'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sparkles, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { mode, setMode, isJackpot } = useTheme();

  return (
    <button
      onClick={() => setMode(isJackpot ? 'default' : 'jackpot')}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
        ${isJackpot
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      title={isJackpot ? 'Switch to Default Mode' : 'Switch to Jackpot Mode'}
    >
      {isJackpot ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">Default</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Jackpot Mode</span>
        </>
      )}
    </button>
  );
}
