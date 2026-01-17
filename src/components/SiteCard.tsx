'use client';

import { Site, TAB_TYPE_LABELS, ETAB_SYSTEM_LABELS, TabType, EtabSystem } from '@/types/site';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

interface SiteCardProps {
  site: Site;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function SiteCard({ site, isSelected, onClick }: SiteCardProps) {
  const { isJackpot } = useTheme();

  // Check for operator-provided details
  const hasDetails = site.tab_type || site.pull_tab_prices?.length || site.etab_system || site.hours;

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? isJackpot
            ? 'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/20'
            : 'border-blue-500 bg-blue-50 shadow-md'
          : isJackpot
            ? 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:shadow-lg hover:shadow-yellow-500/10'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Name & Status */}
      <div className="flex justify-between items-start mb-1">
        <h3 className={`font-semibold line-clamp-1 ${isJackpot ? 'text-white' : 'text-gray-900'}`}>
          {site.site_name}
        </h3>
        {site.listing_status === 'premium' && (
          <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ml-2 ${
            isJackpot ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
          }`}>
            Premium
          </span>
        )}
      </div>

      {/* Address */}
      <div className={`flex items-start gap-1 text-sm mb-3 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="line-clamp-1">
          {site.street_address}, {site.city}
        </span>
      </div>

      {/* Operator-provided info (if claimed) */}
      {hasDetails && (
        <div className="space-y-2 mb-3">
          {/* Hours preview - just show if open today */}
          {site.hours && (
            <div className={`flex items-center gap-1 text-sm ${isJackpot ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock className={`w-4 h-4 ${isJackpot ? 'text-gray-500' : 'text-gray-400'}`} />
              <span>Hours available</span>
            </div>
          )}

          {/* Tab Type */}
          {site.tab_type && (
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full mr-1 ${
              isJackpot ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
            }`}>
              {TAB_TYPE_LABELS[site.tab_type as TabType]}
            </span>
          )}

          {/* Pull-Tab Prices */}
          {site.pull_tab_prices && site.pull_tab_prices.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {site.pull_tab_prices.sort((a, b) => b - a).map((price) => (
                <span
                  key={price}
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    isJackpot ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                  }`}
                >
                  ${price}
                </span>
              ))}
            </div>
          )}

          {/* E-Tab System */}
          {site.etab_system && (
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
              isJackpot ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
            }`}>
              {ETAB_SYSTEM_LABELS[site.etab_system as EtabSystem]}
            </span>
          )}
        </div>
      )}

      {/* Gambling types from GCB data (show if no operator details) */}
      {!hasDetails && (
        <div className="flex flex-wrap gap-1 mb-3">
          {site.gambling_types_inferred.split(', ').slice(0, 3).map((type) => (
            <span
              key={type}
              className={`px-2 py-0.5 text-xs rounded-full ${
                isJackpot ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {type}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/site/${site.site_id}`}
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center gap-1 text-sm font-medium ${
          isJackpot ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:text-blue-800'
        }`}
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
