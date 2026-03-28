// Structured Data component for SEO
export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Gadi Ghar",
    "description": "Your one-stop destination for all automotive needs. Find, compare, and purchase vehicles with ease in Pakistan.",
    "url": "https://gadi-ghar.vercel.app",
    "logo": "https://gadi-ghar.vercel.app/icon-512x512.png",
    "image": "https://gadi-ghar.vercel.app/screenshot-desktop.png",
    "telephone": "+92 3343149433",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gadi Ghar Office",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "postalCode": "75600",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "24.8607",
      "longitude": "67.0011"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "15:00"
      }
    ],
    "sameAs": [
      "https://facebook.com/gadighar",
      "https://twitter.com/gadighar",
      "https://instagram.com/gadighar",
      "https://linkedin.com/company/gadighar"
    ],
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "serviceType": "Automotive Sales",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Car Inventory",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "New Cars",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Car",
                "name": "Various Car Models"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog", 
          "name": "Used Cars",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Car",
                "name": "Pre-owned Vehicles"
              }
            }
          ]
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gadi Ghar",
    "alternateName": "Gadi Ghar Car Marketplace",
    "url": "https://gadi-ghar.vercel.app",
    "logo": "https://gadi-ghar.vercel.app/icon-512x512.png",
    "description": "Leading car marketplace in Pakistan offering new and used vehicles with comprehensive automotive services.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Hamza"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92 3343149433",
      "contactType": "Customer Service",
      "availableLanguage": ["English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "postalCode": "75600"
    },
    "sameAs": [
      "https://facebook.com/gadighar",
      "https://twitter.com/gadighar",
      "https://instagram.com/gadighar"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteNavigationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": [
      {
        "@type": "SiteNavigationElement",
        "name": "Home",
        "url": "https://gadi-ghar.vercel.app"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Cars",
        "url": "https://gadi-ghar.vercel.app/cars"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "About",
        "url": "https://gadi-ghar.vercel.app/about"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Contact",
        "url": "https://gadi-ghar.vercel.app/contact"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Blogs",
        "url": "https://gadi-ghar.vercel.app/blogs"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Saved Cars",
        "url": "https://gadi-ghar.vercel.app/saved-cars"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
