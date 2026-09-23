import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://assamjobshub.com';
  
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
