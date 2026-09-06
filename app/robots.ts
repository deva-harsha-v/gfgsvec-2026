import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/storage/'],
    },
    sitemap: 'https://gfgsvec-2026.vercel.app/sitemap.xml',
  };
}
