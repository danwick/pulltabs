import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
  title: 'Design System/Brand Icons',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

const icons = [
  { name: 'star', label: 'Gold Star', description: 'From the magician\'s hat' },
  { name: 'sparkle', label: 'Magic Sparkle', description: '4-point magic effect' },
  { name: 'top-hat', label: 'Top Hat', description: 'Magician silhouette' },
  { name: 'pull-tab', label: 'Pull-Tab Ticket', description: 'Lottery ticket' },
  { name: 'magic-wand', label: 'Magic Wand', description: 'With sparkle tip' },
  { name: 'map-pin', label: 'Map Pin', description: 'Location marker' },
  { name: 'wifi-off', label: 'WiFi Off', description: 'Offline indicator' },
];

const sizes = [
  { name: 'sm', pixels: 16 },
  { name: 'md', pixels: 24 },
  { name: 'lg', pixels: 32 },
  { name: 'xl', pixels: 48 },
];

export const AllIcons: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading text-xl mb-2">Brand Icons</h2>
        <p className="text-gray-400 mb-6">
          Custom SVG icons matching the Pulltab Magic brand. Scalable, accessible, and optimized.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {icons.map((icon) => (
          <div
            key={icon.name}
            className="bg-zinc-900 rounded-lg p-4 flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src={`/icons/brand/${icon.name}.svg`}
                alt={icon.label}
                className="w-10 h-10"
              />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm">{icon.label}</p>
              <p className="text-gray-500 text-xs">{icon.description}</p>
            </div>
            <code className="text-xs text-blue-400 bg-zinc-800 px-2 py-1 rounded">
              {icon.name}.svg
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading text-xl mb-2">Icon Sizes</h2>
        <p className="text-gray-400 mb-6">
          All icons are designed on a 24px grid and scale cleanly.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-lg p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-sm">
              <th className="pb-4">Size</th>
              <th className="pb-4">Pixels</th>
              <th className="pb-4">Preview</th>
              <th className="pb-4">Use Case</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {sizes.map((size) => (
              <tr key={size.name} className="border-t border-zinc-800">
                <td className="py-4">
                  <code className="text-blue-400">{size.name}</code>
                </td>
                <td className="py-4 text-gray-400">{size.pixels}px</td>
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="/icons/brand/star.svg"
                      alt="star"
                      style={{ width: size.pixels, height: size.pixels }}
                    />
                    <img
                      src="/icons/brand/sparkle.svg"
                      alt="sparkle"
                      style={{ width: size.pixels, height: size.pixels }}
                    />
                    <img
                      src="/icons/brand/pull-tab.svg"
                      alt="pull-tab"
                      style={{ width: size.pixels, height: size.pixels }}
                    />
                  </div>
                </td>
                <td className="py-4 text-gray-400 text-sm">
                  {size.name === 'sm' && 'Inline text, badges'}
                  {size.name === 'md' && 'Buttons, list items'}
                  {size.name === 'lg' && 'Cards, navigation'}
                  {size.name === 'xl' && 'Empty states, heroes'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
};

export const OnDarkBackground: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-heading text-xl">On Dark Background</h2>
      <p className="text-gray-400 mb-4">
        Icons are optimized for dark mode (the app default).
      </p>

      <div className="bg-[#09090b] rounded-lg p-8 flex items-center justify-center gap-8">
        {icons.slice(0, 5).map((icon) => (
          <img
            key={icon.name}
            src={`/icons/brand/${icon.name}.svg`}
            alt={icon.label}
            className="w-12 h-12"
          />
        ))}
      </div>
    </div>
  ),
};

export const Usage: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-heading text-xl">Usage</h2>

      <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
        <h3 className="text-white font-medium">React Component</h3>
        <pre className="bg-zinc-800 p-4 rounded text-sm text-gray-300 overflow-x-auto">
{`import BrandIcon from '@/components/BrandIcon';
import { GoldStar, MagicSparkle } from '@/components/BrandIcon';

// Using the generic component
<BrandIcon name="star" size="lg" />
<BrandIcon name="sparkle" size={32} />

// Using convenience exports
<GoldStar size="xl" />
<MagicSparkle className="animate-pulse" />`}
        </pre>
      </div>

      <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
        <h3 className="text-white font-medium">Direct SVG Import</h3>
        <pre className="bg-zinc-800 p-4 rounded text-sm text-gray-300 overflow-x-auto">
{`// As img src
<img src="/icons/brand/star.svg" alt="Star" width={24} height={24} />

// In CSS
background-image: url('/icons/brand/star.svg');`}
        </pre>
      </div>

      <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
        <h3 className="text-white font-medium">Available Icons</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {icons.map((icon) => (
            <code key={icon.name} className="text-blue-400">
              /icons/brand/{icon.name}.svg
            </code>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const ColorPalette: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-heading text-xl">Icon Color Palette</h2>
      <p className="text-gray-400 mb-4">
        Colors used across brand icons, matching the Pulltab Magic brand.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { color: '#FFD700', name: 'Gold', usage: 'Stars, pins, accents' },
          { color: '#1E3A8A', name: 'Deep Blue', usage: 'Backgrounds, fills' },
          { color: '#4C1D95', name: 'Purple', usage: 'Prize windows' },
          { color: '#60A5FA', name: 'Light Blue', usage: 'Sparkles, magic' },
          { color: '#EF4444', name: 'Red', usage: 'Errors, star accents' },
          { color: '#1a1a1a', name: 'Near Black', usage: 'Hat, wand body' },
          { color: '#6B7280', name: 'Gray', usage: 'Disabled states' },
        ].map((c) => (
          <div key={c.color} className="bg-zinc-900 rounded-lg p-4">
            <div
              className="w-full h-12 rounded mb-3"
              style={{ backgroundColor: c.color }}
            />
            <p className="text-white font-medium text-sm">{c.name}</p>
            <code className="text-xs text-gray-500">{c.color}</code>
            <p className="text-xs text-gray-400 mt-1">{c.usage}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};
