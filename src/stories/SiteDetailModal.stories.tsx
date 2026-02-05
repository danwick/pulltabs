import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { X, MapPin, Navigation, Clock, ExternalLink, Globe, Phone } from 'lucide-react';
import { Site, TAB_TYPE_LABELS, ETAB_SYSTEM_LABELS, TabType, EtabSystem } from '../types/site';

// Mock sites
const unclaimedSite: Site = {
  site_id: 1,
  site_name: "Jimmy's Bar & Grill",
  organization_name: 'Minneapolis VFW Post 246',
  gambling_manager: 'John Smith',
  street_address: '1234 Main Street',
  city: 'Minneapolis',
  state: 'MN',
  zip_code: '55401',
  full_address: '1234 Main Street, Minneapolis, MN 55401',
  latitude: 44.9778,
  longitude: -93.2650,
  license_number: 'G-12345',
  gambling_types_inferred: 'Pull-Tabs, E-Tabs, Bingo',
  gross_receipts: 500000,
  net_receipts: 75000,
  fiscal_year: '2025',
  is_active: true,
  listing_status: 'unclaimed',
};

const premiumSite: Site = {
  site_id: 2,
  site_name: "Lucky's Gaming Lounge",
  organization_name: 'St. Paul Eagles Club',
  gambling_manager: 'Jane Doe',
  street_address: '567 Oak Avenue',
  city: 'St. Paul',
  state: 'MN',
  zip_code: '55102',
  full_address: '567 Oak Avenue, St. Paul, MN 55102',
  latitude: 44.9537,
  longitude: -93.0900,
  license_number: 'G-12346',
  gambling_types_inferred: 'Pull-Tabs, E-Tabs',
  gross_receipts: 750000,
  net_receipts: 120000,
  fiscal_year: '2025',
  is_active: true,
  listing_status: 'premium',
  tab_type: 'booth',
  pull_tab_prices: [5, 3, 2, 1],
  etab_system: 'pilot',
  website: 'www.luckyslounge.com',
  phone: '(651) 555-0123',
  hours: {
    monday: { open: '11:00 AM', close: '1:00 AM' },
    tuesday: { open: '11:00 AM', close: '1:00 AM' },
    wednesday: { open: '11:00 AM', close: '1:00 AM' },
    thursday: { open: '11:00 AM', close: '1:00 AM' },
    friday: { open: '11:00 AM', close: '2:00 AM' },
    saturday: { open: '11:00 AM', close: '2:00 AM' },
    sunday: { open: '12:00 PM', close: '12:00 AM' },
  },
};

interface SiteDetailContentProps {
  site: Site;
  showCloseButton?: boolean;
  isJackpot?: boolean;
}

function SiteDetailContent({ site, showCloseButton, isJackpot = true }: SiteDetailContentProps) {
  const hasPhotos = !!(site.photos && site.photos.length > 0);

  return (
    <div className="pb-8">
      {/* Header */}
      <div className={`sticky top-0 border-b px-4 py-4 z-10 ${
        isJackpot ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className={`text-xl font-bold text-balance ${isJackpot ? 'text-white' : 'text-gray-900'}`}>
              {site.site_name}
            </h2>
            <div className={`flex items-center gap-2 mt-1 text-sm ${isJackpot ? 'text-gray-400' : 'text-gray-600'}`}>
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{site.street_address}, {site.city}</span>
            </div>
          </div>
          {showCloseButton && (
            <button
              className={`p-2 rounded-full flex-shrink-0 ${
                isJackpot ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <a
            href="#"
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
              isJackpot
                ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
          <a
            href="#"
            className={`px-4 py-2.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${
              isJackpot
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Full Page
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Gambling Types */}
        {site.gambling_types_inferred && (
          <div>
            <h3 className={`text-sm font-semibold mb-2 ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
              Available Games
            </h3>
            <div className="flex flex-wrap gap-2">
              {site.gambling_types_inferred.split(', ').map((type) => (
                <span
                  key={type}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    isJackpot ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hours */}
        {site.hours && (
          <div>
            <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
              isJackpot ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Clock className="w-4 h-4" />
              Hours
            </h3>
            <div className={`text-sm space-y-1 ${isJackpot ? 'text-gray-400' : 'text-gray-600'}`}>
              {site.hours.monday && <p>Mon: {site.hours.monday.open} - {site.hours.monday.close}</p>}
              {site.hours.tuesday && <p>Tue: {site.hours.tuesday.open} - {site.hours.tuesday.close}</p>}
              {site.hours.wednesday && <p>Wed: {site.hours.wednesday.open} - {site.hours.wednesday.close}</p>}
              {site.hours.thursday && <p>Thu: {site.hours.thursday.open} - {site.hours.thursday.close}</p>}
              {site.hours.friday && <p>Fri: {site.hours.friday.open} - {site.hours.friday.close}</p>}
              {site.hours.saturday && <p>Sat: {site.hours.saturday.open} - {site.hours.saturday.close}</p>}
              {site.hours.sunday && <p>Sun: {site.hours.sunday.open} - {site.hours.sunday.close}</p>}
            </div>
          </div>
        )}

        {/* Operator Details */}
        {(site.tab_type || site.pull_tab_prices?.length || site.etab_system) && (
          <>
            {site.tab_type && (
              <div>
                <h3 className={`text-sm font-semibold mb-2 ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
                  Seller Type
                </h3>
                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isJackpot ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500 text-white'
                }`}>
                  {TAB_TYPE_LABELS[site.tab_type as TabType]}
                </span>
              </div>
            )}

            {site.pull_tab_prices && site.pull_tab_prices.length > 0 && (
              <div>
                <h3 className={`text-sm font-semibold mb-2 ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
                  Pull-Tab Prices
                </h3>
                <div className="flex gap-2">
                  {site.pull_tab_prices.sort((a, b) => b - a).map((price) => (
                    <span
                      key={price}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        isJackpot ? 'bg-green-500/20 text-green-400' : 'bg-green-500 text-white'
                      }`}
                    >
                      ${price}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {site.etab_system && (
              <div>
                <h3 className={`text-sm font-semibold mb-2 ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
                  E-Tabs System
                </h3>
                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isJackpot ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500 text-white'
                }`}>
                  {ETAB_SYSTEM_LABELS[site.etab_system as EtabSystem]}
                </span>
              </div>
            )}
          </>
        )}

        {/* Contact Info */}
        {(site.website || site.phone) && (
          <div className={`space-y-3 pt-4 border-t ${isJackpot ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-semibold ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
              Contact Info
            </h3>
            {site.website && (
              <a
                href="#"
                className={`flex items-center gap-2 text-sm ${
                  isJackpot ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-500 hover:text-blue-600'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="underline">{site.website}</span>
              </a>
            )}
            {site.phone && (
              <a
                href="#"
                className={`flex items-center gap-2 text-sm ${
                  isJackpot ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-500 hover:text-blue-600'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{site.phone}</span>
              </a>
            )}
          </div>
        )}

        {/* Photos */}
        <div>
          <h3 className={`text-sm font-semibold mb-2 ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
            Photos
          </h3>
          <div className={`w-full h-32 rounded-lg flex items-center justify-center text-sm ${
            isJackpot ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
          }`}>
            No photos yet
          </div>
        </div>

        {/* Organization */}
        {site.organization_name && (
          <div className={`pt-4 border-t ${isJackpot ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-1 ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
              Operated by
            </h3>
            <p className={isJackpot ? 'text-gray-400' : 'text-gray-600'}>{site.organization_name}</p>
          </div>
        )}

        {/* Claim CTA */}
        {site.listing_status === 'unclaimed' && (
          <div className={`rounded-lg p-4 mt-6 ${
            isJackpot
              ? 'bg-yellow-500/10 border border-yellow-500/30'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`font-semibold mb-2 ${isJackpot ? 'text-white' : 'text-gray-900'}`}>
              Is this your location?
            </p>
            <p className={`text-sm mb-3 ${isJackpot ? 'text-gray-400' : 'text-gray-600'}`}>
              Claim this listing to add hours, photos, and keep your information up to date.
            </p>
            <button className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              isJackpot
                ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}>
              Claim This Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SiteDetailShowcase() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Site Detail Modal</h1>
      <p className="text-gray-400 mb-8">
        Site detail view shown as a bottom sheet (mobile) or side panel (desktop).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Premium Site - Jackpot Mode */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Premium Site (Jackpot Mode)
          </h2>
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-h-[600px] overflow-y-auto">
            <SiteDetailContent site={premiumSite} showCloseButton isJackpot={true} />
          </div>
        </section>

        {/* Unclaimed Site - Jackpot Mode */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Unclaimed Site (Jackpot Mode)
          </h2>
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-h-[600px] overflow-y-auto">
            <SiteDetailContent site={unclaimedSite} showCloseButton isJackpot={true} />
          </div>
        </section>

        {/* Premium Site - Default Mode */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Premium Site (Default Mode)
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 max-h-[600px] overflow-y-auto">
            <SiteDetailContent site={premiumSite} showCloseButton isJackpot={false} />
          </div>
        </section>

        {/* Mobile Bottom Sheet Preview */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Mobile Bottom Sheet (Visual)
          </h2>
          <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            {/* Drag handle */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1.5 rounded-full bg-gray-700" />
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <SiteDetailContent site={premiumSite} isJackpot={true} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            On mobile, the modal slides up from the bottom with a drag handle
          </p>
        </section>
      </div>

      {/* Implementation Notes */}
      <section className="mt-10 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Implementation Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• <strong>Mobile:</strong> Bottom sheet with <code className="text-yellow-400">animate-slideUp</code>, max-h-[85dvh]</li>
          <li>• <strong>Desktop:</strong> Right panel (450px wide) with <code className="text-yellow-400">animate-slideInRight</code></li>
          <li>• Updates URL to <code className="text-yellow-400">/site/[id]</code> without navigation</li>
          <li>• Closes on: Escape key, backdrop click, back button</li>
          <li>• Backdrop uses <code className="text-yellow-400">role="presentation"</code> for accessibility</li>
          <li>• Safe area padding for iPhone: <code className="text-yellow-400">pb-[env(safe-area-inset-bottom)]</code></li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Components/SiteDetailModal',
  component: SiteDetailShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};

export const PremiumSite: Story = {
  render: () => (
    <div className="p-4 max-w-md bg-gray-900 rounded-xl">
      <SiteDetailContent site={premiumSite} showCloseButton isJackpot={true} />
    </div>
  ),
};

export const UnclaimedSite: Story = {
  render: () => (
    <div className="p-4 max-w-md bg-gray-900 rounded-xl">
      <SiteDetailContent site={unclaimedSite} showCloseButton isJackpot={true} />
    </div>
  ),
};

export const DefaultMode: Story = {
  render: () => (
    <div className="p-4 max-w-md bg-white rounded-xl border border-gray-200">
      <SiteDetailContent site={premiumSite} showCloseButton isJackpot={false} />
    </div>
  ),
};
