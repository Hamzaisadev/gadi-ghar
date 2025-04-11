import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Gadi Ghar",
  description:
    "Your one-stop destination for all automotive needs. Find, compare, and purchase vehicles with ease.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
          <Header />
          <main className="min-h-screen">{children}</main>
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
        </body>
      </html>
    </ClerkProvider>
  );
}
