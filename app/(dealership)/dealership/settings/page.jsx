"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveWorkingHours } from "@/app/actions/settings";
import { updateDealershipInfo, deactivateDealership, getDealershipData } from "@/app/actions/dealership";
import React from "react";
import { useEffect } from "react";

export default function DealershipSettingsPage() {
  // Set document title for client component
  useEffect(() => {
    document.title = "Settings | Dealership | Gadi Ghar";
  }, []);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleInfoSave(formData) {
    try {
      setSaving(true);
      const payload = {
        name: formData.get("name"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        email: formData.get("email"),
      };
      const res = await updateDealershipInfo(payload);
      if (!res?.success) throw new Error(res?.error || "Failed to update info");
      toast.success("Dealership info updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleHoursSave(formData) {
    try {
      setSaving(true);
      const hours = {
        MONDAY: { openTime: formData.get("monOpen"), closeTime: formData.get("monClose"), isOpen: !!formData.get("monOpen") },
        TUESDAY: { openTime: formData.get("tueOpen"), closeTime: formData.get("tueClose"), isOpen: !!formData.get("tueOpen") },
        WEDNESDAY: { openTime: formData.get("wedOpen"), closeTime: formData.get("wedClose"), isOpen: !!formData.get("wedOpen") },
        THURSDAY: { openTime: formData.get("thuOpen"), closeTime: formData.get("thuClose"), isOpen: !!formData.get("thuOpen") },
        FRIDAY: { openTime: formData.get("friOpen"), closeTime: formData.get("friClose"), isOpen: !!formData.get("friOpen") },
        SATURDAY: { openTime: formData.get("satOpen"), closeTime: formData.get("satClose"), isOpen: !!formData.get("satOpen") },
        SUNDAY: { openTime: formData.get("sunOpen"), closeTime: formData.get("sunClose"), isOpen: !!formData.get("sunOpen") },
      };
      const res = await saveWorkingHours(hours);
      if (!res?.success) throw new Error(res?.error || "Failed to save hours");
      toast.success("Working hours saved");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      const dealer = await getDealershipData();
      if (!dealer?.success) throw new Error(dealer?.error || "Unable to load dealership");
      const id = dealer.data.id;
      // Use stronger delete that cascades cars
      const res = await deactivateDealership(id);
      if (!res?.success) throw new Error(res?.error || "Failed to delete dealership");
      toast.success("Dealership and its cars deleted. Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Dealership Info</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleInfoSave} className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your Dealership" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="dealership@email.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="0300-0000000" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="Street, City" />
            </div>
            <div className="sm:col-span-2">
              <Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Info"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleHoursSave} className="grid gap-3 sm:grid-cols-3">
            {[
              ["mon", "Monday"],
              ["tue", "Tuesday"],
              ["wed", "Wednesday"],
              ["thu", "Thursday"],
              ["fri", "Friday"],
              ["sat", "Saturday"],
              ["sun", "Sunday"],
            ].map(([key, label]) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                <div className="flex gap-2">
                  <Input name={`${key}Open`} placeholder="09:00" />
                  <Input name={`${key}Close`} placeholder="18:00" />
                </div>
              </div>
            ))}
            <div className="sm:col-span-3">
              <Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Hours"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Deleting your dealership will remove your public page and delete all cars.</p>
          <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
            {deleting ? "Deleting..." : "Delete Dealership and Cars"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


