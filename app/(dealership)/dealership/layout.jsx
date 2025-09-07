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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-car-red" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Dealership Admin
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Welcome, {dealership.name}
              </span>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen hidden lg:block">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <Link href="/dealership">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                >
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5" />
                    <span>Overview</span>
                  </div>
                </Button>
              </Link>

              <Link href="/dealership/cars">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                >
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5" />
                    <span>Manage Cars</span>
                  </div>
                </Button>
              </Link>

              <Link href="/dealership/team">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5" />
                    <span>Team Members</span>
                  </div>
                </Button>
              </Link>

              <Link href="/dealership/settings">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </div>
                </Button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full lg:w-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
