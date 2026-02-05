import type { Meta, StoryObj } from '@storybook/nextjs-vite';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isJackpot?: boolean;
}

function Button({ children, variant = 'primary', size = 'md', disabled = false, isJackpot = true }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: isJackpot
      ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 focus:ring-yellow-500'
      : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: isJackpot
      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
    ghost: isJackpot
      ? 'text-gray-300 hover:bg-gray-800'
      : 'text-gray-700 hover:bg-gray-100',
    danger: isJackpot
      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
      : 'bg-red-100 text-red-700 hover:bg-red-200',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function ButtonShowcase() {
  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Buttons</h1>
        <p className="text-gray-400 mb-8">
          Button variants for different actions and contexts.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Variants (Jackpot Mode)</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Variants (Default Mode)</h2>
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg">
          <Button variant="primary" isJackpot={false}>Primary</Button>
          <Button variant="secondary" isJackpot={false}>Secondary</Button>
          <Button variant="ghost" isJackpot={false}>Ghost</Button>
          <Button variant="danger" isJackpot={false}>Danger</Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">States</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">With Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Near Me
          </Button>
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </Button>
        </div>
      </section>

      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Usage Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• <strong>Primary</strong> - Main CTAs (Claim Listing, Get Directions)</li>
          <li>• <strong>Secondary</strong> - Secondary actions (Cancel, View More)</li>
          <li>• <strong>Ghost</strong> - Tertiary actions, icon buttons</li>
          <li>• <strong>Danger</strong> - Destructive actions (Clear, Delete)</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Buttons',
  component: ButtonShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {};
