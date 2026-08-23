import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/*'],
    },
    sitemap: 'https://y-ruddy-nine-46.vercel.app/sitemap.xml',
  }
}
