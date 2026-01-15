'use client';

import { Site } from '@/types/site';
import { MapPin, Phone, Globe, DollarSign, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SiteCardProps {
  site: Site;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function SiteCard({ site, isSelected, onClick }: SiteCardProps) {
  const gamblingTypes = site.gambling_types_inferred.split(', ');

  const formatCurrency = (amount: number | null) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{site.site_name}</h3>
        {site.listing_status === 'premium' && (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Premium
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-2">{site.organization_name}</p>

      <div className="flex items-start gap-1 text-sm text-gray-500 mb-2">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="line-clamp-2">
          {site.street_address}, {site.city}, {site.state} {site.zip_code}
        </span>
      </div>

      {site.phone && (
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <Phone className="w-4 h-4" />
          <span>{site.phone}</span>
        </div>
      )}

      {site.website && (
        <div className="flex items-center gap-1 text-sm text-blue-600 mb-2">
          <Globe className="w-4 h-4" />
          <a
            href={site.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:underline truncate"
          >
            {site.website.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        {gamblingTypes.map((type) => (
          <span
            key={type}
            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            {type}
          </span>
        ))}
      </div>

      {site.gross_receipts && (
        <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
          <DollarSign className="w-4 h-4" />
          <span>{formatCurrency(site.gross_receipts)} gross ({site.fiscal_year})</span>
        </div>
      )}

      <Link
        href={`/site/${site.site_id}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
