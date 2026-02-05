'use client';

import Image from 'next/image';

export type BrandIconName =
  | 'star'
  | 'sparkle'
  | 'top-hat'
  | 'pull-tab'
  | 'magic-wand'
  | 'map-pin'
  | 'wifi-off';

interface BrandIconProps {
  name: BrandIconName;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export default function BrandIcon({
  name,
  size = 'md',
  className = '',
  alt,
}: BrandIconProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <Image
      src={`/icons/brand/${name}.svg`}
      width={pixelSize}
      height={pixelSize}
      alt={alt || `${name} icon`}
      className={className}
    />
  );
}

// Convenience exports for common icons
export function GoldStar(props: Omit<BrandIconProps, 'name'>) {
  return <BrandIcon name="star" {...props} />;
}

export function MagicSparkle(props: Omit<BrandIconProps, 'name'>) {
  return <BrandIcon name="sparkle" {...props} />;
}

export function TopHat(props: Omit<BrandIconProps, 'name'>) {
  return <BrandIcon name="top-hat" {...props} />;
}

export function PullTabTicket(props: Omit<BrandIconProps, 'name'>) {
  return <BrandIcon name="pull-tab" {...props} />;
}

export function MagicWand(props: Omit<BrandIconProps, 'name'>) {
  return <BrandIcon name="magic-wand" {...props} />;
}

export function MapPin(props: Omit<BrandIconProps, 'name'>) {
  return <BrandIcon name="map-pin" {...props} />;
}

export function WifiOff(props: Omit<BrandIconProps, 'name'>) {
  return <BrandIcon name="wifi-off" {...props} />;
}
