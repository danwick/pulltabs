import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Search,
  MapPin,
  Navigation,
  X,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Phone,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Star,
  ArrowLeft,
} from 'lucide-react';

type IconItem = {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  usage: string;
  spin?: boolean;
};

const iconCategories: Record<string, IconItem[]> = {
  'Navigation & Actions': [
    { Icon: Search, name: 'Search', usage: 'Search input icon' },
    { Icon: X, name: 'X', usage: 'Close buttons, clear filters' },
    { Icon: ChevronDown, name: 'ChevronDown', usage: 'Dropdown indicators' },
    { Icon: ChevronRight, name: 'ChevronRight', usage: 'List navigation' },
    { Icon: ArrowLeft, name: 'ArrowLeft', usage: 'Back buttons' },
    { Icon: ExternalLink, name: 'ExternalLink', usage: 'Open in new tab' },
  ],
  'Location & Maps': [
    { Icon: MapPin, name: 'MapPin', usage: 'Location indicators, "Near Me"' },
    { Icon: Navigation, name: 'Navigation', usage: 'Get directions button' },
    { Icon: Globe, name: 'Globe', usage: 'Website links' },
  ],
  'Site Details': [
    { Icon: Clock, name: 'Clock', usage: 'Hours of operation' },
    { Icon: Phone, name: 'Phone', usage: 'Phone numbers' },
    { Icon: Building2, name: 'Building2', usage: 'Claim listing CTA' },
  ],
  'Status & Feedback': [
    { Icon: CheckCircle, name: 'CheckCircle', usage: 'Success states' },
    { Icon: AlertCircle, name: 'AlertCircle', usage: 'Error states' },
    { Icon: Loader2, name: 'Loader2', usage: 'Loading spinners', spin: true },
  ],
  'UI Controls': [
    { Icon: SlidersHorizontal, name: 'SlidersHorizontal', usage: 'Filter button' },
    { Icon: Star, name: 'Star', usage: 'Premium indicators' },
  ],
  'Theme Toggle': [
    { Icon: Sparkles, name: 'Sparkles', usage: 'Jackpot Mode icon' },
    { Icon: Sun, name: 'Sun', usage: 'Default Mode icon' },
  ],
};

function IconCard({ Icon, name, usage, spin }: { Icon: React.ComponentType<{ className?: string }>; name: string; usage: string; spin?: boolean }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
      <div className="size-12 flex items-center justify-center bg-gray-900 rounded-lg">
        <Icon className={`w-6 h-6 text-yellow-400 ${spin ? 'animate-spin' : ''}`} />
      </div>
      <div className="flex-1 min-w-0">
        <code className="text-sm text-white font-mono">{name}</code>
        <p className="text-xs text-gray-400 mt-0.5">{usage}</p>
      </div>
    </div>
  );
}

function IconSizes() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Size Scale</h3>
      <div className="flex items-end gap-6 bg-gray-800/50 rounded-lg p-4">
        <div className="text-center">
          <MapPin className="w-3 h-3 text-yellow-400 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">w-3 h-3</p>
          <p className="text-xs text-gray-500">12px</p>
        </div>
        <div className="text-center">
          <MapPin className="w-4 h-4 text-yellow-400 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">w-4 h-4</p>
          <p className="text-xs text-gray-500">16px</p>
        </div>
        <div className="text-center">
          <MapPin className="w-5 h-5 text-yellow-400 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">w-5 h-5</p>
          <p className="text-xs text-gray-500">20px</p>
        </div>
        <div className="text-center">
          <MapPin className="w-6 h-6 text-yellow-400 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">w-6 h-6</p>
          <p className="text-xs text-gray-500">24px</p>
        </div>
        <div className="text-center">
          <MapPin className="w-8 h-8 text-yellow-400 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">w-8 h-8</p>
          <p className="text-xs text-gray-500">32px</p>
        </div>
      </div>
    </div>
  );
}

function IconColors() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Color Usage</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
          <MapPin className="w-6 h-6 text-yellow-400 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">Primary Action</p>
          <code className="text-xs text-yellow-400">text-yellow-400</code>
        </div>
        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
          <MapPin className="w-6 h-6 text-gray-400 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">Secondary</p>
          <code className="text-xs text-gray-400">text-gray-400</code>
        </div>
        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">Success</p>
          <code className="text-xs text-green-400">text-green-500</code>
        </div>
        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
          <p className="text-xs text-gray-400 mt-2">Error</p>
          <code className="text-xs text-red-400">text-red-500</code>
        </div>
      </div>
    </div>
  );
}

function IconsShowcase() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">Icons</h1>
      <p className="text-gray-400 mb-2">
        Lucide React icons used throughout the app. Import from <code className="text-yellow-400">lucide-react</code>.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
          Browse all Lucide icons →
        </a>
      </p>

      {/* Icon Categories */}
      {Object.entries(iconCategories).map(([category, icons]) => (
        <section key={category} className="mb-8">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {icons.map(({ Icon, name, usage, spin }) => (
              <IconCard key={name} Icon={Icon} name={name} usage={usage} spin={spin} />
            ))}
          </div>
        </section>
      ))}

      {/* Size Scale */}
      <section className="mb-8">
        <IconSizes />
      </section>

      {/* Color Usage */}
      <section className="mb-8">
        <IconColors />
      </section>

      {/* Usage Notes */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Usage Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Import icons individually: <code className="text-yellow-400">{`import { MapPin } from 'lucide-react'`}</code></li>
          <li>• Default size is 24px, use Tailwind classes to resize</li>
          <li>• Use <code className="text-yellow-400">flex-shrink-0</code> when icons are in flex containers</li>
          <li>• Add <code className="text-yellow-400">animate-spin</code> to Loader2 for loading states</li>
          <li>• Icon-only buttons need <code className="text-yellow-400">aria-label</code> for accessibility</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Icons',
  component: IconsShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllIcons: Story = {};
