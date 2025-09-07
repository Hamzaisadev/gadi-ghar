export default function sitemap() {
  const baseUrl = 'https://gadi-ghar.vercel.app'
  
  // Static routes - only including existing pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/saved-cars`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dealership-signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/waitlist`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // TODO: Add dynamic routes for cars, blog posts, etc.
  // You can fetch dynamic data here and add more URLs
  // Example:
  // const cars = await fetch('your-api-endpoint').then(res => res.json())
  // const carRoutes = cars.map(car => ({
  //   url: `${baseUrl}/cars/${car.slug}`,
  //   lastModified: new Date(car.updatedAt),
  //   changeFrequency: 'weekly',
  //   priority: 0.8,
  // }))

  return [
    ...staticRoutes,
    // ...carRoutes, // Uncomment when you have dynamic car data
  ]
}
