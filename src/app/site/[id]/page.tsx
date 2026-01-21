import { getSiteById, getSites } from '@/lib/sites';
import { MapPin, Clock, Store, DollarSign, Monitor, Camera, Navigation, Gamepad2, Globe, Phone } from 'lucide-react';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';
import ClaimListingButton from '@/components/ClaimListingButton';
import { TAB_TYPE_LABELS, ETAB_SYSTEM_LABELS, TabType, EtabSystem } from '@/types/site';

interface SitePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const sites = await getSites();
  return sites.slice(0, 100).map((site) => ({
    id: site.site_id.toString(),
  }));
}

export default async function SitePage({ params }: SitePageProps) {
  const { id } = await params;
  const siteId = parseInt(id);

  if (isNaN(siteId)) {
    notFound();
  }

  const site = await getSiteById(siteId);

  if (!site) {
    notFound();
  }

  // Check if site has operator-provided details
  const hasPullTabDetails = site.tab_type || (site.pull_tab_prices && site.pull_tab_prices.length > 0);
  const hasEtabDetails = site.etab_system;
  const hasPhotos = site.photos && site.photos.length > 0;
  const hasHours = site.hours && Object.values(site.hours).some(day => day !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900">{site.site_name}</h1>
          <p className="text-gray-500 text-sm">{site.organization_name}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Address & Directions */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-900">{site.street_address}</p>
                <p className="text-gray-600">{site.city}, {site.state} {site.zip_code}</p>
              </div>
            </div>
            {site.latitude && site.longitude && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Directions
              </a>
            )}
          </div>
        </div>

        {/* Available Games (from GCB data) */}
        {site.gambling_types_inferred && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Available Games</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {site.gambling_types_inferred.split(', ').map((type) => (
                <span
                  key={type}
                  className="inline-flex px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hours (operator-provided) */}
        {hasHours && site.hours && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Hours</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                const hours = site.hours?.[day];
                return (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-500 capitalize">{day.slice(0, 3)}</span>
                    <span className="text-gray-900">
                      {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Type - Seller Type (operator-provided) */}
        {site.tab_type && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Store className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Seller Type</h2>
            </div>
            <span className="inline-flex px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {TAB_TYPE_LABELS[site.tab_type as TabType]}
            </span>
          </div>
        )}

        {/* Pull-Tab Prices (operator-provided) */}
        {site.pull_tab_prices && site.pull_tab_prices.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Pull-Tab Prices</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {site.pull_tab_prices.sort((a, b) => b - a).map((price) => (
                <span
                  key={price}
                  className="inline-flex px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  ${price}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* E-Tab System (operator-provided) */}
        {site.etab_system && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">E-Tabs</h2>
            </div>
            <span className="inline-flex px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {ETAB_SYSTEM_LABELS[site.etab_system as EtabSystem]}
            </span>
          </div>
        )}

        {/* Bar Website & Phone (under E-tabs per Jay/Tim feedback) */}
        {(site.website || site.phone) && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Contact Info</h2>
            </div>
            <div className="space-y-2">
              {site.website && (
                <a
                  href={site.website.startsWith('http') ? site.website : `https://${site.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                >
                  <Globe className="w-4 h-4" />
                  <span className="underline">{site.website}</span>
                </a>
              )}
              {site.phone && (
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                >
                  <Phone className="w-4 h-4" />
                  <span>{site.phone}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Photos (operator-provided) */}
        {hasPhotos && site.photos && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Photos</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {site.photos.map((photo, index) => (
                <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
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

        {/* Empty State - No operator details yet */}
        {!hasPullTabDetails && !hasEtabDetails && !hasPhotos && !hasHours && (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">
              Details like hours, prices, and photos haven't been added yet.
            </p>
            <p className="text-sm text-gray-400">
              Are you the operator? Claim this listing to add information.
            </p>
          </div>
        )}

        {/* Claim Banner */}
        {site.listing_status === 'unclaimed' && (
          <ClaimListingButton siteId={site.site_id} siteName={site.site_name} />
        )}
      </main>
    </div>
  );
}
