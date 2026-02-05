'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  MapPin,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Tablet,
  Store,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Site,
  SiteHours,
  TabType,
  TAB_TYPE_LABELS,
  PullTabPrice,
  PULL_TAB_PRICES,
  EtabSystem,
  ETAB_SYSTEM_LABELS,
} from '@/types/site';

const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

interface FormData {
  phone: string;
  website: string;
  hours: SiteHours;
  tab_type: TabType | '';
  pull_tab_prices: PullTabPrice[];
  etab_system: EtabSystem | '';
}

export default function EditSitePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const siteId = params.id as string;

  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    phone: '',
    website: '',
    hours: {},
    tab_type: '',
    pull_tab_prices: [],
    etab_system: '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/operator/login?callbackUrl=/operator/site/${siteId}/edit`);
    }
  }, [status, router, siteId]);

  // Fetch site data
  useEffect(() => {
    if (session?.user?.id && siteId) {
      fetchSite();
    }
  }, [session?.user?.id, siteId]);

  const fetchSite = async () => {
    try {
      const response = await fetch(`/api/operator/sites/${siteId}`);
      if (response.ok) {
        const data = await response.json();
        setSite(data.site);
        // Populate form with existing data
        setFormData({
          phone: data.site.phone || '',
          website: data.site.website || '',
          hours: data.site.hours || {},
          tab_type: data.site.tab_type || '',
          pull_tab_prices: data.site.pull_tab_prices || [],
          etab_system: data.site.etab_system || '',
        });
      } else if (response.status === 403) {
        setErrorMessage('You do not have permission to edit this listing.');
      } else if (response.status === 404) {
        setErrorMessage('Listing not found.');
      }
    } catch (error) {
      console.error('Failed to fetch site:', error);
      setErrorMessage('Failed to load listing details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch(`/api/operator/sites/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to save changes.');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('error');
      setErrorMessage('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHoursChange = (day: DayOfWeek, field: 'open' | 'close', value: string) => {
    setFormData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...(prev.hours[day] || { open: '', close: '' }),
          [field]: value,
        },
      },
    }));
  };

  const handleHoursClear = (day: DayOfWeek) => {
    setFormData((prev) => {
      const newHours = { ...prev.hours };
      delete newHours[day];
      return { ...prev, hours: newHours };
    });
  };

  const togglePrice = (price: PullTabPrice) => {
    setFormData((prev) => ({
      ...prev,
      pull_tab_prices: prev.pull_tab_prices.includes(price)
        ? prev.pull_tab_prices.filter((p) => p !== price)
        : [...prev.pull_tab_prices, price].sort((a, b) => a - b),
    }));
  };

  // Loading state
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--theme-accent)]/30 border-t-[var(--theme-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  // Error state
  if (errorMessage && !site) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-2">
            {errorMessage}
          </h2>
          <Link
            href="/operator/dashboard"
            className="inline-flex items-center gap-2 text-[var(--theme-accent)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!site) return null;

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--theme-surface)] border-b border-[var(--theme-border)]">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/operator/dashboard"
                className="p-2 -ml-2 hover:bg-[var(--theme-surface-hover)] rounded-lg transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--theme-text-secondary)]" />
              </Link>
              <div>
                <h1 className="heading text-lg font-semibold text-[var(--theme-text-primary)]">
                  Edit Listing
                </h1>
                <p className="text-sm text-[var(--theme-text-muted)]">{site.site_name}</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-bg)] rounded-lg font-semibold text-sm hover:bg-[var(--theme-accent-hover)] disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveStatus === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Info (Read-only) */}
          <section className="p-4 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--theme-accent)] mt-0.5" />
              <div>
                <h3 className="heading font-semibold text-[var(--theme-text-primary)]">
                  {site.site_name}
                </h3>
                <p className="text-sm text-[var(--theme-text-secondary)]">
                  {site.street_address}, {site.city}, {site.state} {site.zip_code}
                </p>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                  Operated by {site.organization_name}
                </p>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <h2 className="heading text-lg font-semibold text-[var(--theme-text-primary)] mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2.5 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-input-placeholder)] focus:outline-none focus:border-[var(--theme-input-border-focus)] focus:ring-2 focus:ring-[var(--theme-accent-light)]"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-input-placeholder)] focus:outline-none focus:border-[var(--theme-input-border-focus)] focus:ring-2 focus:ring-[var(--theme-accent-light)]"
                />
              </div>
            </div>
          </section>

          {/* Hours of Operation */}
          <section>
            <h2 className="heading text-lg font-semibold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Hours of Operation
            </h2>
            <div className="space-y-3">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex items-center gap-3 p-3 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg"
                >
                  <span className="w-24 text-sm font-medium text-[var(--theme-text-secondary)] capitalize">
                    {day}
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="time"
                      value={formData.hours[day]?.open || ''}
                      onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded text-sm text-[var(--theme-text-primary)] focus:outline-none focus:border-[var(--theme-input-border-focus)]"
                    />
                    <span className="text-[var(--theme-text-muted)]">to</span>
                    <input
                      type="time"
                      value={formData.hours[day]?.close || ''}
                      onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[var(--theme-input-bg)] border border-[var(--theme-input-border)] rounded text-sm text-[var(--theme-text-primary)] focus:outline-none focus:border-[var(--theme-input-border-focus)]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleHoursClear(day)}
                    className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-error)] transition-colors"
                  >
                    Closed
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Gambling Details */}
          <section>
            <h2 className="heading text-lg font-semibold text-[var(--theme-text-primary)] mb-4">
              Pull-Tab Details
            </h2>
            <div className="space-y-6">
              {/* Seller Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--theme-text-secondary)] mb-3">
                  <Store className="w-4 h-4" />
                  Seller Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(TAB_TYPE_LABELS) as TabType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tab_type: formData.tab_type === type ? '' : type,
                        })
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.tab_type === type
                          ? 'bg-[var(--theme-accent)] text-[var(--theme-bg)]'
                          : 'bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)] hover:border-[var(--theme-text-muted)]'
                      }`}
                    >
                      {TAB_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pull-Tab Prices */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--theme-text-secondary)] mb-3">
                  <DollarSign className="w-4 h-4" />
                  Pull-Tab Prices Available
                </label>
                <div className="flex flex-wrap gap-2">
                  {PULL_TAB_PRICES.map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => togglePrice(price)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.pull_tab_prices.includes(price)
                          ? 'bg-[var(--theme-tertiary)] text-white'
                          : 'bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)] hover:border-[var(--theme-text-muted)]'
                      }`}
                    >
                      ${price}
                    </button>
                  ))}
                </div>
              </div>

              {/* E-Tab System */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--theme-text-secondary)] mb-3">
                  <Tablet className="w-4 h-4" />
                  E-Tab System
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, etab_system: '' })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.etab_system === ''
                        ? 'bg-[var(--theme-text-muted)] text-white'
                        : 'bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)] hover:border-[var(--theme-text-muted)]'
                    }`}
                  >
                    None
                  </button>
                  {(Object.keys(ETAB_SYSTEM_LABELS) as EtabSystem[]).map((system) => (
                    <button
                      key={system}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          etab_system: formData.etab_system === system ? '' : system,
                        })
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.etab_system === system
                          ? 'bg-[var(--theme-secondary)] text-white'
                          : 'bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)] hover:border-[var(--theme-text-muted)]'
                      }`}
                    >
                      {ETAB_SYSTEM_LABELS[system]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Save Button (Mobile) */}
          <div className="sticky bottom-4 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--theme-accent)] text-[var(--theme-bg)] rounded-xl font-semibold hover:bg-[var(--theme-accent-hover)] disabled:opacity-50 transition-colors shadow-lg"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saveStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Saving Changes...' : saveStatus === 'success' ? 'Changes Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
