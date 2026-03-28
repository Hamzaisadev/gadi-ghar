export const dynamic = "force-dynamic";

import { checkDealershipAuthorization, getDealership } from "@/app/actions/dealership";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, 
  Building2, 
  Users, 
  Settings, 
  LogOut,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import WelcomeModal from "@/components/ui/welcome-modal";
import PageWrapper from "@/components/utils/pageWrapper";
import DealershipSidebar from "./_components/Sidebar";
import ErrorBoundary from "./_components/ErrorBoundary";

export const metadata = {
  title: "Dealership | Gadi Ghar",
  description: "Dealership dashboard for managing cars and test drives",
};

export default async function DealershipLayout({ children }) {
  try {
    const result = await checkDealershipAuthorization();
    
    if (!result.success) {
      console.error('Dealership authorization failed:', result.error);
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                {result.error || "You don't have permission to access the dealership admin panel."}
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const { role, dealership } = result.data;
    
    // Allow both DEALERSHIP_ADMIN and ADMIN roles to access
    if ((role !== 'DEALERSHIP_ADMIN' && role !== 'ADMIN') || !dealership?.isApproved) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {!dealership?.isApproved 
                  ? "Application Under Review" 
                  : "Access Restricted"}
              </h2>
              <p className="text-gray-600 mb-6">
                {!dealership?.isApproved
                  ? "Your dealership application is being reviewed by our team. We'll notify you once it's approved."
                  : "You need dealership admin privileges to access this section."}
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/">Return to Home</Link>
                </Button>
                {!dealership?.isApproved && (
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <PageWrapper>
        <ErrorBoundary>
          <div className="min-h-screen bg-background pt-20">
            <div className="flex h-full">
              <DealershipSidebar />
              <main className="flex-1 w-full md:pl-0 pb-20 md:pb-0 animate-fade-in">
                {children}
              </main>
            </div>
          </div>
        </ErrorBoundary>
      </PageWrapper>
    );
  } catch (error) {
    console.error('Error in DealershipLayout:', error);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
            <p className="text-gray-600 mb-4">
              We&apos;re having trouble loading the dealership dashboard. Please try again later.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
