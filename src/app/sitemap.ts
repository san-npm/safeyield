import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yiield.xyz';
  const lastModified = new Date();

  // Langues supportées
  const languages = ['en', 'fr', 'de', 'es', 'it'];

  // Pages principales
  const routes = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
  ];

  // Ajouter les versions linguistiques (même si c'est la même URL pour l'instant)
  // Cela aide les moteurs de recherche à comprendre la structure multilingue
  languages.forEach((lang) => {
    routes.push({
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: lang === 'en' ? 1 : 0.9,
    });
  });

  return routes;
}
