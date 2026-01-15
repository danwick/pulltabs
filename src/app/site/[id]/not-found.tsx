import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Site Not Found</h1>
        <p className="text-gray-600 mb-6">
          The gambling site you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>
      </div>
    </div>
  );
}
