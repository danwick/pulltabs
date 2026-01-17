'use client';

import { useEffect, useCallback } from 'react';
import { Site, TAB_TYPE_LABELS, ETAB_SYSTEM_LABELS, TabType, EtabSystem } from '@/types/site';
import { X, MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

interface SiteDetailModalProps {
  site: Site | null;
  onClose: () => void;
}

export default function SiteDetailModal({ site, onClose }: SiteDetailModalProps) {
  const { isJackpot } = useTheme();

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
        className={`fixed inset-0 z-40 md:bg-transparent md:pointer-events-none ${
          isJackpot ? 'bg-black/50' : 'bg-black/30'
        }`}
        onClick={handleClose}
      />

      {/* Mobile: Bottom Sheet */}
      <div className={`md:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden animate-slideUp ${
        isJackpot ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Drag handle */}
        <div className="flex justify-center py-2">
          <div className={`w-12 h-1.5 rounded-full ${isJackpot ? 'bg-gray-700' : 'bg-gray-300'}`} />
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-40px)]">
          <SiteDetailContent site={site} onClose={handleClose} hasPhotos={hasPhotos} isJackpot={isJackpot} />
        </div>
      </div>

      {/* Desktop: Right Panel */}
      <div className={`hidden md:block fixed top-0 right-0 h-full w-[450px] z-50 shadow-2xl overflow-hidden animate-slideInRight ${
        isJackpot ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="h-full overflow-y-auto">
          <SiteDetailContent site={site} onClose={handleClose} hasPhotos={hasPhotos} showCloseButton isJackpot={isJackpot} />
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
  isJackpot?: boolean;
}

function SiteDetailContent({ site, onClose, hasPhotos, showCloseButton, isJackpot = false }: SiteDetailContentProps) {
  return (
    <div className="pb-8">
      {/* Header */}
      <div className={`sticky top-0 border-b px-4 py-4 z-10 ${
        isJackpot ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className={`text-xl font-bold ${isJackpot ? 'text-white' : 'text-gray-900'}`}>
              {site.site_name}
            </h2>
            <div className={`flex items-center gap-2 mt-1 text-sm ${isJackpot ? 'text-gray-400' : 'text-gray-600'}`}>
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{site.street_address}, {site.city}</span>
            </div>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
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
          {site.latitude && site.longitude && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                isJackpot
                  ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>
          )}
          <Link
            href={`/site/${site.site_id}`}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${
              isJackpot
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
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

        {/* Operator-Provided Details (only show if site has any) */}
        {(site.tab_type || site.pull_tab_prices?.length || site.etab_system) && (
          <>
            {/* Tab Type: Booth / Bar / Machine */}
            {site.tab_type && (
              <div>
                <h3 className={`text-sm font-semibold mb-2 ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
                  Where to Buy
                </h3>
                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isJackpot ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500 text-white'
                }`}>
                  {TAB_TYPE_LABELS[site.tab_type as TabType]}
                </span>
              </div>
            )}

            {/* Pull-Tab Prices */}
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

            {/* E-Tabs */}
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

        {/* Photos */}
        <div>
          <h3 className={`text-sm font-semibold mb-2 ${isJackpot ? 'text-gray-300' : 'text-gray-700'}`}>
            Photos
          </h3>
          {hasPhotos && site.photos ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {site.photos.map((photo, index) => (
                <div key={index} className={`w-40 h-32 flex-shrink-0 rounded-lg overflow-hidden ${
                  isJackpot ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`w-full h-32 rounded-lg flex items-center justify-center text-sm ${
              isJackpot ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
            }`}>
              No photos yet
            </div>
          )}
        </div>

        {/* Organization Info */}
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
