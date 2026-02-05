import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MapPin, Search, WifiOff, AlertTriangle, RefreshCw, Frown } from 'lucide-react';
import '../app/globals.css';

/**
 * Empty & Error States
 *
 * Patterns for when there's no data to display or something goes wrong.
 * These need illustrations - see prompts at the bottom for AI generation.
 */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  illustration?: 'no-results' | 'no-location' | 'error' | 'offline';
}

function EmptyState({ icon, title, description, action, illustration }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Illustration placeholder - replace with actual images */}
      <div
        className="w-32 h-32 mb-6 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--theme-accent-light)' }}
      >
        {icon || (
          <span className="text-4xl" style={{ color: 'var(--theme-accent)' }}>
            {illustration === 'no-results' && '🎰'}
            {illustration === 'no-location' && '📍'}
            {illustration === 'error' && '⚠️'}
            {illustration === 'offline' && '📡'}
            {!illustration && '✨'}
          </span>
        )}
      </div>

      <h3
        className="heading text-xl font-semibold mb-2"
        style={{ color: 'var(--theme-text-primary)' }}
      >
        {title}
      </h3>

      <p
        className="text-sm max-w-xs mb-6"
        style={{ color: 'var(--theme-text-secondary)' }}
      >
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

function EmptyStatesShowcase() {
  return (
    <div className="p-8" style={{ background: 'var(--theme-bg)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-display text-3xl mb-2" style={{ color: 'var(--theme-text-primary)' }}>
          Empty & Error States
        </h1>
        <p className="text-body mb-12" style={{ color: 'var(--theme-text-secondary)' }}>
          Patterns for handling missing data and errors gracefully.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* No Results */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--theme-border)' }}>
              <h2 className="heading text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>No Search Results</h2>
            </div>
            <EmptyState
              illustration="no-results"
              title="No locations found"
              description="Try adjusting your filters or search in a different area."
              action={{ label: 'Clear Filters' }}
            />
          </div>

          {/* No Location Permission */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--theme-border)' }}>
              <h2 className="heading text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>Location Denied</h2>
            </div>
            <EmptyState
              illustration="no-location"
              title="Location access needed"
              description="Enable location services to find pull-tabs near you."
              action={{ label: 'Enable Location' }}
            />
          </div>

          {/* API Error */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--theme-border)' }}>
              <h2 className="heading text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>Error State</h2>
            </div>
            <EmptyState
              illustration="error"
              title="Something went wrong"
              description="We couldn't load the locations. Please try again."
              action={{ label: 'Retry' }}
            />
          </div>

          {/* Offline */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--theme-border)' }}>
              <h2 className="heading text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>Offline</h2>
            </div>
            <EmptyState
              illustration="offline"
              title="You're offline"
              description="Check your internet connection and try again."
              action={{ label: 'Retry' }}
            />
          </div>
        </div>

        {/* With Icon Variants */}
        <h2 className="heading text-xl mt-16 mb-6" style={{ color: 'var(--theme-text-primary)' }}>
          Icon-Only Variants (No Illustration)
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--theme-text-muted)' }}>
          Use these when you don't have custom illustrations yet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <EmptyState
              icon={<Search className="w-12 h-12" style={{ color: 'var(--theme-accent)' }} />}
              title="No locations found"
              description="Try adjusting your filters or search in a different area."
              action={{ label: 'Clear Filters' }}
            />
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <EmptyState
              icon={<MapPin className="w-12 h-12" style={{ color: 'var(--theme-accent)' }} />}
              title="Enable location"
              description="Allow location access to find pull-tabs near you."
              action={{ label: 'Enable' }}
            />
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <EmptyState
              icon={<AlertTriangle className="w-12 h-12" style={{ color: 'var(--theme-error)' }} />}
              title="Something went wrong"
              description="We couldn't load the locations. Please try again."
              action={{ label: 'Retry' }}
            />
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <EmptyState
              icon={<WifiOff className="w-12 h-12" style={{ color: 'var(--theme-text-muted)' }} />}
              title="You're offline"
              description="Check your internet connection and try again."
              action={{ label: 'Retry' }}
            />
          </div>
        </div>

        {/* Asset Generation Prompts */}
        <div className="mt-16 p-6 rounded-xl" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
          <h2 className="heading text-xl mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Illustration Prompts for AI Generation
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--theme-text-secondary)' }}>
            Use these prompts with Gemini, Midjourney, or similar tools to generate custom illustrations.
          </p>

          <div className="space-y-6">
            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
              <h3 className="heading text-sm font-semibold mb-2" style={{ color: 'var(--theme-accent)' }}>
                No Results Illustration
              </h3>
              <p className="text-sm font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                "Friendly cartoon magician character with top hat looking through an empty pull-tab ticket with a magnifying glass, confused expression, gold and dark blue color scheme, flat illustration style, casino/gaming aesthetic, transparent background, suitable for dark mode UI"
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
              <h3 className="heading text-sm font-semibold mb-2" style={{ color: 'var(--theme-accent)' }}>
                Location Permission Illustration
              </h3>
              <p className="text-sm font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                "Cartoon magician character holding a glowing map pin marker, friendly gesture inviting user, gold sparkles around the pin, dark blue and gold color scheme, flat illustration style, casino/gaming aesthetic, transparent background"
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
              <h3 className="heading text-sm font-semibold mb-2" style={{ color: 'var(--theme-accent)' }}>
                Error State Illustration
              </h3>
              <p className="text-sm font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                "Cartoon magician character with a broken magic wand, apologetic expression, small puff of smoke, gold and dark blue color scheme with subtle red accents, flat illustration style, casino/gaming aesthetic, transparent background"
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
              <h3 className="heading text-sm font-semibold mb-2" style={{ color: 'var(--theme-accent)' }}>
                Offline Illustration
              </h3>
              <p className="text-sm font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                "Cartoon magician character looking at a disconnected WiFi symbol floating in their top hat, confused but friendly expression, gold and dark blue color scheme, flat illustration style, casino/gaming aesthetic, transparent background"
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
              <h3 className="heading text-sm font-semibold mb-2" style={{ color: 'var(--theme-accent)' }}>
                Empty List / First Time User
              </h3>
              <p className="text-sm font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                "Cartoon magician character gesturing welcomingly towards a glowing map with gold location pins, inviting first-time user, sparkles and magical effects, gold and dark blue color scheme, flat illustration style, casino/gaming aesthetic, transparent background"
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--theme-accent-light)' }}>
            <h3 className="heading text-sm font-semibold mb-2" style={{ color: 'var(--theme-accent)' }}>
              Style Guidelines for All Illustrations
            </h3>
            <ul className="text-sm space-y-1" style={{ color: 'var(--theme-text-secondary)' }}>
              <li>• Size: 256x256px or 512x512px (will be displayed at 128x128)</li>
              <li>• Format: PNG with transparent background</li>
              <li>• Colors: Gold (#fbbf24), Deep Blue (#1e3a8a), Dark (#09090b)</li>
              <li>• Style: Flat/vector-like, friendly, slightly whimsical</li>
              <li>• Character: Use the magician mascot from brand guidelines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function JackpotModeEmptyStates() {
  return (
    <div className="jackpot-mode">
      <EmptyStatesShowcase />
    </div>
  );
}

function DefaultModeEmptyStates() {
  return <EmptyStatesShowcase />;
}

const meta: Meta = {
  title: 'Design System/Empty States',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const JackpotMode: Story = {
  render: () => <JackpotModeEmptyStates />,
};

export const DefaultMode: Story = {
  render: () => <DefaultModeEmptyStates />,
};
