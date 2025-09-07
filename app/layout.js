import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NavbarServer from "@/components/NavbarServer";
import { ViewTransitions } from "next-view-transitions";
import PageWrapper from "@/components/utils/pageWrapper";
import RouteChangeIndicator from "@/components/utils/RouteChangeIndicator";
import { headers } from "next/headers";
import { WebsiteStructuredData, OrganizationStructuredData, WebsiteNavigationStructuredData } from "@/components/StructuredData";
import InitialSplash from "@/components/ui/InitialSplash";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Gadi Ghar - Car Marketplace in Pakistan",
    template: "%s | Gadi Ghar"
  },
  description: "Your one-stop destination for all automotive needs. Find, compare, and purchase vehicles with ease in Pakistan. Browse cars, bikes, and automotive services.",
  keywords: ["cars", "automobiles", "car marketplace", "Pakistan cars", "buy cars", "sell cars", "car dealership", "automotive", "vehicles", "gadi ghar"],
  authors: [{ name: "Gadi Ghar Team" }],
  creator: "Gadi Ghar",
  publisher: "Gadi Ghar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://gadi-ghar.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Gadi Ghar - Car Marketplace in Pakistan",
    description: "Your one-stop destination for all automotive needs. Find, compare, and purchase vehicles with ease in Pakistan.",
    url: 'https://gadi-ghar.vercel.app',
    siteName: 'Gadi Ghar',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/screenshot-desktop.png',
        width: 1200,
        height: 630,
        alt: 'Gadi Ghar Car Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Gadi Ghar - Car Marketplace in Pakistan",
    description: "Your one-stop destination for all automotive needs. Find, compare, and purchase vehicles with ease in Pakistan.",
    images: ['/screenshot-desktop.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  category: 'automotive',
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider>
      <ViewTransitions>
        <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
            <meta name="theme-color" content="#dc2626" />
            <meta name="background-color" content="#ffffff" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Gadi Ghar" />
            <meta name="application-name" content="Gadi Ghar" />
            <meta name="msapplication-TileColor" content="#dc2626" />
            <meta name="msapplication-config" content="/browserconfig.xml" />
          </head>
          <body className={`${poppins.variable} antialiased`}>
            <RouteChangeIndicator />
            <WebsiteStructuredData />
            <OrganizationStructuredData />
            <WebsiteNavigationStructuredData />
            <InitialSplash />
            <PageWrapper>
              { <NavbarServer />}
              <main className=" min-h-screen">{children}</main>
              <Toaster
                richColors
                expand
                toastOptions={{
                  style: {
                    fontSize: "1.1rem",
                    padding: "16px",
                  },
                }}
              />
              <Footer />
            </PageWrapper>
          </body>
        </html>
      </ViewTransitions>
    </ClerkProvider>
  );
}
