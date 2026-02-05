import type { Preview } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { ThemeProvider } from '../src/contexts/ThemeContext'
import '../src/app/globals.css'

// Decorator component that syncs Storybook toolbar with CSS class
function ThemeWrapper({ theme, children }: { theme: string; children: React.ReactNode }) {
  useEffect(() => {
    // Force the class after ThemeProvider mounts
    const root = document.documentElement;
    if (theme === 'jackpot') {
      root.classList.add('jackpot-mode');
    } else {
      root.classList.remove('jackpot-mode');
    }

    // Also set localStorage so ThemeProvider picks it up
    localStorage.setItem('pulltab-theme', theme);
  }, [theme]);

  return <>{children}</>;
}

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
        { name: 'dark', value: '#09090b' },
        { name: 'light', value: '#F9FAFB' },
        { name: 'surface', value: '#18181b' },
      ],
    },
    a11y: {
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

      return (
        <ThemeProvider>
          <ThemeWrapper theme={theme}>
            <div style={{
              background: theme === 'jackpot' ? '#09090b' : '#F9FAFB',
              padding: '1rem',
              minHeight: '100vh',
            }}>
              <Story />
            </div>
          </ThemeWrapper>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
