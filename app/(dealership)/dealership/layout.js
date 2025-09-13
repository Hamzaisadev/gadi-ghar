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
  const result = await checkDealershipAuthorization();
  
  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              {result.error || "You don't have access to the dealership admin panel."}
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
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
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              {!dealership?.isApproved
                ? "Your dealership application is still under review."
                : "Dealership admin role required."}
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PageWrapper>
      <ErrorBoundary>
        <div className="min-h-screen bg-background pt-20">
          <div className="flex">
            <DealershipSidebar />
            <main className="flex-1 md:ml-0 pb-20 md:pb-0 animate-fade-in">
              <div className="p-6 md:p-8">{children}</div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </PageWrapper>
  );
}
