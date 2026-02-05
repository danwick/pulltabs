import type { Meta, StoryObj } from '@storybook/nextjs-vite';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'purple' | 'price';
  size?: 'sm' | 'md';
  isJackpot?: boolean;
}

function Badge({ children, variant = 'default', size = 'md', isJackpot = true }: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const variantClasses = {
    default: isJackpot
      ? 'bg-gray-800 text-gray-300'
      : 'bg-gray-100 text-gray-700',
    primary: isJackpot
      ? 'bg-yellow-500 text-gray-900'
      : 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: isJackpot
      ? 'bg-yellow-500/20 text-yellow-400'
      : 'bg-yellow-100 text-yellow-800',
    error: isJackpot
      ? 'bg-red-500/20 text-red-400'
      : 'bg-red-100 text-red-700',
    purple: isJackpot
      ? 'bg-purple-500/20 text-purple-400'
      : 'bg-purple-500 text-white',
    price: isJackpot
      ? 'bg-green-500/20 text-green-400'
      : 'bg-green-500 text-white',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

function ToggleBadge({ children, active, isJackpot = true }: { children: React.ReactNode; active?: boolean; isJackpot?: boolean }) {
  const classes = active
    ? isJackpot
      ? 'bg-yellow-500 text-gray-900'
      : 'bg-blue-500 text-white'
    : isJackpot
      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  return (
    <button className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${classes}`}>
      {children}
    </button>
  );
}

function BadgeShowcase() {
  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Badges & Chips</h1>
        <p className="text-gray-400 mb-8">
          Labels, tags, and filter chips used throughout the app.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Status Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Premium</Badge>
          <Badge variant="success">Open Now</Badge>
          <Badge variant="warning">Closing Soon</Badge>
          <Badge variant="error">Closed</Badge>
          <Badge variant="purple">E-Tabs</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Gambling Types</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Pull-Tabs</Badge>
          <Badge>E-Tabs</Badge>
          <Badge>Bingo</Badge>
          <Badge>Raffles</Badge>
          <Badge>Paddlewheels</Badge>
          <Badge>Tipboards</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Price Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="price">$5</Badge>
          <Badge variant="price">$4</Badge>
          <Badge variant="price">$3</Badge>
          <Badge variant="price">$2</Badge>
          <Badge variant="price">$1</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Seller Type Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">Booth</Badge>
          <Badge variant="primary">Behind Bar</Badge>
          <Badge variant="primary">Machine</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">E-Tab Systems</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="purple">Pilot</Badge>
          <Badge variant="purple">3 Diamonds</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Filter Toggle Chips (Jackpot Mode)</h2>
        <div className="flex flex-wrap gap-2">
          <ToggleBadge active>$5</ToggleBadge>
          <ToggleBadge active>$3</ToggleBadge>
          <ToggleBadge>$4</ToggleBadge>
          <ToggleBadge>$2</ToggleBadge>
          <ToggleBadge>$1</ToggleBadge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Filter Toggle Chips (Default Mode)</h2>
        <div className="flex flex-wrap gap-2 bg-white p-4 rounded-lg">
          <ToggleBadge active isJackpot={false}>$5</ToggleBadge>
          <ToggleBadge active isJackpot={false}>$3</ToggleBadge>
          <ToggleBadge isJackpot={false}>$4</ToggleBadge>
          <ToggleBadge isJackpot={false}>$2</ToggleBadge>
          <ToggleBadge isJackpot={false}>$1</ToggleBadge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="sm" variant="primary">Small</Badge>
          <Badge size="md" variant="primary">Medium</Badge>
        </div>
      </section>

      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Usage Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• <strong>Status badges</strong> - Show site state (open/closed, premium)</li>
          <li>• <strong>Gambling type badges</strong> - Show available games at a site</li>
          <li>• <strong>Price badges</strong> - Show available pull-tab denominations</li>
          <li>• <strong>Toggle chips</strong> - Interactive filter controls</li>
          <li>• Use <code className="text-yellow-400">rounded-full</code> for pill shape</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Badges',
  component: BadgeShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {};
