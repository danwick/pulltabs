import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import '../app/globals.css';

/**
 * Shadow & Elevation System
 *
 * Consistent elevation levels for visual hierarchy.
 * Shadows communicate depth and interaction states.
 */

function ShadowShowcase() {
  const shadows = [
    { name: 'shadow-none', css: 'none', use: 'Flat elements, disabled states' },
    { name: 'shadow-sm', css: '0 1px 2px rgba(0,0,0,0.05)', use: 'Subtle lift, badges, chips' },
    { name: 'shadow', css: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)', use: 'Cards at rest, inputs' },
    { name: 'shadow-md', css: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)', use: 'Cards on hover, dropdowns' },
    { name: 'shadow-lg', css: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)', use: 'Modals, popovers, tooltips' },
    { name: 'shadow-xl', css: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)', use: 'Large modals, dialogs' },
    { name: 'shadow-2xl', css: '0 25px 50px rgba(0,0,0,0.25)', use: 'Premium/featured elements' },
  ];

  return (
    <div className="p-8" style={{ background: 'var(--theme-bg)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-display text-3xl mb-2" style={{ color: 'var(--theme-text-primary)' }}>
          Shadow & Elevation
        </h1>
        <p className="text-body mb-12" style={{ color: 'var(--theme-text-secondary)' }}>
          Elevation scale using Tailwind's shadow utilities.
        </p>

        {/* Shadow Scale */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Shadow Scale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shadows.map(({ name, css, use }) => (
              <div
                key={name}
                className="p-6 rounded-xl"
                style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <code className="text-sm font-mono" style={{ color: 'var(--theme-accent)' }}>
                      {name}
                    </code>
                    <p className="text-xs mt-1" style={{ color: 'var(--theme-text-muted)' }}>{use}</p>
                  </div>
                </div>
                <div
                  className={`h-20 rounded-lg ${name}`}
                  style={{ background: 'var(--theme-card-bg)' }}
                />
                <p className="text-xs mt-3 font-mono" style={{ color: 'var(--theme-text-muted)' }}>
                  {css}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Elevation in Context */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Elevation in Context
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--theme-text-muted)' }}>
            How shadows communicate hierarchy and state.
          </p>

          <div className="space-y-8">
            {/* Card States */}
            <div>
              <h3 className="heading text-base mb-4" style={{ color: 'var(--theme-text-primary)' }}>
                Card Interaction States
              </h3>
              <div className="flex gap-6 flex-wrap">
                {/* Default */}
                <div className="text-center">
                  <div
                    className="w-48 h-32 rounded-xl shadow flex items-center justify-center transition-shadow"
                    style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-border)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Default</span>
                  </div>
                  <code className="text-xs mt-2 block" style={{ color: 'var(--theme-text-muted)' }}>shadow</code>
                </div>

                {/* Hover */}
                <div className="text-center">
                  <div
                    className="w-48 h-32 rounded-xl shadow-md flex items-center justify-center"
                    style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-accent)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Hover</span>
                  </div>
                  <code className="text-xs mt-2 block" style={{ color: 'var(--theme-text-muted)' }}>shadow-md</code>
                </div>

                {/* Active/Selected */}
                <div className="text-center">
                  <div
                    className="w-48 h-32 rounded-xl shadow-lg flex items-center justify-center"
                    style={{
                      background: 'var(--theme-card-bg)',
                      border: '2px solid var(--theme-accent)',
                      boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 0 0 3px var(--theme-accent-light)'
                    }}
                  >
                    <span className="text-sm" style={{ color: 'var(--theme-accent)' }}>Selected</span>
                  </div>
                  <code className="text-xs mt-2 block" style={{ color: 'var(--theme-text-muted)' }}>shadow-lg + ring</code>
                </div>
              </div>
            </div>

            {/* Layered UI */}
            <div>
              <h3 className="heading text-base mb-4" style={{ color: 'var(--theme-text-primary)' }}>
                Layered UI Elements
              </h3>
              <div className="relative h-64 rounded-xl overflow-hidden" style={{ background: 'var(--theme-bg)' }}>
                {/* Base layer */}
                <div
                  className="absolute inset-4 rounded-lg shadow"
                  style={{ background: 'var(--theme-surface)' }}
                >
                  <div className="p-4">
                    <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                      Layer 1: Surface (shadow)
                    </span>
                  </div>
                </div>

                {/* Dropdown */}
                <div
                  className="absolute top-12 left-12 w-40 rounded-lg shadow-md p-3"
                  style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-border)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                    Layer 2: Dropdown (shadow-md)
                  </span>
                </div>

                {/* Modal */}
                <div
                  className="absolute top-20 right-8 w-48 rounded-xl shadow-xl p-4"
                  style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-border)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                    Layer 3: Modal (shadow-xl)
                  </span>
                </div>

                {/* Tooltip */}
                <div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg shadow-lg px-3 py-2"
                  style={{ background: 'var(--theme-text-primary)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--theme-bg)' }}>
                    Tooltip (shadow-lg)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jackpot Mode Shadows */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Theme-Specific Shadows
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--theme-text-muted)' }}>
            In Jackpot Mode, shadows incorporate accent color for a premium glow effect.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Shadow */}
            <div className="text-center">
              <div
                className="h-32 rounded-xl shadow-lg flex items-center justify-center"
                style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-border)' }}
              >
                <span className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Standard</span>
              </div>
              <code className="text-xs mt-2 block" style={{ color: 'var(--theme-text-muted)' }}>shadow-lg</code>
            </div>

            {/* Accent Shadow */}
            <div className="text-center">
              <div
                className="h-32 rounded-xl flex items-center justify-center"
                style={{
                  background: 'var(--theme-card-bg)',
                  border: '1px solid var(--theme-accent)',
                  boxShadow: '0 4px 16px var(--theme-accent-light)'
                }}
              >
                <span className="text-sm" style={{ color: 'var(--theme-accent)' }}>Accent Glow</span>
              </div>
              <code className="text-xs mt-2 block" style={{ color: 'var(--theme-text-muted)' }}>custom accent shadow</code>
            </div>

            {/* Premium Shadow */}
            <div className="text-center">
              <div
                className="h-32 rounded-xl flex items-center justify-center"
                style={{
                  background: 'var(--theme-card-bg)',
                  border: '1px solid var(--theme-secondary)',
                  boxShadow: '0 4px 20px var(--theme-secondary-light)'
                }}
              >
                <span className="text-sm" style={{ color: 'var(--theme-secondary)' }}>Premium</span>
              </div>
              <code className="text-xs mt-2 block" style={{ color: 'var(--theme-text-muted)' }}>premium glow</code>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="p-6 rounded-xl" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
          <h2 className="heading text-xl mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Usage Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="heading text-sm mb-2" style={{ color: 'var(--theme-accent)' }}>Do</h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                <li>+ Use shadow to indicate elevation hierarchy</li>
                <li>+ Increase shadow on hover for interactive cards</li>
                <li>+ Use colored shadows sparingly for emphasis</li>
                <li>+ Match shadow to element importance</li>
                <li>+ Use <code className="text-xs" style={{ color: 'var(--theme-accent)' }}>transition-shadow</code> for smooth state changes</li>
              </ul>
            </div>
            <div>
              <h3 className="heading text-sm mb-2" style={{ color: 'var(--theme-error)' }}>Don't</h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                <li>- Don't use heavy shadows on small elements</li>
                <li>- Don't mix multiple shadow sizes at same layer</li>
                <li>- Don't use shadow-2xl for common elements</li>
                <li>- Don't animate shadow intensity (performance)</li>
                <li>- Don't skip shadow levels (shadow → shadow-xl)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--theme-accent-light)' }}>
            <h4 className="heading text-sm mb-2" style={{ color: 'var(--theme-accent)' }}>
              CSS Variables Reference
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
              <div><code>--theme-card-shadow</code></div>
              <div>Default card elevation</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function JackpotModeShadows() {
  return (
    <div className="jackpot-mode">
      <ShadowShowcase />
    </div>
  );
}

function DefaultModeShadows() {
  return <ShadowShowcase />;
}

const meta: Meta = {
  title: 'Design System/Shadows',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const JackpotMode: Story = {
  render: () => <JackpotModeShadows />,
};

export const DefaultMode: Story = {
  render: () => <DefaultModeShadows />,
};
