"use client";

import { useEffect, useState } from "react";
import { getCars } from "@/app/actions/car-listing";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Info } from "lucide-react";

export default function CarFetchDebug() {
  const [debugInfo, setDebugInfo] = useState({
    loading: false,
    tests: {},
    errors: [],
    timestamp: null
  });

  const runDebugTests = async () => {
    setDebugInfo(prev => ({ ...prev, loading: true, errors: [], timestamp: new Date().toISOString() }));
    
    const tests = {};
    const errors = [];

    try {
      // Test 1: Basic getCars call with minimal parameters
      console.log('[DEBUG] Test 1: Basic getCars call');
      tests.basicCall = { status: 'running' };
      
      const basicResult = await getCars({
        page: 1,
        limit: 2
      });
      
      tests.basicCall = {
        status: 'completed',
        success: basicResult?.success,
        error: basicResult?.error,
        dataLength: basicResult?.data?.length,
        pagination: basicResult?.pagination,
        result: basicResult
      };

      if (!basicResult?.success) {
        errors.push(`Basic getCars failed: ${basicResult?.error || 'Unknown error'}`);
      }

      // Test 2: getCars with search parameters
      console.log('[DEBUG] Test 2: getCars with search');
      tests.searchCall = { status: 'running' };
      
      const searchResult = await getCars({
        search: "Honda",
        page: 1,
        limit: 5
      });
      
      tests.searchCall = {
        status: 'completed',
        success: searchResult?.success,
        error: searchResult?.error,
        dataLength: searchResult?.data?.length,
        pagination: searchResult?.pagination
      };

      // Test 3: Test with all default parameters (simulating what CarListings does)
      console.log('[DEBUG] Test 3: Full parameters like CarListings');
      tests.fullParamsCall = { status: 'running' };
      
      const fullResult = await getCars({
        search: "",
        make: "",
        bodyType: "",
        fuelType: "",
        transmission: "",
        color: "",
        dealershipId: "",
        minPrice: 0,
        maxPrice: Number.MAX_SAFE_INTEGER,
        minYear: 1990,
        maxYear: new Date().getFullYear(),
        minMileage: 0,
        maxMileage: 999999999,
        seats: null,
        featured: null,
        sortBy: "newest",
        page: 1,
        limit: 8
      });
      
      tests.fullParamsCall = {
        status: 'completed',
        success: fullResult?.success,
        error: fullResult?.error,
        dataLength: fullResult?.data?.length,
        pagination: fullResult?.pagination
      };

      if (!fullResult?.success) {
        errors.push(`Full params getCars failed: ${fullResult?.error || 'Unknown error'}`);
      }

      // Test 4: Check if it's a browser vs server issue
      tests.environment = {
        status: 'completed',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side',
        isClient: typeof window !== 'undefined',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('[DEBUG] Test execution error:', error);
      errors.push(`Test execution error: ${error.message}`);
      
      // Mark any incomplete tests as failed
      Object.keys(tests).forEach(testName => {
        if (tests[testName].status === 'running') {
          tests[testName] = {
            status: 'failed',
            error: error.message
          };
        }
      });
    }

    setDebugInfo({
      loading: false,
      tests,
      errors,
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    runDebugTests();
  }, []);

  const getStatusIcon = (test) => {
    if (test.status === 'running') return <Loader2 className="animate-spin h-4 w-4" />;
    if (test.status === 'completed' && test.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (test.status === 'failed' || (test.status === 'completed' && !test.success)) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Car Fetch Debug Tool</h1>
        <Button onClick={runDebugTests} disabled={debugInfo.loading}>
          {debugInfo.loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
          Run Tests
        </Button>
      </div>

      {debugInfo.timestamp && (
        <p className="text-sm text-gray-500">Last run: {debugInfo.timestamp}</p>
      )}

      {debugInfo.errors.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Critical Errors Detected</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2">
              {debugInfo.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {Object.entries(debugInfo.tests).map(([testName, test]) => (
          <div key={testName} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon(test)}
              <h3 className="font-semibold capitalize">{testName.replace(/([A-Z])/g, ' $1')}</h3>
            </div>
            
            <div className="bg-gray-50 p-3 rounded text-sm">
              <pre className="whitespace-pre-wrap overflow-auto">
                {JSON.stringify(test, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting Steps:</h3>
        <ol className="list-decimal list-inside text-blue-800 space-y-1">
          <li>Check if your database is running and accessible</li>
          <li>Verify your DATABASE_URL in .env file</li>
          <li>Check if there are any cars in your database with status 'AVAILABLE'</li>
          <li>Look at the browser console for any JavaScript errors</li>
          <li>Check the Network tab in browser dev tools for failed requests</li>
          <li>Verify that Prisma client is properly initialized</li>
        </ol>
      </div>
    </div>
  );
}
