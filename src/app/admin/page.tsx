'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Shield,
  Store,
  DollarSign,
  Tv,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

interface Site {
  site_id: number;
  site_name: string;
  organization_name: string | null;
  city: string;
  state: string;
  listing_status: string;
  phone: string | null;
  website: string | null;
  tab_type: string | null;
  pull_tab_prices: number[] | null;
  etab_system: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isJackpot } = useTheme();

  const [sites, setSites] = useState<Site[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Check auth and role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/operator/login?callbackUrl=/admin');
    } else if (status === 'authenticated' && session?.user?.role !== 'super_admin') {
      router.push('/operator/dashboard');
    }
  }, [status, session, router]);

  // Fetch sites
  const fetchSites = useCallback(async (page = 1, searchQuery = '') => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/admin/sites?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSites(data.sites);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === 'super_admin') {
      fetchSites(1, search);
    }
  }, [session, fetchSites, search]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session?.user?.role === 'super_admin') {
        fetchSites(1, search);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchSites, session]);

  const handlePageChange = (newPage: number) => {
    fetchSites(newPage, search);
  };

  // Loading
  if (status === 'loading' || (status === 'authenticated' && session?.user?.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--theme-accent)] animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--theme-surface)] border-b border-[var(--theme-border)]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[var(--theme-accent)]" />
              <div>
                <h1 className="heading text-lg font-semibold text-[var(--theme-text-primary)]">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-[var(--theme-text-muted)]">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/"
                className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--theme-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, organization, or city..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-input-placeholder)] focus:outline-none focus:border-[var(--theme-accent)]"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--theme-accent)] text-[var(--theme-bg)] rounded-lg font-semibold text-sm hover:bg-[var(--theme-accent-hover)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Site
          </button>
        </div>

        {/* Stats */}
        {pagination && (
          <div className="mb-4 text-sm text-[var(--theme-text-muted)]">
            Showing {sites.length} of {pagination.total} sites
            {search && ` matching "${search}"`}
          </div>
        )}

        {/* Sites List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-[var(--theme-accent)] animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {sites.map((site) => (
              <div
                key={site.site_id}
                className="flex items-center justify-between p-4 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg hover:border-[var(--theme-text-muted)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[var(--theme-text-primary)] truncate">
                      {site.site_name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        site.listing_status === 'premium'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : site.listing_status === 'standard'
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-gray-500/20 text-gray-500'
                      }`}
                    >
                      {site.listing_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-[var(--theme-text-muted)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {site.city}, {site.state}
                    </span>
                    {site.tab_type && (
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        {site.tab_type === 'booth' ? 'Booth' : site.tab_type === 'behind_bar' ? 'Bar' : 'Machine'}
                      </span>
                    )}
                    {site.pull_tab_prices && site.pull_tab_prices.length > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {site.pull_tab_prices.sort((a, b) => b - a).map(p => `$${p}`).join(', ')}
                      </span>
                    )}
                    {site.etab_system && (
                      <span className="flex items-center gap-1">
                        <Tv className="w-3 h-3" />
                        {site.etab_system === 'pilot' ? 'Pilot' : '3 Diamonds'}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/operator/site/${site.site_id}/edit`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg text-sm text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-hover)] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            ))}

            {sites.length === 0 && !isLoading && (
              <div className="text-center py-12 text-[var(--theme-text-muted)]">
                No sites found
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--theme-surface-hover)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm text-[var(--theme-text-muted)]">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--theme-surface-hover)] transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Add Site Modal */}
      {showAddForm && (
        <AddSiteModal
          onClose={() => setShowAddForm(false)}
          onSuccess={(siteId) => {
            setShowAddForm(false);
            router.push(`/operator/site/${siteId}/edit`);
          }}
        />
      )}
    </div>
  );
}

// Add Site Modal Component
function AddSiteModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (siteId: number) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    site_name: '',
    organization_name: '',
    street_address: '',
    city: '',
    state: 'MN',
    zip_code: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess(data.site_id);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create site');
      }
    } catch {
      setError('Failed to create site');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--theme-surface)] rounded-xl shadow-xl">
        <div className="p-6">
          <h2 className="heading text-xl font-semibold text-[var(--theme-text-primary)] mb-4">
            Add New Site
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
                Site Name *
              </label>
              <input
                type="text"
                required
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="e.g., Joe's Bar"
                className="w-full px-3 py-2 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-input-placeholder)] focus:outline-none focus:border-[var(--theme-accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                placeholder="e.g., Local Lions Club"
                className="w-full px-3 py-2 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-input-placeholder)] focus:outline-none focus:border-[var(--theme-accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                placeholder="123 Main St"
                className="w-full px-3 py-2 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-input-placeholder)] focus:outline-none focus:border-[var(--theme-accent)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Minneapolis"
                  className="w-full px-3 py-2 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-input-placeholder)] focus:outline-none focus:border-[var(--theme-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  placeholder="55401"
                  className="w-full px-3 py-2 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-input-placeholder)] focus:outline-none focus:border-[var(--theme-accent)]"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-bg)] rounded-lg font-semibold hover:bg-[var(--theme-accent-hover)] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create & Edit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
