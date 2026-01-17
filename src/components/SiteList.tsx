'use client';

import { memo, useEffect, useRef } from 'react';
import { Site } from '@/types/site';
import SiteCard from './SiteCard';
import { useTheme } from '@/contexts/ThemeContext';

interface SiteListProps {
  sites: Site[];
  selectedSiteId?: number | null;
  onSiteSelect?: (site: Site) => void;
  loading?: boolean;
}

function SiteListComponent({
  sites,
  selectedSiteId,
  onSiteSelect,
  loading,
}: SiteListProps) {
  const { isJackpot } = useTheme();
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Scroll selected card into view when selectedSiteId changes
  useEffect(() => {
    if (selectedSiteId && cardRefs.current.has(selectedSiteId)) {
      const element = cardRefs.current.get(selectedSiteId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSiteId]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className={`h-32 rounded-lg ${isJackpot ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${isJackpot ? 'text-gray-500' : 'text-gray-500'}`}>
        <p className="text-lg font-medium">No sites found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 overflow-y-auto">
      <p className={`text-sm mb-2 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
        {sites.length} {sites.length === 1 ? 'location' : 'locations'} found
      </p>
      {sites.map((site) => (
        <div
          key={site.site_id}
          ref={(el) => {
            if (el) {
              cardRefs.current.set(site.site_id, el);
            } else {
              cardRefs.current.delete(site.site_id);
            }
          }}
        >
          <SiteCard
            site={site}
            isSelected={selectedSiteId === site.site_id}
            onClick={() => onSiteSelect?.(site)}
          />
        </div>
      ))}
    </div>
  );
}

const SiteList = memo(SiteListComponent);
export default SiteList;
