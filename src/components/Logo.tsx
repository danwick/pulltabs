'use client';

import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

const taglineSizes = {
  sm: 'text-[8px]',
  md: 'text-[10px]',
  lg: 'text-xs',
  xl: 'text-sm',
};

export default function Logo({ size = 'md', showTagline = false, className = '' }: LogoProps) {
  const { isJackpot } = useTheme();

  return (
    <div className={`inline-block ${className}`}>
      <div className={sizeClasses[size]}>
        <span
          className={`logo-brand transition-colors ${
            isJackpot ? 'text-yellow-400' : 'text-gray-900'
          }`}
        >
          Pulltab
        </span>
        <span
          className={`logo-magic transition-colors ${
            isJackpot ? 'text-cyan-300' : 'text-blue-500'
          }`}
        >
          Magic
        </span>
      </div>
      {showTagline && (
        <p
          className={`text-condensed ${taglineSizes[size]} mt-0.5 transition-colors ${
            isJackpot ? 'text-yellow-400/70' : 'text-gray-500'
          }`}
        >
          FIND THE WIN
        </p>
      )}
    </div>
  );
}
