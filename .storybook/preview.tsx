import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0A0A0A' },
        { name: 'light', value: '#F9FAFB' },
        { name: 'surface', value: '#1A1A1A' },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  globalTypes: {
    theme: {
      description: 'Theme mode',
      defaultValue: 'jackpot',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default (Light)' },
          { value: 'jackpot', title: 'Jackpot Mode (Dark)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'jackpot';

      // Apply theme class to document root
      if (typeof document !== 'undefined') {
        if (theme === 'jackpot') {
          document.documentElement.classList.add('jackpot-mode');
        } else {
          document.documentElement.classList.remove('jackpot-mode');
        }
      }

      return (
        <div style={{
          background: theme === 'jackpot' ? '#0A0A0A' : '#F9FAFB',
          padding: '1rem',
          minHeight: '100vh',
        }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;