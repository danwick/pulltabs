import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function TransitionDemo({ type, duration, className }: { type: string; duration: string; className: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActive(!active)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${className} ${
            active ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'
          }`}
        >
          {active ? 'Active' : 'Hover me'}
        </button>
        <div className="text-sm">
          <code className="text-yellow-400">{type}</code>
          <span className="text-gray-500 ml-2">{duration}</span>
        </div>
      </div>
    </div>
  );
}

function KeyframeDemo({ name, animationClass, description }: { name: string; animationClass: string; description: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <code className="text-yellow-400">{name}</code>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <button
          onClick={() => setShow(!show)}
          className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
        >
          {show ? 'Reset' : 'Play'}
        </button>
      </div>
      <div className="h-20 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
        {show && (
          <div className={`w-24 h-12 bg-yellow-500 rounded-lg ${animationClass}`} />
        )}
        {!show && (
          <span className="text-gray-600 text-sm">Click Play to see animation</span>
        )}
      </div>
    </div>
  );
}

function AnimationsShowcase() {
  const [loadingDemo, setLoadingDemo] = useState(false);

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">Animations</h1>
      <p className="text-gray-400 mb-8">
        Transitions and keyframe animations used in the app. Following Baseline UI constraints for performance.
      </p>

      {/* Performance Rules */}
      <section className="mb-10 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <h2 className="text-lg font-semibold text-red-400 mb-2">Performance Rules</h2>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Only animate <code className="text-yellow-400">transform</code> and <code className="text-yellow-400">opacity</code> (compositor properties)</li>
          <li>• Never animate <code className="text-red-400">width</code>, <code className="text-red-400">height</code>, <code className="text-red-400">top</code>, <code className="text-red-400">left</code>, <code className="text-red-400">margin</code>, <code className="text-red-400">padding</code></li>
          <li>• Max <code className="text-yellow-400">200ms</code> for interaction feedback</li>
          <li>• Use <code className="text-yellow-400">ease-out</code> for entrance animations</li>
          <li>• Respect <code className="text-yellow-400">prefers-reduced-motion</code></li>
        </ul>
      </section>

      {/* Transitions */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Transitions
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Color Transitions</h3>
              <TransitionDemo
                type="transition-colors"
                duration="150ms"
                className="transition-colors"
              />
              <p className="text-xs text-gray-500 mt-3">
                Use for hover states on buttons, links, backgrounds
              </p>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Transform Transitions</h3>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-transform hover:scale-105">
                  Hover me
                </button>
                <code className="text-yellow-400 text-sm">transition-transform hover:scale-105</code>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Use for interactive feedback, button presses
              </p>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Opacity Transitions</h3>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-opacity hover:opacity-70">
                  Hover me
                </button>
                <code className="text-yellow-400 text-sm">transition-opacity hover:opacity-70</code>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Use for fade effects, disabled states
              </p>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border-2 border-red-500/30">
              <h3 className="text-sm font-medium text-red-400 mb-3">Avoid: transition-all</h3>
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-gray-700 text-gray-500 rounded-lg text-sm">
                  transition-all
                </span>
                <span className="text-red-400 text-xs">Can animate non-performant properties</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Instead, use specific: transition-colors, transition-transform, transition-opacity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Keyframe Animations */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Keyframe Animations
        </h2>
        <div className="space-y-4">
          <KeyframeDemo
            name="animate-slideUp"
            animationClass="animate-slideUp"
            description="Mobile bottom sheet entrance (300ms ease-out)"
          />
          <KeyframeDemo
            name="animate-slideInRight"
            animationClass="animate-slideInRight"
            description="Desktop side panel entrance (300ms ease-out)"
          />
        </div>

        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">CSS Definition (globals.css)</h3>
          <pre className="bg-gray-900 rounded p-3 text-sm overflow-x-auto">
            <code className="text-green-400">{`@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}

.animate-slideInRight {
  animation: slideInRight 0.3s ease-out;
}`}</code>
          </pre>
        </div>
      </section>

      {/* Loading Spinner */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Loading States
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Spinner</h3>
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
              <code className="text-yellow-400 text-sm">animate-spin</code>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Use Loader2 icon from lucide-react with animate-spin
            </p>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Skeleton Loading</h3>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-48 bg-gray-700 rounded animate-pulse" />
            </div>
            <code className="text-yellow-400 text-sm block mt-3">animate-pulse</code>
            <p className="text-xs text-gray-500 mt-1">
              Use for content placeholders while loading
            </p>
          </div>
        </div>
      </section>

      {/* Button Loading State */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Button Loading Pattern
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setLoadingDemo(true);
              setTimeout(() => setLoadingDemo(false), 2000);
            }}
            disabled={loadingDemo}
            className="px-6 py-2.5 bg-yellow-500 text-gray-900 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingDemo ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
          <span className="text-sm text-gray-400 self-center">Click to see loading state</span>
        </div>
      </section>

      {/* Usage Notes */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Usage Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Modal entrances use custom keyframe animations (slideUp, slideInRight)</li>
          <li>• Interactive elements use transition-colors for hover states</li>
          <li>• Loading indicators use animate-spin (spinner) or animate-pulse (skeleton)</li>
          <li>• Never add animation unless explicitly requested</li>
          <li>• Avoid <code className="text-red-400">will-change</code> outside active animations</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Animations',
  component: AnimationsShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllAnimations: Story = {};
