"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, Building2, Users, DollarSign, Plus, Edit, Trash2, Eye, AlertCircle, User, Settings } from "lucide-react";
import { toast } from "sonner";
import { updateDealershipInfo, addCarToDealership, deleteCarFromDealership } from "@/app/actions/dealership";

export default function DealershipClientPage({ initialDealership, initialCars }) {
  const [dealership, setDealership] = useState(initialDealership);
  const [cars, setCars] = useState(initialCars);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(initialDealership);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    minPrice: "",
    maxPrice: "",
    mileage: "",
    color: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    seats: "",
    description: "",
    images: []
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateDealershipInfo(editForm);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update dealership information');
      }

      // Update local state with the updated data
      setDealership(prev => ({ ...prev, ...result.data }));
      setIsEditing(false);
      toast.success("Dealership information updated successfully");
    } catch (error) {
      console.error('Error updating dealership:', error);
      toast.error(error.message || "Failed to update dealership information");
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const result = await addCarToDealership(newCar);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to add car');
      }

      // Add the new car to the list
      setCars([...cars, result.data]);
      setShowAddCar(false);
      setNewCar({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        minPrice: "",
        maxPrice: "",
        mileage: "",
        color: "",
        fuelType: "",
        transmission: "",
        bodyType: "",
        seats: "",
        description: "",
        images: []
      });
      toast.success("Car added successfully");
    } catch (error) {
      console.error('Error adding car:', error);
      toast.error(error.message || "Failed to add car");
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      const result = await deleteCarFromDealership(carId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete car');
      }

      // Remove the car from the list
      setCars(cars.filter(car => car.id !== carId));
      toast.success("Car deleted successfully");
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error(error.message || "Failed to delete car");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dealership Dashboard</h1>
          <p className="text-gray-600">Manage your dealership and inventory</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            Active
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealership.totalCars}</div>
            <p className="text-xs text-muted-foreground">
              Available in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {dealership.totalSales?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Revenue this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealership.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cars">Manage Cars</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dealership Information</CardTitle>
              <CardDescription>
                Your dealership details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Dealership Name</Label>
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
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-gray-600">{dealership.address}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cars" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Cars</h2>
            <Button onClick={() => setShowAddCar(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Car
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <Card key={car.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{car.make} {car.model}</CardTitle>
                  <CardDescription>{car.year} • {car.mileage}km</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Rs. {car.minPrice ? parseFloat(car.minPrice).toLocaleString() : '0'} - {car.maxPrice ? parseFloat(car.maxPrice).toLocaleString() : '0'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {car.color} • {car.fuelType} • {car.transmission}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteCar(car.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dealership Settings</CardTitle>
              <CardDescription>
                Manage your dealership settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Settings functionality will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dealership Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Dealership Information</DialogTitle>
            <DialogDescription>
              Update your dealership details and contact information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Dealership Name</Label>
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
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Car Dialog */}
      <Dialog open={showAddCar} onOpenChange={setShowAddCar}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Car</DialogTitle>
            <DialogDescription>
              Add a new car to your dealership inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={newCar.make}
                  onChange={(e) => setNewCar({...newCar, make: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newCar.model}
                  onChange={(e) => setNewCar({...newCar, model: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newCar.year}
                  onChange={(e) => setNewCar({...newCar, year: parseInt(e.target.value)})}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={newCar.mileage}
                  onChange={(e) => setNewCar({...newCar, mileage: parseInt(e.target.value)})}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="minPrice">Min Price</Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={newCar.minPrice}
                  onChange={(e) => setNewCar({...newCar, minPrice: parseFloat(e.target.value)})}
                  min="0"
                  step="1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={newCar.maxPrice}
                  onChange={(e) => setNewCar({...newCar, maxPrice: parseFloat(e.target.value)})}
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={newCar.color}
                  onChange={(e) => setNewCar({...newCar, color: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select 
                  value={newCar.fuelType} 
                  onValueChange={(value) => setNewCar({...newCar, fuelType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select 
                  value={newCar.transmission} 
                  onValueChange={(value) => setNewCar({...newCar, transmission: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bodyType">Body Type</Label>
                <Select 
                  value={newCar.bodyType} 
                  onValueChange={(value) => setNewCar({...newCar, bodyType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Convertible">Convertible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCar.description}
                onChange={(e) => setNewCar({...newCar, description: e.target.value})}
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddCar(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Car
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
