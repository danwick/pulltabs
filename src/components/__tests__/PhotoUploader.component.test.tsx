import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock vercel blob client
vi.mock('@vercel/blob/client', () => ({
  upload: vi.fn(),
}));

// Mock heic2any
vi.mock('heic2any', () => ({
  default: vi.fn(),
}));

// Must import after mocks
const { default: PhotoUploader } = await import('../PhotoUploader');

describe('PhotoUploader', () => {
  const defaultProps = {
    siteId: 1,
    photos: [],
    onPhotosChange: vi.fn(),
  };

  it('shows Add Photo button when under limit', () => {
    render(<PhotoUploader {...defaultProps} />);
    expect(screen.getByText('Add Photo')).toBeInTheDocument();
  });

  it('hides Add Photo button when at photo limit', () => {
    const photos = [
      'https://example.com/1.jpg',
      'https://example.com/2.jpg',
      'https://example.com/3.jpg',
      'https://example.com/4.jpg',
      'https://example.com/5.jpg',
    ];
    render(<PhotoUploader {...defaultProps} photos={photos} maxPhotos={5} />);
    expect(screen.queryByText('Add Photo')).not.toBeInTheDocument();
  });

  it('renders existing photos', () => {
    const photos = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];
    render(<PhotoUploader {...defaultProps} photos={photos} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/photo1.jpg');
  });

  it('shows photo count badges', () => {
    const photos = ['https://example.com/photo1.jpg'];
    render(<PhotoUploader {...defaultProps} photos={photos} maxPhotos={5} />);
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });

  it('has delete button for each photo', () => {
    const photos = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];
    render(<PhotoUploader {...defaultProps} photos={photos} />);
    const deleteButtons = screen.getAllByLabelText('Delete photo');
    expect(deleteButtons).toHaveLength(2);
  });

  it('accepts HEIC in file input', () => {
    render(<PhotoUploader {...defaultProps} />);
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
    const accept = input?.getAttribute('accept') || '';
    expect(accept).toContain('image/heic');
    expect(accept).toContain('.heic');
  });

  it('shows help text with supported formats', () => {
    render(<PhotoUploader {...defaultProps} />);
    expect(screen.getByText(/JPEG, PNG, WebP, GIF, HEIC/)).toBeInTheDocument();
  });

  it('respects custom maxPhotos prop', () => {
    const photos = ['https://example.com/1.jpg', 'https://example.com/2.jpg'];
    render(<PhotoUploader {...defaultProps} photos={photos} maxPhotos={3} />);
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByText('2/3')).toBeInTheDocument();
    // Should still show Add Photo (2 < 3)
    expect(screen.getByText('Add Photo')).toBeInTheDocument();
  });
});
