import { MetadataRoute } from 'next';

// Static pages
const staticPages = [
  '',
  '/sales',
  '/brands',
  '/categories',
  '/about',
  '/contact',
  '/login',
  '/signup',
];

// Categories
const categories = [
  'clothing',
  'footwear',
  'electronics',
  'accessories',
  'home-living',
  'sports',
];

// Example brands (in production, fetch from database)
const brandSlugs = [
  'khaadi',
  'gul-ahmed',
  'sapphire',
  'alkaram',
  'servis',
  'bata',
  'ndure',
  'outfitters',
  'limelight',
  'bonanza',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://showsales.pk';

  // Static pages
  const staticUrls = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: page === '' ? 1 : 0.8,
  }));

  // Category pages
  const categoryUrls = categories.map(slug => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Brand pages
  const brandUrls = brandSlugs.map(slug => ({
    url: `${baseUrl}/brands/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    ...staticUrls,
    ...categoryUrls,
    ...brandUrls,
  ];
}
