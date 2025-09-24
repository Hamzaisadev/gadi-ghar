"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDealershipByName } from "@/app/actions/dealership";
import { getCarsByDealership } from "@/app/actions/cars";

import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import DealershipClientPage from "../_components/DealershipClientPage";

export default function DealershipPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, userId, user } = useAuth();
  const authLoading = !isLoaded;
  const [dealership, setDealership] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dealershipData, carsData] = await Promise.all([
          getDealershipByName(params.dealershipPage),
          getCarsByDealership(params.dealershipPage)
        ]);
        
        if (!dealershipData) {
          throw new Error("Dealership not found");
        }

        setDealership(dealershipData);
        setCars(carsData || []);
      } catch (err) {
        console.error("Error fetching dealership data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.dealershipPage) {
      fetchData();
    }
  }, [params.dealershipPage]);

  if (authLoading || loading || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!dealership) {
    return (
      <div className="container mx-auto p-4">
        <p>Dealership not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DealershipClientPage
        initialDealership={dealership}
        initialCars={cars}
        dealershipId={dealership.id}
        isAdminView={user?.publicMetadata?.role === 'admin'}
      />
    </div>
  );
}
