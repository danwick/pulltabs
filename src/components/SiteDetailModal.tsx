'use client';

import { useEffect, useCallback } from 'react';
import { Site, TAB_TYPE_LABELS, ETAB_SYSTEM_LABELS, TabType, EtabSystem } from '@/types/site';
import { X, MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SiteDetailModalProps {
  site: Site | null;
  onClose: () => void;
}

export default function SiteDetailModal({ site, onClose }: SiteDetailModalProps) {
  // Update URL when site changes
  useEffect(() => {
    if (site) {
      // Update URL without navigation
      window.history.pushState(null, '', `/site/${site.site_id}`);
    }
  }, [site]);

  // Handle close - restore URL
  const handleClose = useCallback(() => {
    window.history.pushState(null, '', '/');
    onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && site) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [site, handleClose]);

  // Handle back button
  useEffect(() => {
    const handlePopState = () => {
      if (site) {
        onClose();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [site, onClose]);

  if (!site) return null;

  const hasPhotos = !!(site.photos && site.photos.length > 0);

  return (
    <>
      {/* Backdrop - click to close */}
      <div
        className="fixed inset-0 bg-black/30 z-40 md:bg-transparent md:pointer-events-none"
        onClick={handleClose}
      />

      {/* Mobile: Bottom Sheet */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden animate-slideUp">
        {/* Drag handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-40px)]">
          <SiteDetailContent site={site} onClose={handleClose} hasPhotos={hasPhotos} />
        </div>
      </div>

      {/* Desktop: Right Panel */}
      <div className="hidden md:block fixed top-0 right-0 h-full w-[450px] z-50 bg-white shadow-2xl overflow-hidden animate-slideInRight">
        <div className="h-full overflow-y-auto">
          <SiteDetailContent site={site} onClose={handleClose} hasPhotos={hasPhotos} showCloseButton />
        </div>
      </div>
    </>
  );
}

interface SiteDetailContentProps {
  site: Site;
  onClose: () => void;
  hasPhotos: boolean;
  showCloseButton?: boolean;
}

function SiteDetailContent({ site, onClose, hasPhotos, showCloseButton }: SiteDetailContentProps) {
  return (
    <div className="pb-8">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-4 z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-gray-900">{site.site_name}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{site.street_address}, {site.city}</span>
            </div>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          {site.latitude && site.longitude && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>
          )}
          <Link
            href={`/site/${site.site_id}`}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Full Page
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Gambling Types (from GCB data) */}
        {site.gambling_types_inferred && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Games</h3>
            <div className="flex flex-wrap gap-2">
              {site.gambling_types_inferred.split(', ').map((type) => (
                <span
                  key={type}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
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
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hours
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
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

        {/* Operator-Provided Details (only show if site has any) */}
        {(site.tab_type || site.pull_tab_prices?.length || site.etab_system) && (
          <>
            {/* Tab Type: Booth / Bar / Machine */}
            {site.tab_type && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Where to Buy</h3>
                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white">
                  {TAB_TYPE_LABELS[site.tab_type as TabType]}
                </span>
              </div>
            )}

            {/* Pull-Tab Prices */}
            {site.pull_tab_prices && site.pull_tab_prices.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Pull-Tab Prices</h3>
                <div className="flex gap-2">
                  {site.pull_tab_prices.sort((a, b) => b - a).map((price) => (
                    <span
                      key={price}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white"
                    >
                      ${price}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* E-Tabs */}
            {site.etab_system && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">E-Tabs System</h3>
                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-500 text-white">
                  {ETAB_SYSTEM_LABELS[site.etab_system as EtabSystem]}
                </span>
              </div>
            )}
          </>
        )}

        {/* Photos */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Photos</h3>
          {hasPhotos && site.photos ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {site.photos.map((photo, index) => (
                <div key={index} className="w-40 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              No photos yet
            </div>
          )}
        </div>

        {/* Organization Info */}
        {site.organization_name && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Operated by</h3>
            <p className="text-gray-600">{site.organization_name}</p>
          </div>
        )}

        {/* Claim CTA */}
        {site.listing_status === 'unclaimed' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="font-semibold text-gray-900 mb-2">Is this your location?</p>
            <p className="text-sm text-gray-600 mb-3">
              Claim this listing to add hours, photos, and keep your information up to date.
            </p>
            <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Claim This Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
