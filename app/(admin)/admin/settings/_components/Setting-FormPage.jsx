"use client";

import {
  getDealershipInfo,
  getUsers,
  saveWorkingHours,
  updateUserRole,
} from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFetch from "@/hooks/use-fetch";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Loader2,
  Search,
  Shield,
  Users,
  UserX,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

const SettingFormPage = () => {
  const [workingHours, setWorkingHours] = useState(
    DAYS.map((day) => ({
      dayOfWeek: day.value,
      openTime: "09:00",
      closeTime: "18:00",
      isOpen: day.value !== "SUNDAY",
    }))
  );

  const [userSearch, setUserSearch] = useState("");
  const [confirmAdminDialog, setConfirmAdminDialog] = useState(false);
  const [userToPromote, setUserToPromote] = useState(null);
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState(false);
  const [userToDemote, setUserToDemote] = useState(null);

  const {
    loading: fetchingSettings,
    fn: fetchDealershipInfo,
    data: settingsData,
    error: settingsError,
  } = useFetch(getDealershipInfo);

  const {
    loading: savingHours,
    fn: saveHours,
    data: saveResult,
    error: saveError,
  } = useFetch(saveWorkingHours);

  const {
    loading: fetchingUsers,
    fn: fetchUsers,
    data: usersData,
    error: usersError,
  } = useFetch(getUsers);

  const {
    loading: updatingRole,
    fn: updateRole,
    data: updateRoleResult,
    error: updateRoleError,
  } = useFetch(updateUserRole);

  useEffect(() => {
    fetchDealershipInfo();
    fetchUsers();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (settingsData?.success && settingsData.data) {
      const dealership = settingsData.data;

      if (dealership.workingHours.length > 0) {
        const mappedHours = DAYS.map((day) => {
          const hourData = dealership.workingHours.find(
            (h) => h.dayOfWeek === day.value
          );

          if (hourData) {
            return {
              dayOfWeek: hourData.dayOfWeek,
              openTime: hourData.openTime,
              closeTime: hourData.closeTime,
              isOpen: hourData.isOpen,
            };
          }

          return {
            dayOfWeek: day.value,
            openTime: "09:00",
            closeTime: "18:00",
            isOpen: day.value !== "SUNDAY",
          };
        });

        if (isMounted) setWorkingHours(mappedHours);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [settingsData]);

  useEffect(() => {
    if (settingsError) {
      toast.error("Failed to load dealership settings");
    }
    if (saveError) {
      toast.error(`Failed to save working hours: ${saveError.message}`);
    }
    if (usersError) {
      toast.error("Failed to load users");
    }
    if (updateRoleError) {
      toast.error(`Failed to update user role: ${updateRoleError.message}`);
    }
  }, [settingsError, saveError, usersError, updateRoleError]);

  useEffect(() => {
    let isMounted = true;
    if (saveResult?.success) {
      toast.success("Working hours saved successfully");
      fetchDealershipInfo();
    }
    if (updateRoleResult?.success) {
      toast.success("User role updated successfully");
      fetchUsers();
      if (isMounted) {
        setConfirmAdminDialog(false);
        setConfirmRemoveDialog(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [saveResult, updateRoleResult]);

  const handleWorkingHourChange = (index, field, value) => {
    const updatedHours = [...workingHours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value,
    };
    setWorkingHours(updatedHours);
  };

  const handleSaveHours = async () => {
    await saveHours(workingHours);
  };

  const handleMakeAdmin = async () => {
    if (!userToPromote) return;
    await updateRole(userToPromote.id, "ADMIN");
  };

  const handleRemoveAdmin = async () => {
    if (!userToDemote) return;
    await updateRole(userToDemote.id, "USER");
  };

  const filteredUsers = usersData?.success
    ? usersData.data.filter(
        (user) =>
          user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.email?.toLowerCase().includes(userSearch.toLowerCase())
      )
    : [];

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto">
        <Tabs defaultValue="hours" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-white shadow-lg">
            <TabsTrigger
              value="hours"
              className="flex items-center gap-2 h-10 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Clock className="h-4 w-4" /> Working Hours
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 h-10 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4" /> Admin Users
            </TabsTrigger>
          </TabsList>

          {/* Working Hours */}
          <TabsContent value="hours" className="mt-8">
            <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Clock className="h-6 w-6" />
                  Working Hours
                </CardTitle>
                <CardDescription className="text-red-100 text-base">
                  Set the working hours for your dealership.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {fetchingSettings ? (
                  <div className="py-16 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto" />
                    <p className="text-lg text-gray-600 mt-4 font-medium">
                      Loading settings...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {DAYS.map((day, index) => (
                        <div
                          key={day.value}
                          className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center p-6 rounded-xl border-2 border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 bg-white"
                        >
                          <div className="font-semibold text-lg text-gray-800">
                            {day.label}
                          </div>

                          <div className="flex items-center gap-4">
                            <Switch
                              checked={!!workingHours[index]?.isOpen}
                              onCheckedChange={(checked) =>
                                handleWorkingHourChange(
                                  index,
                                  "isOpen",
                                  checked
                                )
                              }
                              className="data-[state=checked]:bg-red-600"
                            />
                            <span
                              className={`text-sm font-medium ${
                                workingHours[index]?.isOpen
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {workingHours[index]?.isOpen ? "Open" : "Closed"}
                            </span>
                          </div>

                          {workingHours[index]?.isOpen && (
                            <>
                              <Input
                                type="time"
                                value={workingHours[index]?.openTime}
                                onChange={(e) =>
                                  handleWorkingHourChange(
                                    index,
                                    "openTime",
                                    e.target.value
                                  )
                                }
                                className="border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-red-500 text-center font-medium"
                              />
                              <Input
                                type="time"
                                value={workingHours[index]?.closeTime}
                                onChange={(e) =>
                                  handleWorkingHourChange(
                                    index,
                                    "closeTime",
                                    e.target.value
                                  )
                                }
                                className="border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-red-500 text-center font-medium"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="pt-8 flex justify-end">
                      <Button
                        onClick={handleSaveHours}
                        disabled={savingHours}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {savingHours && (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="mt-8">
            <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Shield className="h-6 w-6" />
                  Admin Users
                </CardTitle>
                <CardDescription className="text-red-100 text-base">
                  Manage users with admin privileges.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-12 h-14 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 text-lg"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                {fetchingUsers ? (
                  <div className="py-16 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto" />
                    <p className="text-lg text-gray-600 mt-4 font-medium">
                      Loading users...
                    </p>
                  </div>
                ) : usersData?.success && filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border-2 border-gray-100">
                    <Table className="bg-white">
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b-2 border-gray-100">
                          <TableHead className="text-left py-4 px-6 font-bold text-gray-800 text-lg">
                            User
                          </TableHead>
                          <TableHead className="text-left py-4 px-6 font-bold text-gray-800 text-lg">
                            Email
                          </TableHead>
                          <TableHead className="text-left py-4 px-6 font-bold text-gray-800 text-lg">
                            Role
                          </TableHead>
                          <TableHead className="text-right py-4 px-6 font-bold text-gray-800 text-lg">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="hover:bg-red-50 transition-colors duration-200 border-b border-gray-100"
                          >
                            <TableCell className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 overflow-hidden shadow-md">
                                  {user.imageUrl ? (
                                    <img
                                      src={user.imageUrl}
                                      alt={user.name || "User"}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Users className="w-5 h-5 text-white mx-auto my-2.5" />
                                  )}
                                </div>
                                <span className="font-medium text-gray-900 text-lg">
                                  {user.name || "Unnamed User"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6 text-gray-700 font-medium">
                              {user.email}
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <Badge
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  user.role === "ADMIN"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-gray-100 text-gray-800 border border-gray-200"
                                }`}
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right py-4 px-6">
                              {user.role === "ADMIN" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg px-4 py-2 font-medium"
                                  onClick={() => {
                                    setUserToDemote(user);
                                    setConfirmRemoveDialog(true);
                                  }}
                                  disabled={updatingRole}
                                >
                                  <UserX className="h-4 w-4 mr-2" /> Remove
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg px-4 py-2 font-medium"
                                  onClick={() => {
                                    setUserToPromote(user);
                                    setConfirmAdminDialog(true);
                                  }}
                                  disabled={updatingRole}
                                >
                                  <Shield className="h-4 w-4 mr-2" /> Make Admin
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-500">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl font-medium">
                      {userSearch
                        ? "No users match your search criteria."
                        : "There are no users yet."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Confirm Make Admin */}
            <Dialog
              open={confirmAdminDialog}
              onOpenChange={setConfirmAdminDialog}
            >
              <DialogContent className="bg-white rounded-2xl border-0 shadow-2xl p-8 max-w-md">
                <DialogHeader className="text-center mb-6">
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Confirm Admin Privileges
                  </DialogTitle>
                  <DialogDescription className="text-lg text-gray-600">
                    Are you sure you want to make{" "}
                    <span className="font-semibold text-red-600">
                      {userToPromote?.name || userToPromote?.email}
                    </span>{" "}
                    an admin?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmAdminDialog(false)}
                    disabled={updatingRole}
                    className="flex-1 py-3 border-2 border-gray-200 hover:bg-gray-50 rounded-xl font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleMakeAdmin}
                    disabled={updatingRole}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
                  >
                    {updatingRole ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Confirm Remove Admin */}
            <Dialog
              open={confirmRemoveDialog}
              onOpenChange={setConfirmRemoveDialog}
            >
              <DialogContent className="bg-white rounded-2xl border-0 shadow-2xl p-8 max-w-md">
                <DialogHeader className="text-center mb-6">
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Remove Admin Privileges
                  </DialogTitle>
                  <DialogDescription className="text-lg text-gray-600">
                    Are you sure you want to remove admin privileges from{" "}
                    <span className="font-semibold text-red-600">
                      {userToDemote?.name || userToDemote?.email}
                    </span>
                    ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmRemoveDialog(false)}
                    disabled={updatingRole}
                    className="flex-1 py-3 border-2 border-gray-200 hover:bg-gray-50 rounded-xl font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRemoveAdmin}
                    disabled={updatingRole}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
                  >
                    {updatingRole ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      "Remove Admin"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingFormPage;
