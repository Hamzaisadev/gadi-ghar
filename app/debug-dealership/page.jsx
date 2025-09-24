"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDealershipData, checkDealershipAuthorization } from "@/app/actions/dealership";
import { toast } from "sonner";

export default function DebugDealershipPage() {
  const [result, setResult] = useState(null);
  const [authResult, setAuthResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testGetDealershipData = async () => {
    setLoading(true);
    console.log("🔧 Debug: Testing getDealershipData...");
    
    try {
      const response = await getDealershipData();
      console.log("🔧 Debug: getDealershipData response:", response);
      setResult(response);
      
      if (response.success) {
        toast.success("Successfully loaded dealership data!");
      } else {
        toast.error(`Failed: ${response.error}`);
      }
    } catch (error) {
      console.error("🔧 Debug: Error calling getDealershipData:", error);
      setResult({ success: false, error: error.message });
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCheckDealershipAuth = async () => {
    setLoading(true);
    console.log("🔧 Debug: Testing checkDealershipAuthorization...");
    
    try {
      const response = await checkDealershipAuthorization();
      console.log("🔧 Debug: checkDealershipAuthorization response:", response);
      setAuthResult(response);
      
      if (response.success) {
        toast.success("Authorization check successful!");
      } else {
        toast.error(`Auth failed: ${response.error}`);
      }
    } catch (error) {
      console.error("🔧 Debug: Error calling checkDealershipAuthorization:", error);
      setAuthResult({ success: false, error: error.message });
      toast.error(`Auth Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Dealership Data Loading</h1>
      
      <div className="space-y-4">
        <Button 
          onClick={testGetDealershipData} 
          disabled={loading}
          className="mr-4"
        >
          {loading ? "Loading..." : "Test getDealershipData"}
        </Button>
        
        <Button 
          onClick={testCheckDealershipAuth} 
          disabled={loading}
          variant="outline"
        >
          {loading ? "Loading..." : "Test Authorization Check"}
        </Button>
      </div>

      {authResult && (
        <Card>
          <CardHeader>
            <CardTitle>Authorization Check Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(authResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>getDealershipData Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
