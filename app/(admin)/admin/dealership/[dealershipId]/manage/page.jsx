"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageSpinner } from "@/components/ui/loading-spinner";
import { getDealershipById } from "@/app/actions/dealership";
import DealershipClientPage from "@/app/(dealership)/dealership/_components/DealershipClientPage";

export default function AdminDealershipManageView() {
  const params = useParams();
  const dealershipId = params.dealershipId;

  const [dealership, setDealership] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDealershipData();
  }, [dealershipId]);

  const fetchDealershipData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dealershipResult = await getDealershipById(dealershipId);

      if (!dealershipResult.success) {
        throw new Error(
          dealershipResult.error || "Failed to fetch dealership data"
        );
      }

      setDealership(dealershipResult.data);
    } catch (error) {
      console.error("Error fetching dealership data:", error);
      setError(error.message);
      toast.error("Failed to load dealership data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PageSpinner text="Loading dealership management..." />;
  }

  if (error || !dealership) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Dealership Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "The dealership you're looking for could not be found."}
            </p>
            <Button asChild>
              <Link href="/admin/dealerships">Back to Dealerships</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/dealerships">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dealerships
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Managing: {dealership.name}
              </h1>
              <p className="text-gray-600">
                Admin view - Managing dealership operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Admin Management View
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/admin/dealership/${dealershipId}/portal`}
                target="_blank"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Portal
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Dealership Management Interface */}
      <div className="p-6">
        <DealershipClientPage dealershipId={dealershipId} isAdminView={true} />
      </div>
    </div>
  );
}
