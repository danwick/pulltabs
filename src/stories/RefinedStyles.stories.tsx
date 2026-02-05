import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MapPin, Star, ChevronRight, Navigation, Clock } from 'lucide-react';
import '../app/globals.css';

/**
 * REFINED STYLES
 *
 * Concept A (Pulltab Magic) with borrowed elements:
 * - Cleaner inputs (from Prediction Market)
 * - Data density (from Sports Betting)
 * - Better contrast and hierarchy
 * - Simplified badge styling
 */

function RefinedShowcase() {
  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--theme-bg)' }}>
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--theme-text-primary)' }}>
            Refined Pulltab Magic
          </h1>
          <p style={{ color: 'var(--theme-text-secondary)' }}>
            Concept A with cleaner inputs, better data density, and improved contrast.
          </p>
        </div>

        {/* Color Palette */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Refined Color Palette
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {[
              { name: 'Accent', var: '--theme-accent' },
              { name: 'Accent Hover', var: '--theme-accent-hover' },
              { name: 'Secondary', var: '--theme-secondary' },
              { name: 'Tertiary', var: '--theme-tertiary' },
              { name: 'Success', var: '--theme-success' },
              { name: 'Surface', var: '--theme-surface' },
              { name: 'Border', var: '--theme-border' },
              { name: 'Text', var: '--theme-text-primary' },
            ].map(({ name, var: cssVar }) => (
              <div key={name} className="text-center">
                <div
                  className="w-full aspect-square rounded-lg border border-white/10"
                  style={{ background: `var(${cssVar})` }}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--theme-text-muted)' }}>{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Buttons
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary">
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
            <button className="btn btn-secondary">View Details</button>
            <button className="btn btn-ghost">Learn More</button>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Clean Inputs
          </h2>
          <div className="space-y-3 max-w-md">
            <input
              type="text"
              className="input-clean w-full"
              placeholder="Search locations..."
            />
            <input
              type="text"
              className="input-clean w-full"
              defaultValue="Minneapolis, MN"
            />
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="badge">Pull-Tabs</span>
            <span className="badge">E-Tabs</span>
            <span className="badge badge-accent">Premium</span>
            <span className="badge badge-secondary">Pilot</span>
            <span className="badge badge-tertiary">$5</span>
            <span className="badge badge-success">Open Now</span>
          </div>
        </section>

        {/* Price Chips */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Price Chips
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="price-chip">$5</span>
            <span className="price-chip">$3</span>
            <span className="price-chip">$2</span>
            <span className="price-chip">$1</span>
          </div>
        </section>

        {/* Toggle Chips */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Filter Chips
          </h2>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button className="chip-toggle active">Booth</button>
              <button className="chip-toggle">Behind Bar</button>
              <button className="chip-toggle">Machine</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="chip-toggle active-tertiary">$5</button>
              <button className="chip-toggle active-tertiary">$3</button>
              <button className="chip-toggle">$2</button>
              <button className="chip-toggle">$1</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="chip-toggle active-secondary">Pilot</button>
              <button className="chip-toggle">3 Diamonds</button>
            </div>
          </div>
        </section>

        {/* Data Dense Card */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Data-Dense Card
          </h2>
          <div className="max-w-sm">
            <div className="card-dense">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--theme-text-primary)' }}>
                    Lucky's Gaming Lounge
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="distance-indicator">
                      <MapPin />
                      2.3 mi
                    </span>
                    <span style={{ color: 'var(--theme-text-muted)' }}>·</span>
                    <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                      St. Paul, MN
                    </span>
                  </div>
                </div>
                <div className="badge badge-accent">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </div>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="badge">Pull-Tabs</span>
                <span className="badge">E-Tabs</span>
                <span className="badge">Bingo</span>
              </div>

              {/* Data row */}
              <div className="data-row mb-3">
                <div>
                  <span className="data-label">Prices: </span>
                  <span className="data-value">$5 $3 $2 $1</span>
                </div>
                <div>
                  <span className="data-label">Type: </span>
                  <span className="data-value">Booth</span>
                </div>
              </div>

              {/* Hours hint */}
              <div className="flex items-center gap-1.5 mb-4 text-sm" style={{ color: 'var(--theme-success)' }}>
                <Clock className="w-4 h-4" />
                <span>Open until 1 AM</span>
              </div>

              {/* Action */}
              <button className="btn btn-primary w-full">
                Get Directions
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Selected Card State */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Selected Card State
          </h2>
          <div className="max-w-sm">
            <div className="card-dense card-selected">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold" style={{ color: 'var(--theme-text-primary)' }}>
                  The Corner Pub
                </h3>
                <span className="distance-indicator">
                  <MapPin />
                  0.8 mi
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="badge">Pull-Tabs</span>
                <span className="price-chip">$2</span>
                <span className="price-chip">$1</span>
              </div>
            </div>
          </div>
        </section>

        {/* What Changed */}
        <section className="p-6 rounded-xl" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            What's Refined
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
            <li><strong style={{ color: 'var(--theme-accent)' }}>Colors:</strong> Slightly warmer gold (#fbbf24), darker backgrounds for more contrast</li>
            <li><strong style={{ color: 'var(--theme-accent)' }}>Inputs:</strong> Cleaner borders, subtle focus rings, less visual noise</li>
            <li><strong style={{ color: 'var(--theme-accent)' }}>Cards:</strong> Data-dense layout with distance, status, prices visible at glance</li>
            <li><strong style={{ color: 'var(--theme-accent)' }}>Badges:</strong> Simplified with semantic colors (gold=premium, green=prices, purple=e-tabs)</li>
            <li><strong style={{ color: 'var(--theme-accent)' }}>Buttons:</strong> Consistent padding, better hover states</li>
            <li><strong style={{ color: 'var(--theme-accent)' }}>Typography:</strong> Better hierarchy with secondary/muted text levels</li>
          </ul>
        </section>

      </div>
    </div>
  );
}

function JackpotModePreview() {
  return (
    <div className="jackpot-mode">
      <RefinedShowcase />
    </div>
  );
}

function DefaultModePreview() {
  return <RefinedShowcase />;
}

const meta: Meta = {
  title: 'Design System/Refined Styles',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const JackpotMode: Story = {
  render: () => <JackpotModePreview />,
};

export const DefaultMode: Story = {
  render: () => <DefaultModePreview />,
};
