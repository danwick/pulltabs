'use client';

import { Site, TAB_TYPE_LABELS, ETAB_SYSTEM_LABELS, TabType, EtabSystem } from '@/types/site';
import { X, MapPin, Clock, Store, DollarSign, Monitor, Camera, Navigation } from 'lucide-react';

interface SiteDetailPanelProps {
  site: Site | null;
  onClose: () => void;
}

export default function SiteDetailPanel({ site, onClose }: SiteDetailPanelProps) {
  if (!site) return null;

  const hasHours = site.hours && Object.values(site.hours).some(day => day !== null);
  const hasPhotos = site.photos && site.photos.length > 0;

  return (
    <div className="bg-white shadow-lg border-b">
      {/* Header with close button */}
      <div className="flex items-start justify-between p-4 border-b">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{site.site_name}</h2>
          <p className="text-sm text-gray-500 truncate">{site.organization_name}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Address & Directions */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{site.street_address}</p>
              <p className="text-sm text-gray-600">{site.city}, {site.state} {site.zip_code}</p>
              {site.latitude && site.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </a>
              )}
            </div>
          </div>

          {/* Hours */}
          {hasHours && site.hours ? (
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Hours</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                  {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                    const hours = site.hours?.[day];
                    return (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{day.slice(0, 3)}</span>
                        <span className="text-gray-900">
                          {hours ? `${hours.open}-${hours.close}` : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Hours not available</p>
              </div>
            </div>
          )}

          {/* Tab Type, Prices, E-Tabs - combined section */}
          <div className="space-y-3">
            {/* Tab Type */}
            <div className="flex items-start gap-3">
              <Store className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Where to Buy</p>
                {site.tab_type ? (
                  <span className="inline-flex px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {TAB_TYPE_LABELS[site.tab_type as TabType]}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Not specified</span>
                )}
              </div>
            </div>

            {/* Pull-Tab Prices */}
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Pull-Tab Prices</p>
                {site.pull_tab_prices && site.pull_tab_prices.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {site.pull_tab_prices.sort((a, b) => b - a).map((price) => (
                      <span
                        key={price}
                        className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        ${price}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Not specified</span>
                )}
              </div>
            </div>

            {/* E-Tab System */}
            <div className="flex items-start gap-3">
              <Monitor className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">E-Tabs</p>
                {site.etab_system ? (
                  <span className="inline-flex px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {ETAB_SYSTEM_LABELS[site.etab_system as EtabSystem]}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Not specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Photos */}
          {hasPhotos && site.photos && (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">Photos</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {site.photos.map((photo, index) => (
                  <div key={index} className="w-32 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`${site.site_name} photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Claim Banner */}
        {site.listing_status === 'unclaimed' && (
          <div className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Is this your location?</h3>
                <p className="text-sm text-blue-100">Add hours, photos, and more.</p>
              </div>
              <button className="flex-shrink-0 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Claim Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
