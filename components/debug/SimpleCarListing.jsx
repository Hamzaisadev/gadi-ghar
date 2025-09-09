"use client";

import { useEffect, useState } from "react";
import { getCars } from "@/app/actions/car-listing";
import { Loader2, AlertTriangle } from "lucide-react";

export default function SimpleCarListing() {
  const [state, setState] = useState({
    loading: true,
    cars: [],
    error: null,
    debugInfo: {}
  });

  useEffect(() => {
    const fetchCars = async () => {
      console.log('[SimpleCarListing] Starting fetch...');
      
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const result = await getCars({
          page: 1,
          limit: 10
        });
        
        console.log('[SimpleCarListing] Got result:', result);
        
        setState(prev => ({
          ...prev,
          loading: false,
          cars: result?.data || [],
          error: result?.success === false ? (result.error || 'Unknown error') : null,
          debugInfo: {
            success: result?.success,
            dataLength: result?.data?.length,
            pagination: result?.pagination,
            timestamp: new Date().toISOString()
          }
        }));
        
      } catch (error) {
        console.error('[SimpleCarListing] Fetch error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
          debugInfo: {
            error: error.message,
            timestamp: new Date().toISOString()
          }
        }));
      }
    };

    fetchCars();
  }, []);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          <span>Loading cars...</span>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Cars</h3>
        <p className="text-red-600 mb-4">{state.error}</p>
        <div className="bg-gray-100 p-3 rounded text-sm max-w-md">
          <strong>Debug Info:</strong>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify(state.debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Debug Information</h3>
        <pre className="text-sm text-blue-800">
          {JSON.stringify(state.debugInfo, null, 2)}
        </pre>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Cars Found: {state.cars.length}
        </h2>
        
        {state.cars.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No cars available. Check if there are cars in your database with status 'AVAILABLE'.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.cars.map((car) => (
              <div key={car.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{car.make} {car.model}</h3>
                <p className="text-gray-600">Year: {car.year}</p>
                <p className="text-gray-600">Price: ${car.minPrice} - ${car.maxPrice}</p>
                <p className="text-sm text-gray-500">Status: {car.status}</p>
                <p className="text-sm text-gray-500">ID: {car.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
