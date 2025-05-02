import { MetadataRoute } from 'next';

// Proper typing for changeFrequency
type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'hourly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  // Current date in ISO format for lastModified
  const currentDate = new Date().toISOString();

  // Main pages
  const mainPages = [
    {
      url: 'https://montessorifind.com/',
      lastModified: currentDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: 'https://montessorifind.com/about',
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: 'https://montessorifind.com/faq',
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: 'https://montessorifind.com/blog',
      lastModified: currentDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: 'https://montessorifind.com/browse',
      lastModified: currentDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
  ];

  // Blog posts 
  const blogPosts = [
    'montessori-education-explained',
    'montessori-method-demystified',
    '10-benefits-of-montessori-education-for-early-learners',
    '7-key-signs-of-an-authentic-montessori-classroom',
    '5-questions-to-ask-during-a-montessori-school-tour',
    'common-montessori-terms-every-parent-should-know',
    'how-to-choose-the-right-montessori-school-a-parent-s-guide',
    'montessori-vs-traditional-education-key-differences',
    'private-vs-public-montessori-schools-making-the-choice',
    'understanding-montessori-age-groups-and-classroom-levels',
    'solving-common-montessori-transition-challenges',
  ].map(slug => ({
    url: `https://montessorifind.com/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.7,
  }));

  // States pages
  const states = ['ca', 'ny', 'tx', 'fl'].map(state => ({
    url: `https://montessorifind.com/states/${state}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }));

  // Cities pages
  const cities = [
    { state: 'ca', city: 'los-angeles' },
    { state: 'ny', city: 'new-york-city' },
    { state: 'tx', city: 'houston' },
    { state: 'fl', city: 'miami' },
  ].map(({ state, city }) => ({
    url: `https://montessorifind.com/states/${state}/${city}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.6,
  }));

  // Legal pages
  const legalPages = [
    {
      url: 'https://montessorifind.com/privacy',
      lastModified: currentDate,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.4,
    },
    {
      url: 'https://montessorifind.com/terms',
      lastModified: currentDate,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.4,
    },
    {
      url: 'https://montessorifind.com/cookies',
      lastModified: currentDate,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.4,
    },
    {
      url: 'https://montessorifind.com/contact',
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.5,
    },
  ];

  return [
    ...mainPages,
    ...blogPosts,
    ...states,
    ...cities,
    ...legalPages,
  ];
} 