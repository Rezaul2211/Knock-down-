import { SyntheticEvent } from 'react';

// Fallback SVG data URI for any broken image
export const FALLBACK_PRODUCT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="none"><rect width="600" height="800" fill="%23F1F5F9"/><g transform="translate(250, 350)"><rect x="0" y="0" width="100" height="100" rx="20" fill="%23CBD5E1"/><path d="M30 65 L45 45 L60 65 L70 55 L85 75 H15 Z" fill="%2394A3B8"/><circle cx="35" cy="35" r="8" fill="%2394A3B8"/></g><text x="300" y="480" font-family="sans-serif" font-size="18" font-weight="600" fill="%2364748B" text-anchor="middle">ZOPONO TAILOR</text><text x="300" y="510" font-family="sans-serif" font-size="14" fill="%2394A3B8" text-anchor="middle">Premium Garment</text></svg>`;

export function handleImageError(e: SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (target.src !== FALLBACK_PRODUCT_IMAGE) {
    target.src = FALLBACK_PRODUCT_IMAGE;
  }
}
