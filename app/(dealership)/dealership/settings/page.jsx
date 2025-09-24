"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteDealership, getDealershipData } from "@/app/actions/dealership";
import React from "react";
import { useEffect } from "react";
import WorkingHoursEditor from "./_components/WorkingHoursEditor";
import DealershipInfoEditor from "./_components/DealershipInfoEditor";

export default function DealershipSettingsPage() {
  // Set document title for client component
  useEffect(() => {
    document.title = "Settings | Dealership | Gadi Ghar";
  }, []);
  const [deleting, setDeleting] = useState(false);
  const [optimisticallyDeleted, setOptimisticallyDeleted] = useState(false);


  async function handleDelete() {
    try {
      setDeleting(true);
      setOptimisticallyDeleted(true); // Immediate UI feedback
      
      const dealer = await getDealershipData();
      if (!dealer?.success) throw new Error(dealer?.error || "Unable to load dealership");
      const id = dealer.data.id;
      
      // Use stronger delete that cascades cars
      const res = await deleteDealership(id);
      if (!res?.success) throw new Error(res?.error || "Failed to delete dealership");
      
      toast.success("Dealership and its cars deleted. Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (e) {
      // Revert optimistic state on error
      setOptimisticallyDeleted(false);
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <DealershipInfoEditor />

      <WorkingHoursEditor />

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {optimisticallyDeleted 
              ? "Dealership deletion in progress. Your account will be reset shortly."
              : "Deleting your dealership will remove your public page and delete all cars."
            }
          </p>
          <Button 
            variant="destructive" 
            disabled={deleting || optimisticallyDeleted} 
            onClick={handleDelete}
            className={optimisticallyDeleted ? 'opacity-50' : ''}
          >
            {optimisticallyDeleted 
              ? "Deletion Confirmed..." 
              : deleting 
                ? "Deleting..." 
                : "Delete Dealership and Cars"
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


