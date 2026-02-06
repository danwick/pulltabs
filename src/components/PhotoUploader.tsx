'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { Camera, X, Upload, Loader2, AlertCircle, ImagePlus } from 'lucide-react';

interface PhotoUploaderProps {
  siteId: number;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUploader({
  siteId,
  photos,
  onPhotosChange,
  maxPhotos = 5,
}: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Use JPEG, PNG, WebP, or GIF.');
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum size is 20MB.');
      return;
    }

    // Check photo limit
    if (photos.length >= maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed.`);
      return;
    }

    setIsUploading(true);

    try {
      // Upload directly to Vercel Blob (bypasses serverless function body size limit)
      const ext = file.name.split('.').pop() || 'jpg';
      const pathname = `sites/${siteId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const url = blob.url;

      // Add to site photos
      const photosRes = await fetch(`/api/operator/sites/${siteId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!photosRes.ok) {
        const data = await photosRes.json();
        throw new Error(data.error || 'Failed to save photo');
      }

      const { photos: newPhotos } = await photosRes.json();
      onPhotosChange(newPhotos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (url: string) => {
    setDeletingUrl(url);
    setError(null);

    try {
      const res = await fetch(`/api/operator/sites/${siteId}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete photo');
      }

      const { photos: newPhotos } = await res.json();
      onPhotosChange(newPhotos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingUrl(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((url, index) => (
          <div
            key={url}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--theme-surface)] border border-[var(--theme-border)] group"
          >
            <img
              src={url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Delete button */}
            <button
              onClick={() => handleDelete(url)}
              disabled={deletingUrl === url}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all disabled:opacity-50"
              aria-label="Delete photo"
            >
              {deletingUrl === url ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
            {/* Photo number badge */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs font-medium">
              {index + 1}/{maxPhotos}
            </div>
          </div>
        ))}

        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-[4/3] rounded-lg border-2 border-dashed border-[var(--theme-border)] hover:border-[var(--theme-accent)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-[var(--theme-accent)] animate-spin" />
                <span className="text-sm text-[var(--theme-text-muted)]">Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-[var(--theme-text-muted)]" />
                <span className="text-sm text-[var(--theme-text-muted)]">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-[var(--theme-text-muted)]">
        <Camera className="w-3 h-3 inline mr-1" />
        Upload up to {maxPhotos} photos (JPEG, PNG, WebP, GIF). Max 20MB each.
        Tip: Show your pull-tab booth, bar area, and any promotional displays.
      </p>
    </div>
  );
}
