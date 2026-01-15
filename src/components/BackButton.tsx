'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // Use browser history to go back (preserves URL params)
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Map
    </button>
  );
}
