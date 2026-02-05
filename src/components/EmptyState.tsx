'use client';

import { ReactNode } from 'react';
import { MapPin, Search, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

type EmptyStateVariant = 'no-results' | 'no-location' | 'error' | 'offline' | 'custom';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  className?: string;
}

const variantIcons: Record<Exclude<EmptyStateVariant, 'custom'>, typeof Search> = {
  'no-results': Search,
  'no-location': MapPin,
  'error': AlertTriangle,
  'offline': WifiOff,
};

const variantEmoji: Record<Exclude<EmptyStateVariant, 'custom'>, string> = {
  'no-results': '🎰',
  'no-location': '📍',
  'error': '⚠️',
  'offline': '📡',
};

export default function EmptyState({
  variant = 'custom',
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  const { isJackpot } = useTheme();

  // Determine which icon to show
  let IconComponent: typeof Search | null = null;
  let emoji: string | null = null;

  if (icon) {
    // Custom icon provided - use it directly
  } else if (variant !== 'custom') {
    IconComponent = variantIcons[variant];
    emoji = variantEmoji[variant];
  }

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {/* Icon/Illustration */}
      <div
        className="w-32 h-32 mb-6 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--theme-accent-light)' }}
      >
        {icon ? (
          icon
        ) : IconComponent ? (
          <IconComponent
            className="w-12 h-12"
            style={{
              color: variant === 'error' ? 'var(--theme-error)' : 'var(--theme-accent)',
            }}
          />
        ) : emoji ? (
          <span className="text-4xl" style={{ color: 'var(--theme-accent)' }}>
            {emoji}
          </span>
        ) : (
          <span className="text-4xl" style={{ color: 'var(--theme-accent)' }}>✨</span>
        )}
      </div>

      {/* Title */}
      <h3
        className="heading text-xl font-semibold mb-2 text-balance"
        style={{ color: 'var(--theme-text-primary)' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-sm max-w-xs mb-6 text-pretty"
        style={{ color: 'var(--theme-text-secondary)' }}
      >
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2`}
          style={{
            background: 'var(--theme-accent)',
            color: 'var(--theme-bg)',
            // @ts-expect-error CSS custom properties
            '--tw-ring-color': 'var(--theme-accent)',
            '--tw-ring-offset-color': 'var(--theme-bg)',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pre-configured empty states for common use cases
export function NoResultsState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      variant="no-results"
      title="No locations found"
      description="Try adjusting your filters or search in a different area."
      action={onClearFilters ? { label: 'Clear Filters', onClick: onClearFilters } : undefined}
    />
  );
}

export function NoLocationState({ onEnableLocation }: { onEnableLocation?: () => void }) {
  return (
    <EmptyState
      variant="no-location"
      title="Location access needed"
      description="Enable location services to find pull-tabs near you."
      action={onEnableLocation ? { label: 'Enable Location', onClick: onEnableLocation } : undefined}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      variant="error"
      title="Something went wrong"
      description="We couldn't load the locations. Please try again."
      action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
    />
  );
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      variant="offline"
      title="You're offline"
      description="Check your internet connection and try again."
      action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
    />
  );
}
