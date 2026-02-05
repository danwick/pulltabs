import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const spacingScale = [
  { name: '0', value: '0px', tailwind: 'p-0, m-0, gap-0' },
  { name: '0.5', value: '2px', tailwind: 'p-0.5, m-0.5, gap-0.5' },
  { name: '1', value: '4px', tailwind: 'p-1, m-1, gap-1' },
  { name: '1.5', value: '6px', tailwind: 'p-1.5, m-1.5, gap-1.5' },
  { name: '2', value: '8px', tailwind: 'p-2, m-2, gap-2' },
  { name: '2.5', value: '10px', tailwind: 'p-2.5, m-2.5, gap-2.5' },
  { name: '3', value: '12px', tailwind: 'p-3, m-3, gap-3' },
  { name: '4', value: '16px', tailwind: 'p-4, m-4, gap-4' },
  { name: '5', value: '20px', tailwind: 'p-5, m-5, gap-5' },
  { name: '6', value: '24px', tailwind: 'p-6, m-6, gap-6' },
  { name: '8', value: '32px', tailwind: 'p-8, m-8, gap-8' },
  { name: '10', value: '40px', tailwind: 'p-10, m-10, gap-10' },
  { name: '12', value: '48px', tailwind: 'p-12, m-12, gap-12' },
];

const commonPatterns = [
  { context: 'Card padding', value: 'p-4', description: '16px padding inside cards' },
  { context: 'Section spacing', value: 'space-y-6', description: '24px between major sections' },
  { context: 'Item list', value: 'space-y-3', description: '12px between list items' },
  { context: 'Inline items', value: 'gap-2', description: '8px between inline elements' },
  { context: 'Button padding', value: 'px-4 py-2.5', description: '16px horizontal, 10px vertical' },
  { context: 'Chip padding', value: 'px-3 py-1.5', description: '12px horizontal, 6px vertical' },
  { context: 'Modal content', value: 'p-4', description: '16px padding in modals' },
  { context: 'Icon + text', value: 'gap-2', description: '8px between icon and label' },
];

const borderRadiusScale = [
  { name: 'none', value: '0px', tailwind: 'rounded-none' },
  { name: 'sm', value: '2px', tailwind: 'rounded-sm' },
  { name: 'DEFAULT', value: '4px', tailwind: 'rounded' },
  { name: 'md', value: '6px', tailwind: 'rounded-md' },
  { name: 'lg', value: '8px', tailwind: 'rounded-lg' },
  { name: 'xl', value: '12px', tailwind: 'rounded-xl' },
  { name: '2xl', value: '16px', tailwind: 'rounded-2xl' },
  { name: 'full', value: '9999px', tailwind: 'rounded-full' },
];

function SpacingSwatch({ name, value }: { name: string; value: string }) {
  const numValue = parseInt(value);
  const width = Math.min(numValue * 2 + 20, 200);

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-12 text-right">
        <code className="text-sm text-yellow-400">{name}</code>
      </div>
      <div
        className="h-4 bg-yellow-500 rounded"
        style={{ width: `${width}px` }}
      />
      <span className="text-sm text-gray-400">{value}</span>
    </div>
  );
}

function BorderRadiusSwatch({ name, value, tailwind }: { name: string; value: string; tailwind: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
      <div
        className="size-12 bg-yellow-500"
        style={{ borderRadius: value }}
      />
      <div className="flex-1">
        <code className="text-sm text-yellow-400">{tailwind}</code>
        <p className="text-xs text-gray-400">{value}</p>
      </div>
    </div>
  );
}

function SpacingShowcase() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">Spacing & Layout</h1>
      <p className="text-gray-400 mb-8">
        Consistent spacing scale using Tailwind defaults. All values follow a 4px base unit.
      </p>

      {/* Spacing Scale */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Spacing Scale
        </h2>
        <div className="bg-gray-800/50 rounded-lg p-4">
          {spacingScale.map((item) => (
            <SpacingSwatch key={item.name} name={item.name} value={item.value} />
          ))}
        </div>
      </section>

      {/* Common Patterns */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Common Patterns
        </h2>
        <div className="space-y-2">
          {commonPatterns.map((pattern) => (
            <div key={pattern.context} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-32 flex-shrink-0">
                <span className="text-sm text-gray-300">{pattern.context}</span>
              </div>
              <code className="text-sm text-yellow-400 bg-gray-900 px-2 py-1 rounded">{pattern.value}</code>
              <span className="text-xs text-gray-500">{pattern.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Border Radius
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {borderRadiusScale.map((item) => (
            <BorderRadiusSwatch key={item.name} {...item} />
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Usage Guidelines</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• <code className="text-yellow-400">rounded-lg</code> — Cards, modals, panels</li>
            <li>• <code className="text-yellow-400">rounded-xl</code> — Large containers, bottom sheets</li>
            <li>• <code className="text-yellow-400">rounded-full</code> — Buttons, badges, chips</li>
          </ul>
        </div>
      </section>

      {/* Layout Examples */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Layout Examples
        </h2>

        <div className="space-y-6">
          {/* Card Layout */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Card with Content</h3>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-yellow-500 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-32 bg-gray-700 rounded" />
                  <div className="h-3 w-48 bg-gray-700/50 rounded" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-16 bg-gray-700 rounded-full" />
                <div className="h-6 w-16 bg-gray-700 rounded-full" />
              </div>
            </div>
            <code className="text-xs text-gray-500 mt-2 block">p-4, gap-3, space-y-1, gap-2, mt-3</code>
          </div>

          {/* Filter Row */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Filter Row</h3>
            <div className="flex items-center gap-2 flex-wrap bg-gray-800/50 p-3 rounded-lg">
              <span className="text-xs text-gray-400 w-20">Seller Type</span>
              <div className="px-2.5 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs">Booth</div>
              <div className="px-2.5 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">Behind Bar</div>
              <div className="px-2.5 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">Machine</div>
            </div>
            <code className="text-xs text-gray-500 mt-2 block">gap-2, flex-wrap, p-3, px-2.5 py-1</code>
          </div>
        </div>
      </section>

      {/* Z-Index Scale */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
          Z-Index Scale
        </h2>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <code className="text-yellow-400 w-16">z-10</code>
              <span className="text-gray-400 text-sm">Sticky headers</span>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-yellow-400 w-16">z-20</code>
              <span className="text-gray-400 text-sm">Filter dropdowns, floating buttons</span>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-yellow-400 w-16">z-30</code>
              <span className="text-gray-400 text-sm">Dropdown panels</span>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-yellow-400 w-16">z-40</code>
              <span className="text-gray-400 text-sm">Modal backdrops</span>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-yellow-400 w-16">z-50</code>
              <span className="text-gray-400 text-sm">Modals, bottom sheets, side panels</span>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Notes */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Usage Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Prefer Tailwind spacing utilities over custom values</li>
          <li>• Use <code className="text-yellow-400">gap-*</code> for flex/grid spacing instead of margins</li>
          <li>• Use <code className="text-yellow-400">space-y-*</code> for vertical stacking of children</li>
          <li>• Avoid arbitrary z-index values — stick to the scale</li>
          <li>• Use <code className="text-yellow-400">size-*</code> for square elements (e.g., <code className="text-yellow-400">size-10</code> = 40px × 40px)</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Spacing',
  component: SpacingShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Scale: Story = {};
