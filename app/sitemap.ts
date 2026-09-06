import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gfgsvec-2026.vercel.app';

  const staticPaths = [
    '',
    '/about',
    '/team',
    '/events',
    '/projects',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
    '/clubs/gfg',
    '/clubs/gfg/hiring',
    '/clubs/gfg/hiring/apply',
  ];

  return staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));
}
