'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BackButton() {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    // If there's browser history from within the app, go back
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
      e.preventDefault();
      router.back();
    }
    // Otherwise the Link href="/" navigates to the map
  };

  return (
    <Link
      href="/"
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Map
    </Link>
  );
}
