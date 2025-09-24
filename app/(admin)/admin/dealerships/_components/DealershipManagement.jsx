"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  User, 
  Phone,
  Mail,
  MapPin, 
  FileText, 
  Eye, 
  Search,
  Filter,
  Users,
  CheckSquare,
  XSquare,
  Car,
  Calendar,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { PageSpinner } from "@/components/ui/loading-spinner";
import { reviewDealershipApplication, getDealershipApplications, getApprovedDealerships, deleteDealership } from "@/app/actions/dealership";

export default function DealershipManagement() {
  const [applications, setApplications] = useState([]);
  const [approvedDealerships, setApprovedDealerships] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingDealership, setDeletingDealership] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    status: "",
    reviewNotes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [filteredApprovedDealerships, setFilteredApprovedDealerships] = useState([]);
  // Track optimistically deleting dealership IDs
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  useEffect(() => {
    filterApprovedDealerships();
  }, [approvedDealerships, searchTerm]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch applications and approved dealerships separately
      const [applicationsResult, dealershipsResult] = await Promise.all([
        getDealershipApplications(),
        getApprovedDealerships()
      ]);
      
      if (!applicationsResult.success) {
        throw new Error(applicationsResult.error || 'Failed to fetch applications');
      }

      if (!dealershipsResult.success) {
        throw new Error(dealershipsResult.error || 'Failed to fetch approved dealerships');
      }

      // Filter out approved applications since we get them from dealerships
      const pendingApps = applicationsResult.data.filter(app => app.status !== 'APPROVED');
      
      setApplications(pendingApps);
      setApprovedDealerships(dealershipsResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.dealershipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const filterApprovedDealerships = () => {
    let filtered = approvedDealerships;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(dealership => 
        dealership.dealershipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealership.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealership.businessEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealership.businessLicense.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApprovedDealerships(filtered);
  };

  const handleReview = (application) => {
    setSelectedApplication(application);
    setReviewForm({
      status: application.status === "PENDING" ? "UNDER_REVIEW" : application.status,
      reviewNotes: ""
    });
    setShowReviewDialog(true);
  };

  const handleDeleteDealership = async (dealershipId) => {
    const dealership = approvedDealerships.find(d => d.id === dealershipId);
    if (dealership) {
      setDeletingDealership(dealership);
      setShowDeleteDialog(true);
    }
  };

  const confirmDeletion = async () => {
    if (!deletingDealership) return;

    const deletingId = deletingDealership.id;
    // Close dialog immediately for snappy UX
    setShowDeleteDialog(false);

    // Snapshot current state for potential rollback
    const prevApproved = approvedDealerships;

    // Optimistically remove from UI and mark as deleting
    setApprovedDealerships((prev) => prev.filter((d) => d.id !== deletingId));
    setFilteredApprovedDealerships((prev) => prev.filter((d) => d.id !== deletingId));
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(deletingId);
      return next;
    });

    try {
      const result = await deleteDealership(deletingId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete dealership');
      }

      toast.success("Dealership deleted successfully");
      setDeletingDealership(null);

      // Optionally re-sync in background
      fetchData();
    } catch (error) {
      console.error('Error deleting dealership:', error);
      // Roll back optimistic update
      setApprovedDealerships(prevApproved);
      setFilteredApprovedDealerships(prevApproved);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingId);
        return next;
      });
      toast.error(error.message || "Failed to delete dealership");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    setIsSubmittingReview(true);
    
    try {
      // Check if this is an application or an approved dealership
      if (selectedApplication.status) {
        // This is an application - use review function
        const result = await reviewDealershipApplication(selectedApplication.id, reviewForm);

        if (!result.success) {
          throw new Error(result.error || 'Failed to submit review');
        }
      } else {
        // This is an approved dealership - just show success
        toast.success("Dealership details viewed successfully");
      }

      // Refresh data to get updated information
      await fetchData();
      
      setShowReviewDialog(false);
      setSelectedApplication(null);
      
      toast.success("Application review submitted successfully");
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "secondary",
      UNDER_REVIEW: "default",
      APPROVED: "default",
      REJECTED: "destructive",
      REQUIRES_CHANGES: "outline"
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getBusinessTypeLabel = (type) => {
    const labels = {
      INDIVIDUAL: "Individual",
      PARTNERSHIP: "Partnership",
      CORPORATION: "Corporation",
      FRANCHISE: "Franchise"
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return <PageSpinner text="Loading dealership data..." />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications">Pending Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved Dealerships ({approvedDealerships.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by dealership name, owner, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="REQUIRES_CHANGES">Requires Changes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
        <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {searchTerm || statusFilter !== "ALL" 
                      ? "Try adjusting your search or filters"
                      : "There are no pending dealership applications at the moment"
                    }
                  </p>
          </CardContent>
        </Card>
            ) : (
              filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              {application.dealershipName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              License: {application.businessLicense}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            {getStatusBadge(application.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReview(application)}
                              className="w-full sm:w-auto"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Owner:</span>
                            <span className="font-medium">{application.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Experience:</span>
                            <span className="font-medium">{application.yearsInBusiness} years</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{application.businessPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{application.businessEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{application.businessAddress}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {application.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          {/* Filters and Search for Approved Dealerships */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search approved dealerships..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                        </div>
                      </div>
                    </div>
            </CardContent>
          </Card>

          {/* Approved Dealerships List */}
          <div className="space-y-4">
            {filteredApprovedDealerships.length === 0 ? (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No approved dealerships</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Approved dealerships will appear here once applications are reviewed and approved
                  </p>
                </CardContent>
              </Card>
              ) : (
                filteredApprovedDealerships.map((dealership) => (
                  <Card key={dealership.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {dealership.logo && (
                                <img 
                                  src={dealership.logo} 
                                  alt="Dealership Logo" 
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                  {dealership.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  License: {dealership.application?.businessLicense || 'N/A'}
                                </p>
                              </div>
                            </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReview(dealership)}
                              className="w-full sm:w-auto"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => window.open(`/admin/dealership/${dealership.id}/portal`, '_blank')}
                              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Portal
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteDealership(dealership.id)}
                              className="w-full sm:w-auto"
                              disabled={deletingIds.has(dealership.id)}
                            >
                              <XSquare className={`w-4 h-4 mr-2 ${deletingIds.has(dealership.id) ? 'animate-pulse' : ''}`} />
                              {deletingIds.has(dealership.id) ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Admins:</span>
                            <span className="font-medium">{dealership.admins?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Cars:</span>
                            <span className="font-medium">{dealership.cars?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Approved:</span>
                            <span className="font-medium">
                              {dealership.approvedAt ? new Date(dealership.approvedAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">By:</span>
                            <span className="font-medium">{dealership.approvedByUser?.name || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{dealership.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{dealership.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{dealership.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Created: {new Date(dealership.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>ID: {dealership.id}</span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {dealership.application?.description || 'No description available'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Dealership Application</DialogTitle>
            <DialogDescription>
              Review and update the status of this dealership application.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Details */}
                        <div className="space-y-4">
                <h3 className="text-lg font-semibold">Application Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                    <Label className="text-gray-700">Dealership Name</Label>
                    <p className="font-medium">{selectedApplication.dealershipName || selectedApplication.name}</p>
              </div>
              <div>
                    <Label className="text-gray-700">Business License</Label>
                    <p className="font-medium">{selectedApplication.businessLicense || 'N/A'}</p>
              </div>
                  <div>
                    <Label className="text-gray-700">Owner Name</Label>
                    <p className="font-medium">{selectedApplication.ownerName || 'N/A'}</p>
            </div>
            <div>
                    <Label className="text-gray-700">Business Type</Label>
                    <p className="font-medium">{getBusinessTypeLabel(selectedApplication.businessType) || 'N/A'}</p>
                  </div>
            </div>
            <div>
                  <Label className="text-gray-700">Description</Label>
                  <p className="text-sm mt-1">{selectedApplication.description || 'No description available'}</p>
            </div>
            </div>

              {/* Review Form - Only show for applications */}
              {selectedApplication.status ? (
                <form onSubmit={submitReview} className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={reviewForm.status} 
                      onValueChange={(value) => setReviewForm({...reviewForm, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="REQUIRES_CHANGES">Requires Changes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="reviewNotes">Review Notes</Label>
                    <Textarea
                      id="reviewNotes"
                      value={reviewForm.reviewNotes}
                      onChange={(e) => setReviewForm({...reviewForm, reviewNotes: e.target.value})}
                      placeholder="Add your review notes, feedback, or reason for the status change..."
                      rows={4}
                    />
                    </div>

                  <div className="flex justify-end space-x-3 pt-4">
              <Button
                      type="button" 
                variant="outline"
                      onClick={() => setShowReviewDialog(false)}
                      disabled={isSubmittingReview}
              >
                Cancel
              </Button>
              <Button
                      type="submit" 
                      disabled={isSubmittingReview}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isSubmittingReview) {
                          submitReview(e);
                        }
                      }}
                    >
                      {isSubmittingReview ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                )}
              </Button>
                  </div>
                </form>
              ) : (
                /* Close button for approved dealerships */
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button" 
                    variant="outline"
                    onClick={() => setShowReviewDialog(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this dealership? This will permanently remove the dealership, all their cars, and reset user roles. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeletion}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
