import { getSiteById, getSites } from '@/lib/sites';
import { MapPin, Phone, Globe, DollarSign, Building, User, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';

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

  const gamblingTypes = site.gambling_types_inferred.split(', ');

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900">{site.site_name}</h1>
          <p className="text-gray-600">{site.organization_name}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Location Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Location
            </h2>
            <address className="not-italic text-gray-700 mb-4">
              {site.street_address}
              <br />
              {site.city}, {site.state} {site.zip_code}
            </address>

            {site.latitude && site.longitude && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>
            )}
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-500" />
              Contact
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span>
                  <strong>Gambling Manager:</strong> {site.gambling_manager}
                </span>
              </div>

              {site.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${site.phone}`} className="text-blue-600 hover:underline">
                    {site.phone}
                  </a>
                </div>
              )}

              {site.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a
                    href={site.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {site.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Gambling Types Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Gambling Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {gamblingTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Financial Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              Financial Info
            </h2>

            {site.fiscal_year ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Fiscal Year: {site.fiscal_year}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Gross Receipts</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(site.gross_receipts)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Receipts</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(site.net_receipts)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Financial data not available</p>
            )}
          </div>

          {/* License Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              License Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="text-gray-900 font-mono">{site.license_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="text-gray-900">{site.organization_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Preview */}
        {site.latitude && site.longitude && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p>
                  {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Claim Banner */}
        {site.listing_status === 'unclaimed' && (
          <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Is this your location?</h3>
            <p className="mb-4 text-blue-100">
              Claim this listing to add photos, hours, and contact information. Stand out to
              customers looking for pull-tab locations near them.
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Claim This Listing
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
