'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  X,
  Star,
  Check,
  Camera,
  Clock3,
  DollarSign,
  Sparkles,
} from 'lucide-react';

interface ClaimListingButtonProps {
  siteId: number;
  siteName: string;
}

type Tier = 'standard' | 'premium';

const TIER_FEATURES = {
  standard: {
    name: 'Basic',
    price: '$10/month',
    description: 'Get your bar listed and verified',
    features: [
      'Bar name & address verified',
      'Show up in search results',
      'Basic map pin',
    ],
  },
  premium: {
    name: 'Premium',
    price: '$20/month',
    description: 'Stand out and attract more customers',
    features: [
      'Everything in Basic',
      'Add photos (up to 5)',
      'Hours of operation',
      'Pull-tab prices & types',
      'E-tab system info',
      'Gold premium badge',
      'Priority in search results',
    ],
  },
};

export default function ClaimListingButton({ siteId, siteName }: ClaimListingButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier>('premium');
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    autoApproved?: boolean;
  } | null>(null);

  const isSuperAdmin = session?.user?.role === 'super_admin';

  const handleClaimClick = async () => {
    // If not logged in, redirect to signup with callback
    if (status !== 'authenticated') {
      const callbackUrl = encodeURIComponent(`/site/${siteId}?claim=true`);
      router.push(`/operator/signup?callbackUrl=${callbackUrl}`);
      return;
    }

    // Super admins claim instantly with premium tier, no modal needed
    if (isSuperAdmin) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/operator/claims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteId, tier: 'premium' }),
        });
        const data = await response.json();
        if (response.ok) {
          setResult({
            success: true,
            message: 'Claimed! You can now edit this listing.',
            autoApproved: true,
          });
          setTimeout(() => {
            router.push(`/operator/site/${siteId}/edit`);
          }, 1500);
        } else {
          setResult({ success: false, message: data.error || 'Failed to claim' });
        }
      } catch {
        setResult({ success: false, message: 'An error occurred' });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Show tier selection modal for regular users
    setShowTierModal(true);
  };

  const handleConfirmClaim = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/operator/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, tier: selectedTier }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowTierModal(false);
        setResult({
          success: true,
          message: data.message,
          autoApproved: data.claim?.autoApproved,
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/operator/dashboard');
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to submit claim',
        });
        setShowTierModal(false);
      }
    } catch (error) {
      console.error('Claim error:', error);
      setResult({
        success: false,
        message: 'An error occurred. Please try again.',
      });
      setShowTierModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show result state
  if (result) {
    return (
      <div className={`rounded-lg p-6 ${result.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
        <div className="flex items-start gap-3">
          {result.success ? (
            result.autoApproved ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            )
          ) : (
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          )}
          <div>
            <h3 className={`font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.success
                ? result.autoApproved
                  ? 'Claim Approved!'
                  : 'Claim Submitted'
                : 'Unable to Claim'}
            </h3>
            <p className={`text-sm mt-1 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.message}
            </p>
            {result.success && (
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to your dashboard...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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

        {status === 'loading' ? (
          <button
            disabled
            className="bg-white/20 text-white px-6 py-2.5 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </button>
        ) : (
          <button
            onClick={handleClaimClick}
            disabled={isLoading}
            className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Claiming...
              </>
            ) : status === 'authenticated' ? (
              isSuperAdmin ? 'Claim & Edit Now' : 'Claim This Listing'
            ) : (
              'Sign Up to Claim'
            )}
          </button>
        )}

        {status === 'authenticated' && (
          <p className="text-xs text-blue-200 mt-3">
            Signed in as {session?.user?.email}
          </p>
        )}
      </div>

      {/* Tier Selection Modal */}
      {showTierModal && (
        <>
          <div
            role="presentation"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowTierModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Choose Your Plan</h2>
              <button
                onClick={() => setShowTierModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tier Options */}
            <div className="p-6 space-y-4">
              {/* Basic Tier */}
              <button
                onClick={() => setSelectedTier('standard')}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedTier === 'standard'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {TIER_FEATURES.standard.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {TIER_FEATURES.standard.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {TIER_FEATURES.standard.price}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-auto mt-2 ${
                      selectedTier === 'standard'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedTier === 'standard' && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {TIER_FEATURES.standard.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>

              {/* Premium Tier */}
              <button
                onClick={() => setSelectedTier('premium')}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${
                  selectedTier === 'premium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Recommended badge */}
                <div className="absolute -top-3 left-4 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Recommended
                </div>

                <div className="flex items-start justify-between mt-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {TIER_FEATURES.premium.name}
                      </h3>
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {TIER_FEATURES.premium.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {TIER_FEATURES.premium.price}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-auto mt-2 ${
                      selectedTier === 'premium'
                        ? 'border-yellow-500 bg-yellow-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedTier === 'premium' && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {TIER_FEATURES.premium.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>

              {/* 2-month trial note */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Start with a <span className="font-semibold text-green-600">2-month free trial</span> at Premium level
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleConfirmClaim}
                disabled={isLoading}
                className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Claim with {selectedTier === 'premium' ? 'Premium' : 'Basic'}
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
