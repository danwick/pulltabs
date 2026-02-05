import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sparkles, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isJackpot?: boolean;
  showLabel?: boolean;
}

function ThemeToggleDemo({ isJackpot = true, showLabel = true }: ThemeToggleProps) {
  return (
    <button
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
        ${isJackpot
          ? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      title={isJackpot ? 'Switch to Default Mode' : 'Switch to Jackpot Mode'}
    >
      {isJackpot ? (
        <>
          <Sun className="w-4 h-4" />
          {showLabel && <span>Default</span>}
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          {showLabel && <span>Jackpot Mode</span>}
        </>
      )}
    </button>
  );
}

function ThemeToggleShowcase() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-2">Theme Toggle</h1>
      <p className="text-gray-400 mb-8">
        Allows users to switch between Default (light) and Jackpot (dark casino) modes.
      </p>

      {/* States */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          States
        </h2>
        <div className="space-y-6">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Jackpot Mode Active</h3>
            <div className="flex items-center gap-4">
              <ThemeToggleDemo isJackpot={true} />
              <span className="text-sm text-gray-400">Shows "Default" to switch away</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Default Mode Active</h3>
            <div className="flex items-center gap-4">
              <ThemeToggleDemo isJackpot={false} />
              <span className="text-sm text-gray-500">Shows "Jackpot Mode" to switch to</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Variations
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ThemeToggleDemo isJackpot={true} showLabel={true} />
            <span className="text-sm text-gray-400">With label (desktop)</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggleDemo isJackpot={true} showLabel={false} />
            <span className="text-sm text-gray-400">Icon only (mobile)</span>
          </div>
        </div>
      </section>

      {/* In Context */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          In Header Context
        </h2>
        <div className="space-y-4">
          {/* Jackpot Header */}
          <div className="bg-blue-900 px-4 py-3 rounded-lg flex items-center justify-between">
            <span className="text-xl font-bold text-yellow-400">Pulltab Magic</span>
            <ThemeToggleDemo isJackpot={true} />
          </div>

          {/* Default Header */}
          <div className="bg-white px-4 py-3 rounded-lg flex items-center justify-between border border-gray-200">
            <span className="text-xl font-bold text-gray-900">Pulltab Magic</span>
            <ThemeToggleDemo isJackpot={false} />
          </div>
        </div>
      </section>

      {/* Implementation Notes */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Implementation Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Toggle adds/removes <code className="text-yellow-400">jackpot-mode</code> class on <code className="text-yellow-400">&lt;html&gt;</code></li>
          <li>• State persisted via ThemeContext (React context)</li>
          <li>• Icons from lucide-react: <code className="text-yellow-400">Sparkles</code>, <code className="text-yellow-400">Sun</code></li>
          <li>• Label hidden on mobile via <code className="text-yellow-400">hidden sm:inline</code></li>
          <li>• Gold glow effect in Jackpot mode: <code className="text-yellow-400">shadow-lg shadow-yellow-500/30</code></li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggleShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};

export const JackpotMode: Story = {
  render: () => (
    <div className="p-6 bg-gray-900">
      <ThemeToggleDemo isJackpot={true} />
    </div>
  ),
};

export const DefaultMode: Story = {
  render: () => (
    <div className="p-6 bg-white">
      <ThemeToggleDemo isJackpot={false} />
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="p-6 bg-gray-900 flex gap-4">
      <ThemeToggleDemo isJackpot={true} showLabel={false} />
      <ThemeToggleDemo isJackpot={false} showLabel={false} />
    </div>
  ),
};
