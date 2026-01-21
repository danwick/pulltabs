'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface ClaimListingButtonProps {
  siteId: number;
  siteName: string;
}

export default function ClaimListingButton({ siteId, siteName }: ClaimListingButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    autoApproved?: boolean;
  } | null>(null);

  const handleClaim = async () => {
    // If not logged in, redirect to signup with callback
    if (status !== 'authenticated') {
      const callbackUrl = encodeURIComponent(`/site/${siteId}?claim=true`);
      router.push(`/operator/signup?callbackUrl=${callbackUrl}`);
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/operator/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });

      const data = await response.json();

      if (response.ok) {
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
      }
    } catch (error) {
      console.error('Claim error:', error);
      setResult({
        success: false,
        message: 'An error occurred. Please try again.',
      });
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
          onClick={handleClaim}
          disabled={isLoading}
          className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : status === 'authenticated' ? (
            'Claim This Listing'
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
  );
}
