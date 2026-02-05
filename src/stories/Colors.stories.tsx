import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const colors = {
  brand: {
    'Gold': '#FFD700',
    'Gold Light': '#FFED4A',
    'Gold Mid': '#FFA500',
    'Gold Dark': '#B8860B',
    'Deep Blue': '#1E3A8A',
    'Rich Purple': '#4C1D95',
    'Purple Light': '#7C3AED',
    'Red Accent': '#DC2626',
    'Crimson Deep': '#7F1D1D',
  },
  ui: {
    'Background Dark': '#0A0A0A',
    'Surface': '#1A1A1A',
    'Surface Hover': '#262626',
    'Border': '#333333',
    'Text Primary': '#F5F5F5',
    'Text Secondary': '#A3A3A3',
    'Text Muted': '#737373',
  },
  accent: {
    'Cyan Light': '#87CEEB',
    'Blue Light': '#3B82F6',
    'Sparkle Blue': '#60A5FA',
  },
  status: {
    'Success': '#22C55E',
    'Warning': '#EAB308',
    'Error': '#EF4444',
  },
};

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  const isLight = ['#FFD700', '#FFED4A', '#FFA500', '#F5F5F5', '#87CEEB', '#60A5FA', '#22C55E', '#EAB308', '#F9FAFB'].includes(hex);

  return (
    <div className="flex items-center gap-4 mb-3">
      <div
        className="size-16 rounded-lg shadow-md border border-white/10 flex items-center justify-center"
        style={{ backgroundColor: hex }}
      >
        <span className={`text-xs font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>
          {hex}
        </span>
      </div>
      <div>
        <p className="font-medium text-white">{name}</p>
        <p className="text-sm text-gray-400 font-mono">{hex}</p>
      </div>
    </div>
  );
}

function ColorSection({ title, colorSet }: { title: string; colorSet: Record<string, string> }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(colorSet).map(([name, hex]) => (
          <ColorSwatch key={name} name={name} hex={hex} />
        ))}
      </div>
    </div>
  );
}

function ColorsPage() {
  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-2">Color Palette</h1>
      <p className="text-gray-400 mb-8">
        Pulltab Magic brand colors. Gold is the primary accent, used for CTAs and highlights.
        Dark backgrounds create the casino/gaming atmosphere.
      </p>

      <ColorSection title="Brand Colors" colorSet={colors.brand} />
      <ColorSection title="UI Colors" colorSet={colors.ui} />
      <ColorSection title="Accent Colors" colorSet={colors.accent} />
      <ColorSection title="Status Colors" colorSet={colors.status} />

      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Usage Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• <strong>Gold (#FFD700)</strong> - Primary action color, buttons, selected states</li>
          <li>• <strong>Deep Blue (#1E3A8A)</strong> - Headers, navigation structure</li>
          <li>• <strong>Rich Purple (#4C1D95)</strong> - Premium features, special highlights</li>
          <li>• <strong>Background (#0A0A0A)</strong> - App background in Jackpot Mode</li>
          <li>• <strong>Surface (#1A1A1A)</strong> - Cards, modals, elevated elements</li>
        </ul>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Colors',
  component: ColorsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Palette: Story = {};
