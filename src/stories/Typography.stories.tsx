import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import '../app/globals.css';

/**
 * Typography System for Pulltab Magic
 *
 * Fonts loaded via next/font/google in layout.tsx:
 * - Inter: Body text, buttons, UI
 * - Oswald: Headings, navigation, badges
 * - Bebas Neue: Taglines, condensed labels
 * - Sacramento: Script accent ("Magic")
 */

function TypographyShowcase() {
  return (
    <div className="p-8 max-w-4xl" style={{ background: 'var(--theme-bg)' }}>
      <h1 className="text-display text-4xl mb-2" style={{ color: 'var(--theme-text-primary)' }}>
        Typography System
      </h1>
      <p className="text-body mb-12" style={{ color: 'var(--theme-text-secondary)' }}>
        Font stack and type scale for Pulltab Magic.
      </p>

      {/* Logo Treatment */}
      <section className="mb-12">
        <h2 className="heading text-lg mb-4" style={{ color: 'var(--theme-text-primary)' }}>
          Logo Typography
        </h2>
        <div className="p-6 rounded-xl" style={{ background: 'var(--theme-header-bg)' }}>
          <div className="text-4xl">
            <span className="logo-brand" style={{ color: 'var(--theme-accent)' }}>Pulltab</span>
            <span className="logo-magic" style={{ color: '#87CEEB' }}>Magic</span>
          </div>
          <p className="text-condensed text-sm mt-2" style={{ color: 'var(--theme-accent)', opacity: 0.8 }}>
            FIND THE WIN
          </p>
        </div>
        <div className="mt-4 text-sm" style={{ color: 'var(--theme-text-muted)' }}>
          <code>.logo-brand</code> = Oswald Bold | <code>.logo-magic</code> = Sacramento | <code>.text-condensed</code> = Bebas Neue
        </div>
      </section>

      {/* Font Families */}
      <section className="mb-12">
        <h2 className="heading text-lg mb-6" style={{ color: 'var(--theme-text-primary)' }}>
          Font Families
        </h2>

        <div className="space-y-6">
          {/* Oswald */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="heading text-base" style={{ color: 'var(--theme-text-primary)' }}>Oswald</h3>
                <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Headings, navigation, badges</p>
              </div>
              <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }}>
                .heading
              </code>
            </div>
            <p className="heading text-3xl" style={{ color: 'var(--theme-text-primary)' }}>
              Minneapolis Pull-Tab Locations
            </p>
            <div className="flex gap-4 mt-3">
              <span className="heading font-normal" style={{ color: 'var(--theme-text-secondary)' }}>Regular 400</span>
              <span className="heading font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Medium 500</span>
              <span className="heading font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>SemiBold 600</span>
              <span className="heading font-bold" style={{ color: 'var(--theme-text-secondary)' }}>Bold 700</span>
            </div>
          </div>

          {/* Inter */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="heading text-base" style={{ color: 'var(--theme-text-primary)' }}>Inter</h3>
                <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Body text, descriptions, buttons</p>
              </div>
              <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }}>
                default / .text-body
              </code>
            </div>
            <p className="text-body text-base" style={{ color: 'var(--theme-text-primary)' }}>
              Find pull-tab locations near you in Minnesota. Filter by price, seller type, and e-tab system to find the perfect spot for your next game.
            </p>
            <div className="flex gap-4 mt-3">
              <span className="font-normal" style={{ color: 'var(--theme-text-secondary)' }}>Regular 400</span>
              <span className="font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Medium 500</span>
              <span className="font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>SemiBold 600</span>
              <span className="font-bold" style={{ color: 'var(--theme-text-secondary)' }}>Bold 700</span>
            </div>
          </div>

          {/* Bebas Neue */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="heading text-base" style={{ color: 'var(--theme-text-primary)' }}>Bebas Neue</h3>
                <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Taglines, condensed labels, badges</p>
              </div>
              <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }}>
                .text-condensed
              </code>
            </div>
            <p className="text-condensed text-3xl" style={{ color: 'var(--theme-text-primary)' }}>
              FIND THE WIN • PREMIUM LISTING • PULL-TABS
            </p>
          </div>

          {/* Sacramento */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="heading text-base" style={{ color: 'var(--theme-text-primary)' }}>Sacramento</h3>
                <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Script accent, "magical" moments</p>
              </div>
              <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }}>
                .text-script
              </code>
            </div>
            <p className="text-script text-4xl" style={{ color: 'var(--theme-accent)' }}>
              Magic happens here
            </p>
          </div>
        </div>
      </section>

      {/* Type Scale */}
      <section className="mb-12">
        <h2 className="heading text-lg mb-6" style={{ color: 'var(--theme-text-primary)' }}>
          Type Scale
        </h2>
        <div className="space-y-4">
          {[
            { class: 'text-xs', size: '12px', use: 'Fine print, captions' },
            { class: 'text-sm', size: '14px', use: 'Labels, secondary text' },
            { class: 'text-base', size: '16px', use: 'Body text' },
            { class: 'text-lg', size: '18px', use: 'Large body, emphasis' },
            { class: 'text-xl', size: '20px', use: 'Card titles' },
            { class: 'text-2xl', size: '24px', use: 'Section headers' },
            { class: 'text-3xl', size: '30px', use: 'Page titles' },
            { class: 'text-4xl', size: '36px', use: 'Hero text' },
          ].map(({ class: cls, size, use }) => (
            <div key={cls} className="flex items-baseline gap-4 pb-3" style={{ borderBottom: '1px solid var(--theme-border)' }}>
              <code className="w-24 flex-shrink-0 text-sm" style={{ color: 'var(--theme-accent)' }}>{cls}</code>
              <span className="w-20 flex-shrink-0 text-sm tabular-nums" style={{ color: 'var(--theme-text-muted)' }}>{size}</span>
              <span className={cls} style={{ color: 'var(--theme-text-primary)' }}>{use}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-12">
        <h2 className="heading text-lg mb-6" style={{ color: 'var(--theme-text-primary)' }}>
          Usage Examples
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Title */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <h3 className="text-sm mb-3" style={{ color: 'var(--theme-text-muted)' }}>Card Title</h3>
            <h4 className="heading text-lg font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
              Lucky's Gaming Lounge
            </h4>
            <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
              567 Oak Avenue, St. Paul
            </p>
          </div>

          {/* Badge Labels */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <h3 className="text-sm mb-3" style={{ color: 'var(--theme-text-muted)' }}>Badge Labels</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-condensed text-xs px-2 py-1 rounded-full" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }}>
                PREMIUM
              </span>
              <span className="text-condensed text-xs px-2 py-1 rounded-full" style={{ background: 'var(--theme-tertiary-light)', color: 'var(--theme-tertiary)' }}>
                $5
              </span>
              <span className="text-condensed text-xs px-2 py-1 rounded-full" style={{ background: 'var(--theme-secondary-light)', color: 'var(--theme-secondary)' }}>
                PILOT
              </span>
            </div>
          </div>

          {/* Button Text */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <h3 className="text-sm mb-3" style={{ color: 'var(--theme-text-muted)' }}>Button Text</h3>
            <div className="flex gap-3">
              <button className="text-ui px-4 py-2 rounded-lg font-semibold" style={{ background: 'var(--theme-accent)', color: 'var(--theme-bg)' }}>
                Get Directions
              </button>
              <button className="text-ui px-4 py-2 rounded-lg font-medium" style={{ background: 'var(--theme-surface)', color: 'var(--theme-text-primary)', border: '1px solid var(--theme-border)' }}>
                View Details
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
            <h3 className="text-sm mb-3" style={{ color: 'var(--theme-text-muted)' }}>Navigation</h3>
            <div className="flex gap-4">
              <span className="heading text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>Map</span>
              <span className="heading text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>List</span>
              <span className="heading text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Nearby</span>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Notes */}
      <section className="p-4 rounded-lg" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
        <h3 className="heading text-base mb-3" style={{ color: 'var(--theme-text-primary)' }}>Implementation Notes</h3>
        <ul className="space-y-2 text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
          <li>• Fonts loaded via <code style={{ color: 'var(--theme-accent)' }}>next/font/google</code> in layout.tsx</li>
          <li>• CSS variables: <code style={{ color: 'var(--theme-accent)' }}>--font-inter</code>, <code style={{ color: 'var(--theme-accent)' }}>--font-oswald</code>, <code style={{ color: 'var(--theme-accent)' }}>--font-bebas</code>, <code style={{ color: 'var(--theme-accent)' }}>--font-sacramento</code></li>
          <li>• Use <code style={{ color: 'var(--theme-accent)' }}>.heading</code> for h1-h6 and card titles</li>
          <li>• Use <code style={{ color: 'var(--theme-accent)' }}>.text-condensed</code> for uppercase labels/badges</li>
          <li>• Use <code style={{ color: 'var(--theme-accent)' }}>.text-script</code> sparingly for "magical" moments</li>
          <li>• Body text uses Inter by default (no class needed)</li>
        </ul>
      </section>
    </div>
  );
}

function JackpotModeTypography() {
  return (
    <div className="jackpot-mode">
      <TypographyShowcase />
    </div>
  );
}

function DefaultModeTypography() {
  return <TypographyShowcase />;
}

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const JackpotMode: Story = {
  render: () => <JackpotModeTypography />,
};

export const DefaultMode: Story = {
  render: () => <DefaultModeTypography />,
};
