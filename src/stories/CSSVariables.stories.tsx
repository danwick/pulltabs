import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const defaultThemeVars = {
  'Core': {
    '--background': '#ffffff',
    '--foreground': '#171717',
  },
  'Theme Colors': {
    '--theme-bg': '#f9fafb',
    '--theme-surface': '#ffffff',
    '--theme-surface-hover': '#f3f4f6',
    '--theme-border': '#e5e7eb',
    '--theme-text-primary': '#111827',
    '--theme-text-secondary': '#6b7280',
    '--theme-text-muted': '#9ca3af',
  },
  'Accent Colors': {
    '--theme-accent': '#3b82f6',
    '--theme-accent-hover': '#2563eb',
    '--theme-accent-light': '#dbeafe',
  },
  'Status Colors': {
    '--theme-success': '#22c55e',
    '--theme-success-light': '#dcfce7',
    '--theme-warning': '#eab308',
    '--theme-warning-light': '#fef9c3',
  },
  'Header': {
    '--theme-header-bg': '#ffffff',
    '--theme-header-text': '#111827',
    '--theme-header-border': '#e5e7eb',
  },
  'Cards': {
    '--theme-card-bg': '#ffffff',
    '--theme-card-border': '#e5e7eb',
    '--theme-card-shadow': '0 1px 3px rgba(0,0,0,0.1)',
  },
  'Map Marker': {
    '--theme-marker-bg': '#3b82f6',
    '--theme-marker-text': '#ffffff',
  },
};

const jackpotThemeVars = {
  'Core': {
    '--background': '#0a0a0a',
    '--foreground': '#f5f5f5',
  },
  'Theme Colors': {
    '--theme-bg': '#0a0a0a',
    '--theme-surface': '#1a1a1a',
    '--theme-surface-hover': '#262626',
    '--theme-border': '#333333',
    '--theme-text-primary': '#f5f5f5',
    '--theme-text-secondary': '#a3a3a3',
    '--theme-text-muted': '#737373',
  },
  'Accent Colors': {
    '--theme-accent': '#ffd700',
    '--theme-accent-hover': '#ffed4a',
    '--theme-accent-light': 'rgba(255, 215, 0, 0.15)',
  },
  'Status Colors': {
    '--theme-success': '#22c55e',
    '--theme-success-light': 'rgba(34, 197, 94, 0.2)',
    '--theme-warning': '#ffd700',
    '--theme-warning-light': 'rgba(255, 215, 0, 0.2)',
  },
  'Header': {
    '--theme-header-bg': '#1e3a8a',
    '--theme-header-text': '#ffd700',
    '--theme-header-border': 'transparent',
  },
  'Cards': {
    '--theme-card-bg': '#1a1a1a',
    '--theme-card-border': '#333333',
    '--theme-card-shadow': '0 4px 20px rgba(255, 215, 0, 0.1)',
  },
  'Map Marker': {
    '--theme-marker-bg': '#ffd700',
    '--theme-marker-text': '#0a0a0a',
  },
};

function VariableSwatch({ name, value }: { name: string; value: string }) {
  const isColor = value.startsWith('#') || value.startsWith('rgb');
  const isTransparent = value === 'transparent';

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-700/50 last:border-0">
      {isColor && !isTransparent ? (
        <div
          className="size-8 rounded border border-white/20 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
      ) : (
        <div className="size-8 rounded border border-dashed border-gray-600 flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
          {isTransparent ? '∅' : '—'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <code className="text-sm text-yellow-400 font-mono">{name}</code>
      </div>
      <code className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{value}</code>
    </div>
  );
}

function VariableSection({ title, variables }: { title: string; variables: Record<string, string> }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">{title}</h3>
      <div className="bg-gray-800/50 rounded-lg px-4 py-2">
        {Object.entries(variables).map(([name, value]) => (
          <VariableSwatch key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  );
}

function CSSVariablesShowcase() {
  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-2">CSS Variables</h1>
      <p className="text-gray-400 mb-8">
        Theme variables defined in <code className="text-yellow-400">globals.css</code>.
        These power the dual-theme system (Default vs Jackpot Mode).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jackpot Mode */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-sm font-semibold">
              Jackpot Mode
            </span>
            <code className="text-xs text-gray-500">:root.jackpot-mode</code>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            {Object.entries(jackpotThemeVars).map(([section, vars]) => (
              <VariableSection key={section} title={section} variables={vars} />
            ))}
          </div>
        </div>

        {/* Default Mode */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">
              Default Mode
            </span>
            <code className="text-xs text-gray-500">:root</code>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            {Object.entries(defaultThemeVars).map(([section, vars]) => (
              <div key={section} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">{section}</h3>
                <div className="bg-gray-50 rounded-lg px-4 py-2">
                  {Object.entries(vars).map(([name, value]) => (
                    <div key={name} className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-0">
                      {(value.startsWith('#') || value.startsWith('rgb')) && value !== 'transparent' ? (
                        <div
                          className="size-8 rounded border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: value }}
                        />
                      ) : (
                        <div className="size-8 rounded border border-dashed border-gray-300 flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                          —
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <code className="text-sm text-blue-600 font-mono">{name}</code>
                      </div>
                      <code className="text-xs text-gray-500 font-mono truncate max-w-[200px]">{value}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">In CSS</h3>
            <pre className="bg-gray-900 rounded p-3 text-sm overflow-x-auto">
              <code className="text-green-400">{`.card {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
  color: var(--theme-text-primary);
}`}</code>
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">In Tailwind (inline style)</h3>
            <pre className="bg-gray-900 rounded p-3 text-sm overflow-x-auto">
              <code className="text-green-400">{`<div style={{
  background: 'var(--theme-surface)'
}}>
  Content
</div>`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Theme Toggle Note */}
      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-yellow-400">
          <strong>Note:</strong> The theme is toggled by adding/removing the <code className="bg-gray-800 px-1 rounded">jackpot-mode</code> class
          on the <code className="bg-gray-800 px-1 rounded">&lt;html&gt;</code> element. Components should use these CSS variables
          or check <code className="bg-gray-800 px-1 rounded">isJackpot</code> from ThemeContext for conditional styling.
        </p>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/CSS Variables',
  component: CSSVariablesShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const ThemeVariables: Story = {};
