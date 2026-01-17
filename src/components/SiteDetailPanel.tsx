'use client';

import { Site, TAB_TYPE_LABELS, ETAB_SYSTEM_LABELS, TabType, EtabSystem } from '@/types/site';
import { X, MapPin, Navigation } from 'lucide-react';

interface SiteDetailPanelProps {
  site: Site | null;
  onClose: () => void;
}

export default function SiteDetailPanel({ site, onClose }: SiteDetailPanelProps) {
  if (!site) return null;

  const hasPhotos = site.photos && site.photos.length > 0;

  return (
    <div className="bg-white">
      {/* Header: Bar Name, Address, Close Button */}
      <div className="flex items-start justify-between p-4 border-b">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900">{site.site_name}</h2>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{site.street_address}, {site.city}</span>
          </div>
          {site.latitude && site.longitude && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Content: Vertical list matching wireframe */}
      <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto">

        {/* 1) Tab Type: Booth / Bar / Machine */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">1) Type</p>
          <div className="flex gap-2">
            {['booth', 'behind_bar', 'machine'].map((type) => (
              <span
                key={type}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  site.tab_type === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {TAB_TYPE_LABELS[type as TabType]}
              </span>
            ))}
          </div>
        </div>

        {/* 2) Pull-Tabs: $5, $4, $3, $2, $1 */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">2) Pull-Tabs</p>
          <div className="flex gap-2">
            {[5, 4, 3, 2, 1].map((price) => (
              <span
                key={price}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  site.pull_tab_prices?.includes(price as any)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                ${price}
              </span>
            ))}
          </div>
        </div>

        {/* 3) E-Tabs: Pilot / 3 Diamonds */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">3) E-Tabs</p>
          <div className="flex gap-2">
            {['pilot', '3_diamonds'].map((system) => (
              <span
                key={system}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  site.etab_system === system
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {ETAB_SYSTEM_LABELS[system as EtabSystem]}
              </span>
            ))}
          </div>
        </div>

        {/* 3) Photos */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Photos</p>
          {hasPhotos && site.photos ? (
            <div className="flex gap-2 overflow-x-auto">
              {site.photos.map((photo, index) => (
                <div key={index} className="w-32 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              No photos yet
            </div>
          )}
        </div>

        {/* 4) Is this your location? + Claim */}
        {site.listing_status === 'unclaimed' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">4) Is this your location?</p>
            <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              CLAIM
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
