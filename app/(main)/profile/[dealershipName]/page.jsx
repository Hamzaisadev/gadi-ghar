import React from "react";
import { getDealershipByName } from "@/app/actions/dealership";
import NotFoundPage from "@/app/not-found";
import DealershipProfile from "./_components/DealershipProfile";
import { formatWorkingHoursSchema } from "@/lib/timeUtils";

export async function generateMetadata({ params }) {
  const { dealershipName } = await params;
  const result = await getDealershipByName(dealershipName);

  if (!result.success) {
    return {
      title: "Dealership not found",
      description: "Dealership not found",
    };
  }

  const dealership = result.data;
  const description = dealership.description 
    ? `${dealership.description.substring(0, 160)}...`
    : `Visit ${dealership.name} dealership at ${dealership.address}. Browse our inventory of ${dealership._count?.cars || 0} quality vehicles.`;

  return {
    title: `${dealership.name} | Car Dealership | Gadi Ghar`,
    description: description,
    keywords: `${dealership.name}, car dealership, used cars, new cars, ${dealership.address}, auto dealer, vehicle sales`,
    openGraph: {
      title: `${dealership.name} | Car Dealership`,
      description: description,
      type: "website",
      images: dealership.logo ? [{
        url: dealership.logo,
        width: 1200,
        height: 630,
        alt: `${dealership.name} logo`,
      }] : [{
        url: "/screenshot-desktop.png",
        width: 1200,
        height: 630,
        alt: "Gadi Ghar",
      }],
      siteName: "Gadi Ghar",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dealership.name} | Car Dealership`,
      description: description,
      images: dealership.logo ? [dealership.logo] : ["/screenshot-desktop.png"],
    },
    alternates: {
      canonical: `/profile/${dealershipName}`,
    },
  };
}

const DealershipPublicPage = async ({ params }) => {
  const { dealershipName } = await params;
  const result = await getDealershipByName(dealershipName);

  if (!result.success) {
    return <NotFoundPage />;
  }

  const dealership = result.data;
  
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": dealership.name,
    "description": dealership.description || `Visit ${dealership.name} for quality vehicles`,
    "url": `${process.env.NEXT_PUBLIC_APP_URL || 'https://gadighar.com'}/profile/${dealershipName}`,
    "logo": dealership.logo,
    "image": dealership.logo,
    "telephone": dealership.phone,
    "email": dealership.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": dealership.address,
      "addressLocality": "Karachi",
      "addressCountry": "Pakistan"
    },
    "openingHours": dealership.workingHours?.map(wh => 
      formatWorkingHoursSchema(wh)
    ).filter(Boolean),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "150"
    },
    "makesOffer": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Vehicle",
        "name": "Quality Used and New Vehicles"
      }
    }
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DealershipProfile dealership={dealership} />
    </div>
  );
};

export default DealershipPublicPage;
