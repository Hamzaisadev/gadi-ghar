"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit, 
  Save,
  Clock,
  User,
  Camera,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { getDealershipData, updateDealershipInfo } from "@/app/actions/dealership";
import { formatPriceRange } from "@/components/utils/FormatCurrency";
import Image from "next/image";

export default function DealershipProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const {
    loading: loadingDealership,
    fn: fetchDealership,
    data: dealershipData,
  } = useFetch(getDealershipData);

  const {
    loading: updatingDealership,
    fn: updateDealershipFn,
    data: updateResult,
  } = useFetch(updateDealershipInfo);

  useEffect(() => {
    fetchDealership();
  }, []);

  useEffect(() => {
    if (dealershipData?.success) {
      const dealership = dealershipData.data;
      setEditForm({
        name: dealership.name || "",
        email: dealership.email || "",
        phone: dealership.phone || "",
        address: dealership.address || "",
        description: dealership.description || "",
        website: dealership.website || "",
        facebook: dealership.facebook || "",
        twitter: dealership.twitter || "",
        instagram: dealership.instagram || "",
        whatsapp: dealership.whatsapp || "",
      });
    }
  }, [dealershipData]);

  useEffect(() => {
    if (updateResult?.success) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setLogoPreview(null);
      setLogoFile(null);
      fetchDealership();
    }
  }, [updateResult]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo size should be less than 5MB");
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updateData = { ...editForm };
    if (logoFile) {
      updateData.logo = logoPreview;
    }
    
    await updateDealershipFn(updateData);
  };

  if (loadingDealership) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dealershipData?.success) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            Failed to load dealership profile
          </CardContent>
        </Card>
      </div>
    );
  }

  const dealership = dealershipData.data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dealership Profile</h1>
          <p className="text-gray-600">Manage your dealership information and settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            {dealership.isApproved ? "Approved" : "Pending"}
          </Badge>
          <Button
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dealership.totalCars || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active listings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {(dealership.totalSales || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Since</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dealership.approvedAt ? new Date(dealership.approvedAt).getFullYear() : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Year approved
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Dealership Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={dealership.logo || '/placeholder-dealership.png'}
                    alt={dealership.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{dealership.name}</h3>
                  <p className="text-gray-600">{dealership.description || 'No description available'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{dealership.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{dealership.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{dealership.address}</span>
                </div>
                {dealership.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {dealership.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Business Name</Label>
                  <p className="text-sm text-gray-600">{dealership.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{dealership.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-600">{dealership.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={dealership.isApproved ? "default" : "secondary"}>
                    {dealership.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-gray-600">{dealership.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600">{dealership.description || 'No description provided'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dealership.website && (
                  <div>
                    <Label className="text-sm font-medium">Website</Label>
                    <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:underline">
                      {dealership.website}
                    </a>
                  </div>
                )}
                {dealership.facebook && (
                  <div>
                    <Label className="text-sm font-medium">Facebook</Label>
                    <a href={dealership.facebook} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:underline">
                      {dealership.facebook}
                    </a>
                  </div>
                )}
                {dealership.twitter && (
                  <div>
                    <Label className="text-sm font-medium">Twitter</Label>
                    <a href={dealership.twitter} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:underline">
                      {dealership.twitter}
                    </a>
                  </div>
                )}
                {dealership.instagram && (
                  <div>
                    <Label className="text-sm font-medium">Instagram</Label>
                    <a href={dealership.instagram} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:underline">
                      {dealership.instagram}
                    </a>
                  </div>
                )}
                {dealership.whatsapp && (
                  <div>
                    <Label className="text-sm font-medium">WhatsApp</Label>
                    <span className="block text-sm text-gray-600">{dealership.whatsapp}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Dealership Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="relative">
                    <Image
                      src={logoPreview || dealership.logo || '/placeholder-dealership.png'}
                      alt="Logo preview"
                      width={60}
                      height={60}
                      className="rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload').click()}
                      className="gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Change Logo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editForm.website}
                    onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={editForm.facebook}
                    onChange={(e) => setEditForm({...editForm, facebook: e.target.value})}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={editForm.twitter}
                    onChange={(e) => setEditForm({...editForm, twitter: e.target.value})}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={editForm.instagram}
                    onChange={(e) => setEditForm({...editForm, instagram: e.target.value})}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({...editForm, whatsapp: e.target.value})}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={updatingDealership}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updatingDealership}
                className="gap-2"
              >
                {updatingDealership ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
