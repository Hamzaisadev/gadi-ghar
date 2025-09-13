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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { PageSpinner } from "@/components/ui/loading-spinner";
import { getDealershipApplications, reviewDealershipApplication } from "@/app/actions/dealership";

export default function DealershipApplications() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: "",
    reviewNotes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, [currentPage]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      
      const result = await getDealershipApplications();
      
      // Check if result exists and has the expected structure
      if (!result) {
        throw new Error('No response received from server');
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch applications');
      }

      setApplications(result.data || []);
      // Since we're not implementing pagination in the action yet, set total pages to 1
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(error.message || "Failed to fetch applications");
      setApplications([]); // Set empty array on error
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

  const handleReview = (application) => {
    setSelectedApplication(application);
    setReviewForm({
      status: application.status === "PENDING" ? "UNDER_REVIEW" : application.status,
      reviewNotes: ""
    });
    setShowReviewDialog(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    try {
      const result = await reviewDealershipApplication(selectedApplication.id, reviewForm);

      // Check if result exists and has the expected structure
      if (!result) {
        throw new Error('No response received from server');
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit review');
      }

      // Refresh applications to get updated data
      await fetchApplications();
      
      setShowReviewDialog(false);
      setSelectedApplication(null);
      
      toast.success("Application review submitted successfully");
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.message || "Failed to submit review");
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
    return <PageSpinner text="Loading applications..." />;
  }

  return (
    <div className="space-y-6">
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
                  <SelectItem value="APPROVED">Approved</SelectItem>
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
                  : "There are no dealership applications at the moment"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium">{application.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{getBusinessTypeLabel(application.businessType)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            <span className="flex items-center justify-center px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        </div>
      )}

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
                    <p className="font-medium">{selectedApplication.dealershipName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Business License</Label>
                    <p className="font-medium">{selectedApplication.businessLicense}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Owner Name</Label>
                    <p className="font-medium">{selectedApplication.ownerName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Business Type</Label>
                    <p className="font-medium">{getBusinessTypeLabel(selectedApplication.businessType)}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">Description</Label>
                  <p className="text-sm mt-1">{selectedApplication.description}</p>
                </div>
              </div>

              {/* Review Form */}
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
