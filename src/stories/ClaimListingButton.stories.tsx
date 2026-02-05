import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Building2, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

type ClaimState = 'default' | 'loading' | 'success-auto' | 'success-pending' | 'error';

interface ClaimButtonDemoProps {
  state: ClaimState;
  siteName?: string;
  userEmail?: string;
  isLoggedIn?: boolean;
  isJackpot?: boolean;
}

function ClaimButtonDemo({
  state,
  siteName = "Jimmy's Bar & Grill",
  userEmail = 'john@example.com',
  isLoggedIn = true,
  isJackpot = true,
}: ClaimButtonDemoProps) {
  // Success states
  if (state === 'success-auto') {
    return (
      <div className="rounded-lg p-6 bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-700">Claim Approved!</h3>
            <p className="text-sm mt-1 text-green-600">
              Your name matches the gambling manager on file. You now have access to manage this listing.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'success-pending') {
    return (
      <div className="rounded-lg p-6 bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-700">Claim Submitted</h3>
            <p className="text-sm mt-1 text-green-600">
              Your claim is pending review. We'll notify you once it's approved.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="rounded-lg p-6 bg-red-500/10 border border-red-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-700">Unable to Claim</h3>
            <p className="text-sm mt-1 text-red-600">
              This listing has already been claimed by another user.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default and loading states
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
      <div className="flex items-start gap-3 mb-4">
        <Building2 className="w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold">Is this your location?</h3>
          <p className="text-blue-100 text-sm mt-1">
            Claim &ldquo;{siteName}&rdquo; to add hours, photos, tab types, and prices.
            Help customers find your pull-tabs.
          </p>
        </div>
      </div>

      <button
        disabled={state === 'loading'}
        className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {state === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : isLoggedIn ? (
          'Claim This Listing'
        ) : (
          'Sign Up to Claim'
        )}
      </button>

      {isLoggedIn && (
        <p className="text-xs text-blue-200 mt-3">
          Signed in as {userEmail}
        </p>
      )}
    </div>
  );
}

function ClaimListingShowcase() {
  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-3xl font-bold text-white mb-2">Claim Listing Button</h1>
      <p className="text-gray-400 mb-8">
        CTA component for site operators to claim their listing. Handles multiple states.
      </p>

      <div className="space-y-8">
        {/* Default State - Logged In */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Default (Logged In)
          </h2>
          <ClaimButtonDemo state="default" isLoggedIn={true} />
        </section>

        {/* Default State - Not Logged In */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Default (Not Logged In)
          </h2>
          <ClaimButtonDemo state="default" isLoggedIn={false} />
        </section>

        {/* Loading State */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Loading
          </h2>
          <ClaimButtonDemo state="loading" />
        </section>

        {/* Success - Auto Approved */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Success (Auto-Approved)
          </h2>
          <ClaimButtonDemo state="success-auto" />
          <p className="text-xs text-gray-500 mt-2">
            When user's name matches the gambling manager on file
          </p>
        </section>

        {/* Success - Pending Review */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Success (Pending Review)
          </h2>
          <ClaimButtonDemo state="success-pending" />
          <p className="text-xs text-gray-500 mt-2">
            When claim needs manual verification
          </p>
        </section>

        {/* Error State */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Error
          </h2>
          <ClaimButtonDemo state="error" />
        </section>
      </div>

      {/* Implementation Notes */}
      <section className="mt-10 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Implementation Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Uses NextAuth session to determine login state</li>
          <li>• Redirects to signup with callback URL if not logged in</li>
          <li>• Auto-approves if user name matches gambling manager</li>
          <li>• Shows loading spinner during API call</li>
          <li>• Redirects to dashboard on success after 2 second delay</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Components/ClaimListingButton',
  component: ClaimListingShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllStates: Story = {};

export const Default: Story = {
  render: () => (
    <div className="p-6 max-w-xl">
      <ClaimButtonDemo state="default" isLoggedIn={true} />
    </div>
  ),
};

export const NotLoggedIn: Story = {
  render: () => (
    <div className="p-6 max-w-xl">
      <ClaimButtonDemo state="default" isLoggedIn={false} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="p-6 max-w-xl">
      <ClaimButtonDemo state="loading" />
    </div>
  ),
};

export const SuccessAutoApproved: Story = {
  render: () => (
    <div className="p-6 max-w-xl">
      <ClaimButtonDemo state="success-auto" />
    </div>
  ),
};

export const SuccessPending: Story = {
  render: () => (
    <div className="p-6 max-w-xl">
      <ClaimButtonDemo state="success-pending" />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="p-6 max-w-xl">
      <ClaimButtonDemo state="error" />
    </div>
  ),
};
