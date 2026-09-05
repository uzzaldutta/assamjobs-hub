import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/admin/*', 
        '/api/', 
        '/search*', 
        '/*?search=*', 
        '/*?filter=*'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
