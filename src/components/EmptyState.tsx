'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

type EmptyStateVariant = 'no-results' | 'no-location' | 'error' | 'offline' | 'welcome' | 'custom';

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

const variantImages: Record<Exclude<EmptyStateVariant, 'custom'>, string> = {
  'no-results': '/illustrations/no-results.png',
  'no-location': '/illustrations/no-location.png',
  'error': '/illustrations/error.png',
  'offline': '/illustrations/offline.png',
  'welcome': '/illustrations/welcome.png',
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

  // Get the illustration image for this variant
  const illustrationSrc = variant !== 'custom' ? variantImages[variant] : null;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      {/* Illustration */}
      <div className="w-48 h-48 mb-6 flex items-center justify-center">
        {icon ? (
          <div
            className="w-32 h-32 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--theme-accent-light)' }}
          >
            {icon}
          </div>
        ) : illustrationSrc ? (
          <Image
            src={illustrationSrc}
            alt={title}
            width={192}
            height={192}
            className="object-contain"
            priority
          />
        ) : (
          <div
            className="w-32 h-32 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--theme-accent-light)' }}
          >
            <span className="text-4xl" style={{ color: 'var(--theme-accent)' }}>✨</span>
          </div>
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

export function WelcomeState({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <EmptyState
      variant="welcome"
      title="Welcome to Pulltab Magic"
      description="Discover pull-tab locations near you. Enable location or browse the map to get started."
      action={onGetStarted ? { label: 'Get Started', onClick: onGetStarted } : undefined}
    />
  );
}
