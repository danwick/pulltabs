import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmptyState, {
  NoResultsState,
  NoLocationState,
  ErrorState,
  OfflineState,
  WelcomeState,
} from '@/components/EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#09090b' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoResults: Story = {
  render: () => <NoResultsState onClearFilters={() => alert('Clear filters clicked')} />,
  parameters: {
    docs: {
      description: {
        story: 'Shown when a search or filter returns no matching locations.',
      },
    },
  },
};

export const NoLocation: Story = {
  render: () => <NoLocationState onEnableLocation={() => alert('Enable location clicked')} />,
  parameters: {
    docs: {
      description: {
        story: 'Prompts user to enable location services for "Near Me" functionality.',
      },
    },
  },
};

export const Error: Story = {
  render: () => <ErrorState onRetry={() => alert('Retry clicked')} />,
  parameters: {
    docs: {
      description: {
        story: 'Displayed when an API call or data fetch fails.',
      },
    },
  },
};

export const Offline: Story = {
  render: () => <OfflineState onRetry={() => alert('Retry clicked')} />,
  parameters: {
    docs: {
      description: {
        story: 'Shown when the user has no internet connection.',
      },
    },
  },
};

export const Welcome: Story = {
  render: () => <WelcomeState onGetStarted={() => alert('Get started clicked')} />,
  parameters: {
    docs: {
      description: {
        story: 'First-time user welcome screen with onboarding prompt.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      <div className="bg-zinc-900 rounded-lg">
        <NoResultsState />
      </div>
      <div className="bg-zinc-900 rounded-lg">
        <NoLocationState />
      </div>
      <div className="bg-zinc-900 rounded-lg">
        <ErrorState />
      </div>
      <div className="bg-zinc-900 rounded-lg">
        <OfflineState />
      </div>
      <div className="bg-zinc-900 rounded-lg">
        <WelcomeState />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'All empty state variants side by side for comparison.',
      },
    },
  },
};

export const CustomIcon: Story = {
  render: () => (
    <EmptyState
      icon={<span className="text-4xl">🎲</span>}
      title="Custom Empty State"
      description="You can pass a custom icon for special use cases."
      action={{ label: 'Take Action', onClick: () => alert('Action clicked') }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom empty state with a user-provided icon instead of an illustration.',
      },
    },
  },
};

export const WithoutAction: Story = {
  render: () => (
    <EmptyState
      variant="no-results"
      title="No locations found"
      description="Try adjusting your filters or search in a different area."
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty state without an action button - just informational.',
      },
    },
  },
};
