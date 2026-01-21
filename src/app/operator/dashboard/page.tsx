'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  MapPin,
  Clock,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface ClaimedSite {
  id: number;
  site_name: string;
  city: string;
  listing_status: string;
  claim_status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [claimedSites, setClaimedSites] = useState<ClaimedSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/operator/login?callbackUrl=/operator/dashboard');
    }
  }, [status, router]);

  // Fetch claimed sites
  useEffect(() => {
    if (session?.user?.id) {
      fetchClaimedSites();
    }
  }, [session?.user?.id]);

  const fetchClaimedSites = async () => {
    try {
      const response = await fetch('/api/operator/sites');
      if (response.ok) {
        const data = await response.json();
        setClaimedSites(data.sites || []);
      }
    } catch (error) {
      console.error('Failed to fetch claimed sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Loading state
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--theme-accent)]/30 border-t-[var(--theme-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      {/* Header */}
      <header className="bg-[var(--theme-header-gradient)] text-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6" />
              <h1 className="text-xl font-bold">Operator Dashboard</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--theme-text)]">
            Welcome, {session?.user?.name || session?.user?.email?.split('@')[0]}!
          </h2>
          <p className="text-[var(--theme-text-secondary)] mt-1">
            Manage your pull-tab locations from here
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-4 p-4 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl hover:border-[var(--theme-accent)] transition-colors group"
          >
            <div className="w-12 h-12 bg-[var(--theme-accent)]/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--theme-accent)]/20 transition-colors">
              <Plus className="w-6 h-6 text-[var(--theme-accent)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--theme-text)]">
                Claim a Listing
              </h3>
              <p className="text-sm text-[var(--theme-text-secondary)]">
                Find your location on the map
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--theme-text-secondary)]" />
          </Link>

          <Link
            href="/operator/settings"
            className="flex items-center gap-4 p-4 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl hover:border-[var(--theme-accent)] transition-colors group"
          >
            <div className="w-12 h-12 bg-[var(--theme-accent)]/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--theme-accent)]/20 transition-colors">
              <Settings className="w-6 h-6 text-[var(--theme-accent)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--theme-text)]">
                Account Settings
              </h3>
              <p className="text-sm text-[var(--theme-text-secondary)]">
                Update your profile & billing
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--theme-text-secondary)]" />
          </Link>
        </div>

        {/* My Listings Section */}
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl">
          <div className="px-4 py-3 border-b border-[var(--theme-border)]">
            <h3 className="font-semibold text-[var(--theme-text)] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              My Listings
            </h3>
          </div>

          {claimedSites.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[var(--theme-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[var(--theme-text-secondary)]" />
              </div>
              <h4 className="text-lg font-semibold text-[var(--theme-text)] mb-2">
                No listings yet
              </h4>
              <p className="text-[var(--theme-text-secondary)] mb-4">
                Find your location on the map and claim it to get started
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--theme-accent)] text-white rounded-lg hover:bg-[var(--theme-accent-hover)] transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Find My Location
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--theme-border)]">
              {claimedSites.map((site) => (
                <Link
                  key={site.id}
                  href={`/operator/site/${site.id}/edit`}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--theme-bg)] transition-colors"
                >
                  <div className="w-12 h-12 bg-[var(--theme-bg)] rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[var(--theme-accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--theme-text)] truncate">
                      {site.site_name}
                    </h4>
                    <p className="text-sm text-[var(--theme-text-secondary)]">
                      {site.city}, MN
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {site.claim_status === 'pending' ? (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-600 rounded-full">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    ) : site.claim_status === 'approved' ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-600 rounded-full capitalize">
                        {site.listing_status}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-500/10 text-red-600 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-[var(--theme-text-secondary)]" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl">
          <h4 className="font-semibold text-[var(--theme-text)] mb-2">
            Need Help?
          </h4>
          <p className="text-sm text-[var(--theme-text-secondary)]">
            Contact us at{' '}
            <a
              href="mailto:support@pulltabmagic.com"
              className="text-[var(--theme-accent)] hover:underline"
            >
              support@pulltabmagic.com
            </a>{' '}
            and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </main>
    </div>
  );
}
