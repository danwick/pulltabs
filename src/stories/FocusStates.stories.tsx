import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MapPin, Search, X, ChevronRight, Star, Menu } from 'lucide-react';
import '../app/globals.css';

/**
 * Focus States & Accessibility
 *
 * Keyboard navigation indicators for all interactive elements.
 * Critical for accessibility compliance (WCAG 2.1 AA).
 */

function FocusStatesShowcase() {
  return (
    <div className="p-8" style={{ background: 'var(--theme-bg)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-display text-3xl mb-2" style={{ color: 'var(--theme-text-primary)' }}>
          Focus States
        </h1>
        <p className="text-body mb-4" style={{ color: 'var(--theme-text-secondary)' }}>
          Keyboard navigation indicators for accessibility.
        </p>
        <p className="text-sm mb-12 p-3 rounded-lg" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }}>
          Press <kbd className="px-2 py-0.5 rounded" style={{ background: 'var(--theme-surface)' }}>Tab</kbd> to navigate through elements and see focus states.
        </p>

        {/* Button Focus States */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Button Focus States
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--theme-text-muted)' }}>
            All buttons use a consistent focus ring pattern.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* Primary Button */}
            <button
              className="px-4 py-2 rounded-lg font-semibold transition-all
                focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: 'var(--theme-accent)',
                color: 'var(--theme-bg)',
                // @ts-expect-error CSS custom properties
                '--tw-ring-color': 'var(--theme-accent)',
                '--tw-ring-offset-color': 'var(--theme-bg)',
              }}
            >
              Primary Button
            </button>

            {/* Secondary Button */}
            <button
              className="px-4 py-2 rounded-lg font-semibold transition-all
                focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: 'var(--theme-surface)',
                color: 'var(--theme-text-primary)',
                border: '1px solid var(--theme-border)',
                // @ts-expect-error CSS custom properties
                '--tw-ring-color': 'var(--theme-accent)',
                '--tw-ring-offset-color': 'var(--theme-bg)',
              }}
            >
              Secondary Button
            </button>

            {/* Ghost Button */}
            <button
              className="px-4 py-2 rounded-lg font-semibold transition-all
                focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: 'transparent',
                color: 'var(--theme-accent)',
                border: '1px solid var(--theme-accent)',
                // @ts-expect-error CSS custom properties
                '--tw-ring-color': 'var(--theme-accent)',
                '--tw-ring-offset-color': 'var(--theme-bg)',
              }}
            >
              Ghost Button
            </button>

            {/* Icon Button */}
            <button
              className="p-2 rounded-lg transition-all
                focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: 'var(--theme-surface)',
                color: 'var(--theme-text-primary)',
                border: '1px solid var(--theme-border)',
                // @ts-expect-error CSS custom properties
                '--tw-ring-color': 'var(--theme-accent)',
                '--tw-ring-offset-color': 'var(--theme-bg)',
              }}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--theme-surface)' }}>
            <h4 className="heading text-sm mb-2" style={{ color: 'var(--theme-text-primary)' }}>Implementation</h4>
            <code className="text-xs block" style={{ color: 'var(--theme-accent)' }}>
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[accent-color]
            </code>
          </div>
        </section>

        {/* Input Focus States */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Input Focus States
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--theme-text-muted)' }}>
            Form inputs highlight with accent color border and subtle glow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--theme-text-secondary)' }}>
                Search Input
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search locations..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all
                    focus:outline-none"
                  style={{
                    background: 'var(--theme-input-bg)',
                    border: '1px solid var(--theme-input-border)',
                    color: 'var(--theme-text-primary)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--theme-input-border-focus)';
                    e.target.style.boxShadow = '0 0 0 3px var(--theme-accent-light)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--theme-input-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Select/Dropdown */}
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--theme-text-secondary)' }}>
                Dropdown Select
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg text-sm transition-all appearance-none
                  focus:outline-none"
                style={{
                  background: 'var(--theme-input-bg)',
                  border: '1px solid var(--theme-input-border)',
                  color: 'var(--theme-text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--theme-input-border-focus)';
                  e.target.style.boxShadow = '0 0 0 3px var(--theme-accent-light)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--theme-input-border)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option>Select e-tab system</option>
                <option>Pilot</option>
                <option>3 Diamonds</option>
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--theme-surface)' }}>
            <h4 className="heading text-sm mb-2" style={{ color: 'var(--theme-text-primary)' }}>Implementation</h4>
            <code className="text-xs block" style={{ color: 'var(--theme-accent)' }}>
              focus:border-[accent] focus:ring-3 focus:ring-[accent-light]
            </code>
          </div>
        </section>

        {/* Card/Link Focus States */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Card & Link Focus States
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--theme-text-muted)' }}>
            Interactive cards and links use a visible ring on focus.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clickable Card */}
            <button
              className="text-left p-4 rounded-xl transition-all
                focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: 'var(--theme-card-bg)',
                border: '1px solid var(--theme-border)',
                // @ts-expect-error CSS custom properties
                '--tw-ring-color': 'var(--theme-accent)',
                '--tw-ring-offset-color': 'var(--theme-bg)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: 'var(--theme-accent-light)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--theme-accent)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="heading text-base font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                    Lucky's Gaming Lounge
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                    567 Oak Avenue, St. Paul
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 mt-1" style={{ color: 'var(--theme-text-muted)' }} />
              </div>
            </button>

            {/* Premium Card */}
            <button
              className="text-left p-4 rounded-xl transition-all
                focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: 'var(--theme-card-bg)',
                border: '1px solid var(--theme-accent)',
                // @ts-expect-error CSS custom properties
                '--tw-ring-color': 'var(--theme-accent)',
                '--tw-ring-offset-color': 'var(--theme-bg)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: 'var(--theme-accent-light)' }}
                >
                  <Star className="w-5 h-5" style={{ color: 'var(--theme-accent)' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="heading text-base font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                      Premium Location
                    </h3>
                    <span className="text-condensed text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }}>
                      PREMIUM
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                    123 Main Street, Minneapolis
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 mt-1" style={{ color: 'var(--theme-text-muted)' }} />
              </div>
            </button>
          </div>
        </section>

        {/* Chip/Toggle Focus States */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Chip & Toggle Focus States
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--theme-text-muted)' }}>
            Filter chips and toggles need visible focus for keyboard selection.
          </p>

          <div className="flex flex-wrap gap-3">
            {['$1', '$2', '$3', '$5'].map((price) => (
              <button
                key={price}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all
                  focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  background: price === '$2' ? 'var(--theme-tertiary)' : 'var(--theme-surface)',
                  color: price === '$2' ? 'white' : 'var(--theme-text-secondary)',
                  border: price === '$2' ? 'none' : '1px solid var(--theme-border)',
                  // @ts-expect-error CSS custom properties
                  '--tw-ring-color': 'var(--theme-tertiary)',
                  '--tw-ring-offset-color': 'var(--theme-bg)',
                }}
              >
                {price}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {['Booth', 'Behind Bar', 'Machine'].map((type, i) => (
              <button
                key={type}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all
                  focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  background: i === 0 ? 'var(--theme-accent)' : 'var(--theme-surface)',
                  color: i === 0 ? 'var(--theme-bg)' : 'var(--theme-text-secondary)',
                  border: i === 0 ? 'none' : '1px solid var(--theme-border)',
                  // @ts-expect-error CSS custom properties
                  '--tw-ring-color': 'var(--theme-accent)',
                  '--tw-ring-offset-color': 'var(--theme-bg)',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Close/Dismiss Buttons */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Close & Dismiss Actions
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--theme-text-muted)' }}>
            Close buttons need high-contrast focus states for accessibility.
          </p>

          <div className="flex gap-6">
            {/* Light Close Button */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)' }}>
              <button
                className="p-2 rounded-lg transition-all
                  focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--theme-surface-hover)',
                  color: 'var(--theme-text-muted)',
                  // @ts-expect-error CSS custom properties
                  '--tw-ring-color': 'var(--theme-accent)',
                }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="text-xs mt-2" style={{ color: 'var(--theme-text-muted)' }}>Light surface</p>
            </div>

            {/* Dark Close Button */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-text-primary)' }}>
              <button
                className="p-2 rounded-lg transition-all
                  focus:outline-none focus:ring-2"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'var(--theme-bg)',
                  // @ts-expect-error CSS custom properties
                  '--tw-ring-color': 'white',
                }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="text-xs mt-2" style={{ color: 'var(--theme-bg)' }}>Dark surface</p>
            </div>
          </div>
        </section>

        {/* Accessibility Guidelines */}
        <section className="p-6 rounded-xl" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
          <h2 className="heading text-xl mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Accessibility Guidelines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="heading text-sm mb-3" style={{ color: 'var(--theme-accent)' }}>Focus Ring Requirements</h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                <li>+ Minimum 2px ring width</li>
                <li>+ 3:1 contrast ratio against adjacent colors</li>
                <li>+ Use ring-offset for dark backgrounds</li>
                <li>+ Consistent focus style across all interactive elements</li>
                <li>+ Never remove focus outline entirely</li>
              </ul>
            </div>
            <div>
              <h3 className="heading text-sm mb-3" style={{ color: 'var(--theme-accent)' }}>Keyboard Navigation</h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                <li>+ All interactive elements must be focusable</li>
                <li>+ Tab order follows visual layout</li>
                <li>+ Escape closes modals/dropdowns</li>
                <li>+ Arrow keys for chip/toggle groups</li>
                <li>+ Enter/Space activates buttons</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--theme-accent-light)' }}>
            <h4 className="heading text-sm mb-2" style={{ color: 'var(--theme-accent)' }}>
              CSS Custom Properties for Focus
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
              <div><code>--theme-input-border-focus</code></div>
              <div>Input focus border color</div>
              <div><code>--theme-accent-light</code></div>
              <div>Focus ring glow color</div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg" style={{ background: 'var(--theme-warning-light)' }}>
            <h4 className="heading text-sm mb-2" style={{ color: 'var(--theme-warning)' }}>
              Never Do This
            </h4>
            <code className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
              *:focus {'{'} outline: none; {'}'}
            </code>
            <p className="text-xs mt-2" style={{ color: 'var(--theme-text-muted)' }}>
              This removes focus indicators entirely, breaking keyboard accessibility.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function JackpotModeFocusStates() {
  return (
    <div className="jackpot-mode">
      <FocusStatesShowcase />
    </div>
  );
}

function DefaultModeFocusStates() {
  return <FocusStatesShowcase />;
}

const meta: Meta = {
  title: 'Design System/Focus States',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const JackpotMode: Story = {
  render: () => <JackpotModeFocusStates />,
};

export const DefaultMode: Story = {
  render: () => <DefaultModeFocusStates />,
};
