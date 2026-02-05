import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import '../app/globals.css';

/**
 * Logo Component
 *
 * The Pulltab Magic brand logo with proper typography.
 * - "Pulltab" uses Oswald Bold (.logo-brand)
 * - "Magic" uses Sacramento script (.logo-magic)
 * - Optional tagline uses Bebas Neue (.text-condensed)
 */

// Inline Logo component for stories (since ThemeContext isn't available)
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  isJackpot?: boolean;
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

function Logo({ size = 'md', showTagline = false, isJackpot = false }: LogoProps) {
  return (
    <div className="inline-block">
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

function LogoShowcase() {
  return (
    <div className="p-8" style={{ background: 'var(--theme-bg)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-display text-3xl mb-2" style={{ color: 'var(--theme-text-primary)' }}>
          Logo Component
        </h1>
        <p className="text-body mb-12" style={{ color: 'var(--theme-text-secondary)' }}>
          Brand logo with typography variants and optional tagline.
        </p>

        {/* Size Variants */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Size Variants
          </h2>
          <div className="space-y-8 p-6 rounded-xl" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <div key={size} className="flex items-center gap-6">
                <code className="w-16 text-sm" style={{ color: 'var(--theme-text-muted)' }}>{size}</code>
                <Logo size={size} />
              </div>
            ))}
          </div>
        </section>

        {/* With Tagline */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            With Tagline
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {(['md', 'lg', 'xl'] as const).map((size) => (
              <div key={size} className="p-6 rounded-xl" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
                <Logo size={size} showTagline />
                <code className="text-xs mt-4 block" style={{ color: 'var(--theme-text-muted)' }}>
                  size="{size}" showTagline
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Header Context */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            In Header Context
          </h2>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--theme-border)' }}>
            {/* Default Mode Header */}
            <div className="px-4 py-3 flex items-center justify-between bg-white border-b">
              <Logo size="md" />
              <span className="text-sm text-gray-500">1,234 locations</span>
            </div>
            <div className="px-4 py-2" style={{ background: 'var(--theme-surface)' }}>
              <code className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Default Mode Header</code>
            </div>
          </div>
        </section>

        {/* Typography Breakdown */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6" style={{ color: 'var(--theme-text-primary)' }}>
            Typography Breakdown
          </h2>
          <div className="p-6 rounded-xl" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="space-y-6">
              <div className="flex items-baseline gap-4 pb-4" style={{ borderBottom: '1px solid var(--theme-border)' }}>
                <span className="logo-brand text-4xl" style={{ color: 'var(--theme-accent)' }}>Pulltab</span>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                    <strong>Oswald Bold</strong> — .logo-brand
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                    font-family: var(--font-oswald); font-weight: 700; letter-spacing: -0.02em
                  </p>
                </div>
              </div>

              <div className="flex items-baseline gap-4 pb-4" style={{ borderBottom: '1px solid var(--theme-border)' }}>
                <span className="text-script text-4xl" style={{ color: 'var(--theme-secondary)' }}>Magic</span>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                    <strong>Sacramento</strong> — .logo-magic / .text-script
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                    font-family: var(--font-sacramento); font-size: 0.7em; margin-left: 0.1em
                  </p>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-condensed text-xl" style={{ color: 'var(--theme-text-muted)' }}>FIND THE WIN</span>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                    <strong>Bebas Neue</strong> — .text-condensed
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                    font-family: var(--font-bebas); text-transform: uppercase; letter-spacing: 0.05em
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="p-6 rounded-xl" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
          <h2 className="heading text-xl mb-4" style={{ color: 'var(--theme-text-primary)' }}>
            Usage
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
              <h3 className="heading text-sm mb-2" style={{ color: 'var(--theme-accent)' }}>Import</h3>
              <code className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                {`import Logo from '@/components/Logo';`}
              </code>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
              <h3 className="heading text-sm mb-2" style={{ color: 'var(--theme-accent)' }}>Basic</h3>
              <code className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                {`<Logo />`}
              </code>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--theme-bg)' }}>
              <h3 className="heading text-sm mb-2" style={{ color: 'var(--theme-accent)' }}>With Tagline</h3>
              <code className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                {`<Logo size="lg" showTagline />`}
              </code>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="heading text-sm mb-3" style={{ color: 'var(--theme-text-primary)' }}>Props</h3>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                  <th className="text-left py-2" style={{ color: 'var(--theme-text-muted)' }}>Prop</th>
                  <th className="text-left py-2" style={{ color: 'var(--theme-text-muted)' }}>Type</th>
                  <th className="text-left py-2" style={{ color: 'var(--theme-text-muted)' }}>Default</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--theme-text-secondary)' }}>
                <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                  <td className="py-2"><code style={{ color: 'var(--theme-accent)' }}>size</code></td>
                  <td className="py-2">'sm' | 'md' | 'lg' | 'xl'</td>
                  <td className="py-2">'md'</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                  <td className="py-2"><code style={{ color: 'var(--theme-accent)' }}>showTagline</code></td>
                  <td className="py-2">boolean</td>
                  <td className="py-2">false</td>
                </tr>
                <tr>
                  <td className="py-2"><code style={{ color: 'var(--theme-accent)' }}>className</code></td>
                  <td className="py-2">string</td>
                  <td className="py-2">''</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function JackpotModeShowcase() {
  return (
    <div className="p-8" style={{ background: '#09090b', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-display text-3xl mb-2 text-white">
          Logo Component
        </h1>
        <p className="text-body mb-12 text-gray-400">
          Jackpot Mode variants with gold and cyan colors.
        </p>

        {/* Jackpot Mode Header */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6 text-white">
            Jackpot Mode Header
          </h2>
          <div className="rounded-xl overflow-hidden border border-gray-800">
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#1e3a8a' }}>
              <Logo size="md" isJackpot />
              <span className="text-sm text-yellow-400/70">1,234 locations</span>
            </div>
          </div>
        </section>

        {/* Size Variants */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6 text-white">
            Size Variants (Jackpot Mode)
          </h2>
          <div className="space-y-8 p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <div key={size} className="flex items-center gap-6">
                <code className="w-16 text-sm text-gray-500">{size}</code>
                <Logo size={size} isJackpot />
              </div>
            ))}
          </div>
        </section>

        {/* With Tagline */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6 text-white">
            With Tagline (Jackpot Mode)
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {(['lg', 'xl'] as const).map((size) => (
              <div key={size} className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                <Logo size={size} showTagline isJackpot />
              </div>
            ))}
          </div>
        </section>

        {/* Marketing Context */}
        <section className="mb-16">
          <h2 className="heading text-xl mb-6 text-white">
            Marketing/Hero Context
          </h2>
          <div
            className="p-12 rounded-xl text-center"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #09090b 100%)' }}
          >
            <Logo size="xl" showTagline isJackpot />
            <p className="text-gray-400 mt-6 max-w-md mx-auto">
              Find pull-tab locations near you in Minnesota.
            </p>
            <button
              className="mt-6 px-6 py-3 rounded-lg font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition-colors"
            >
              Find Locations
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function JackpotModeLogo() {
  return (
    <div className="jackpot-mode">
      <JackpotModeShowcase />
    </div>
  );
}

function DefaultModeLogo() {
  return <LogoShowcase />;
}

const meta: Meta = {
  title: 'Components/Logo',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const JackpotMode: Story = {
  render: () => <JackpotModeLogo />,
};

export const DefaultMode: Story = {
  render: () => <DefaultModeLogo />,
};
