"use client";

import { toast } from "sonner";
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
  Info,
  XCircle,
  Loader2,
  Search,
  Shield,
  Users,
  UserX,
} from "lucide-react";
import React, { useEffect, useState } from "react";

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
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");

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

        setWorkingHours(mappedHours);
      }
    }
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
    if (saveResult?.success) {
      toast.success("Working hours saved successfully");
      fetchDealershipInfo();
    }

    if (updateRoleResult?.success) {
      toast.success("User role updated successfully");
      fetchUsers();
      setConfirmAdminDialog(false);
      setConfirmRemoveDialog(false);
    }
  }, [updateRoleResult, saveResult]);

  // Debounce user search for 250ms
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedUserSearch(userSearch.trim());
    }, 250);
    return () => clearTimeout(id);
  }, [userSearch]);

  const handleWorkingHourChange = (index, field, value) => {
    const updatedHours = [...workingHours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value,
    };
    setWorkingHours(updatedHours);
  };

  const handleSaveHours = async () => {
    console.log("handleSaveHours called");
    try {
      console.log("Calling saveHours with:", workingHours);
      const result = await saveHours(workingHours);
      console.log("Save result:", result);

      if (result?.success) {
        console.log("Showing success toast");
        toast.success("Working hours saved successfully!");
        fetchDealershipInfo(); // Refresh the data
      } else if (result?.error) {
        console.log("Showing error toast:", result.error);
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error in handleSaveHours:", error);
      console.log("Showing exception toast");
      toast.error("Failed to save working hours. Please try again.");
    }
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
    ? usersData.data.filter((user) => {
        const q = debouncedUserSearch.toLowerCase();
        return (
          user.name?.toLowerCase().includes(q) ||
          user.email?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="bg-gradient-to-br from-muted/30 to-muted/50 p-2 sm:p-4 md:p-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <Tabs defaultValue="hours" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 md:mb-8 h-12 sm:h-14 p-1 bg-card shadow-lg rounded-lg overflow-hidden">
            <TabsTrigger
              value="hours"
              className="flex items-center justify-center gap-1 sm:gap-2 h-10 sm:h-12 text-xs sm:text-sm md:text-base data-[state=active]:bg-red-500 data-[state=active]:text-primary-foreground px-2 sm:px-4 transition-all"
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Working Hours</span>
              <span className="xs:hidden">Hours</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center justify-center gap-1 sm:gap-2 h-10 sm:h-12 text-xs sm:text-sm md:text-base data-[state=active]:bg-red-500 data-[state=active]:text-primary-foreground px-2 sm:px-4 transition-all"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Admin Users</span>
              <span className="xs:hidden">Users</span>
            </TabsTrigger>
          </TabsList>

          {/* Working Hours */}
          <TabsContent value="hours" className="mt-6 sm:mt-8">
            <Card className="bg-card shadow-lg sm:shadow-xl border-2 border-destructive/20 rounded-xl sm:rounded-2xl overflow-hidden">
              <CardHeader className="bg-destructive text-primary-foreground p-4 sm:p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                    Working Hours
                  </CardTitle>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-primary-foreground/90 hover:text-white transition-colors"
                    title="These hours apply across your dealership, including online booking and contact widgets. Closed days will hide booking times."
                    aria-label="Working hours help"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                  Set the working hours for your dealership.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 md:p-8">
                {fetchingSettings ? (
                  <div className="py-12 sm:py-16 text-center">
                    <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-primary mx-auto" />
                    <p className="text-base sm:text-lg text-muted-foreground mt-4 font-medium">
                      Loading settings...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 sm:space-y-4">
                      {DAYS.map((day, index) => (
                        <div
                          key={day.value}
                          className="grid grid-cols-1 sm:[grid-template-columns:160px_1fr] gap-3 sm:gap-4 md:gap-6 items-start sm:items-center p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border hover:border-primary/20 hover:shadow-md transition-all duration-300 bg-card"
                        >
                          <div className="flex items-center justify-between sm:block">
                            <div className="font-semibold text-sm sm:text-base md:text-lg text-foreground">
                              {day.label}
                            </div>
                            <div className="flex items-center gap-2 sm:hidden">
                              <Switch
                                id={`is-open-${day.value}`}
                                checked={!!workingHours[index]?.isOpen}
                                onCheckedChange={(checked) =>
                                  handleWorkingHourChange(
                                    index,
                                    "isOpen",
                                    checked
                                  )
                                }
                                className="data-[state=checked]:bg-destructive"
                                aria-label={`Toggle ${day.label} open status`}
                                title={`Mark ${day.label} as ${
                                  workingHours[index]?.isOpen
                                    ? "Closed"
                                    : "Open"
                                }`}
                              />
                              <span
                                className={`text-xs font-medium ${
                                  workingHours[index]?.isOpen
                                    ? "text-green-600"
                                    : "text-destructive"
                                }`}
                              >
                                {workingHours[index]?.isOpen
                                  ? "Open"
                                  : "Closed"}
                              </span>
                            </div>
                          </div>

                          <div className="hidden sm:flex items-center gap-4 w-full sm:col-start-2">
                            <div className="flex items-center gap-3 shrink-0">
                              <Switch
                                id={`is-open-${day.value}`}
                                checked={!!workingHours[index]?.isOpen}
                                onCheckedChange={(checked) =>
                                  handleWorkingHourChange(
                                    index,
                                    "isOpen",
                                    checked
                                  )
                                }
                                className="data-[state=checked]:bg-destructive"
                                aria-label={`Toggle ${day.label} open status`}
                                title={`Mark ${day.label} as ${
                                  workingHours[index]?.isOpen
                                    ? "Closed"
                                    : "Open"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  workingHours[index]?.isOpen
                                    ? "text-green-600"
                                    : "text-destructive"
                                }`}
                              >
                                {workingHours[index]?.isOpen
                                  ? "Open"
                                  : "Closed"}
                              </span>
                            </div>

                            {workingHours[index]?.isOpen ? (
                              <div className="flex items-center gap-4 ml-auto flex-1">
                                <div className="relative flex-1 min-w-[160px]">
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
                                    onClick={(e) => {
                                      if (
                                        typeof e.currentTarget.showPicker ===
                                        "function"
                                      ) {
                                        e.currentTarget.showPicker();
                                      } else {
                                        e.currentTarget.focus();
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        const t = e.currentTarget;
                                        if (
                                          typeof t.showPicker === "function"
                                        ) {
                                          t.showPicker();
                                        } else {
                                          t.focus();
                                        }
                                      }
                                    }}
                                    className="border-2 rounded-lg focus:border-destructive focus:ring-destructive text-center font-medium w-full text-sm py-2 cursor-pointer appearance-none"
                                  />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground shrink-0">
                                  to
                                </span>
                                <div className="relative flex-1 min-w-[160px]">
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
                                    onClick={(e) => {
                                      if (
                                        typeof e.currentTarget.showPicker ===
                                        "function"
                                      ) {
                                        e.currentTarget.showPicker();
                                      } else {
                                        e.currentTarget.focus();
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        const t = e.currentTarget;
                                        if (
                                          typeof t.showPicker === "function"
                                        ) {
                                          t.showPicker();
                                        } else {
                                          t.focus();
                                        }
                                      }
                                    }}
                                    className="border-2 rounded-lg focus:border-destructive focus:ring-destructive text-center font-medium w-full text-sm py-2 cursor-pointer appearance-none"
                                  />
                                </div>
                              </div>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="w-[160px] inline-flex justify-center items-center gap-1 text-sm px-2 py-1 ml-auto"
                              >
                                <XCircle className="h-4 w-4" />
                                Closed all day
                              </Badge>
                            )}
                          </div>

                          {!workingHours[index]?.isOpen && (
                            <div className="w-full col-span-full sm:col-span-1">
                              <Badge
                                variant="destructive"
                                className="inline-flex items-center gap-1 text-xs sm:text-sm px-2 py-1 sm:hidden"
                                role="status"
                                aria-live="polite"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Closed all day
                              </Badge>
                            </div>
                          )}
                          {workingHours[index]?.isOpen && (
                            <div className="grid grid-cols-2 sm:hidden items-center gap-2 w-full col-span-full sm:col-span-1">
                              <div className="relative flex-1">
                                <div className="relative">
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
                                    onClick={(e) => {
                                      if (
                                        typeof e.currentTarget.showPicker ===
                                        "function"
                                      ) {
                                        e.currentTarget.showPicker();
                                      } else {
                                        e.currentTarget.focus();
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        const t = e.currentTarget;
                                        if (
                                          typeof t.showPicker === "function"
                                        ) {
                                          t.showPicker();
                                        } else {
                                          t.focus();
                                        }
                                      }
                                    }}
                                    className="border-2 rounded-lg focus:border-destructive focus:ring-destructive text-center font-medium w-full text-sm sm:text-base py-2 sm:py-2.5 cursor-pointer appearance-none"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none"></div>
                                </div>
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
                                to
                              </span>
                              <div className="relative flex-1">
                                <div className="relative">
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
                                    onClick={(e) => {
                                      if (
                                        typeof e.currentTarget.showPicker ===
                                        "function"
                                      ) {
                                        e.currentTarget.showPicker();
                                      } else {
                                        e.currentTarget.focus();
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        const t = e.currentTarget;
                                        if (
                                          typeof t.showPicker === "function"
                                        ) {
                                          t.showPicker();
                                        } else {
                                          t.focus();
                                        }
                                      }
                                    }}
                                    className="border-2 rounded-lg focus:border-destructive focus:ring-destructive text-center font-medium w-full text-sm sm:text-base py-2 sm:py-2.5 cursor-pointer appearance-none"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 sm:pt-6 md:pt-8 flex justify-end">
                      <Button
                        onClick={handleSaveHours}
                        disabled={savingHours}
                        className="bg-destructive hover:bg-destructive/90 text-primary-foreground px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 w-full sm:w-auto min-h-[44px]"
                      >
                        {savingHours && (
                          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
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
          <TabsContent value="users" className="mt-6 sm:mt-8">
            <Card className="bg-card shadow-lg sm:shadow-xl border-2 border-destructive/20 rounded-xl sm:rounded-2xl overflow-hidden">
              <CardHeader className="bg-destructive text-primary-foreground p-4 sm:p-6 md:p-8">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                  Admin Users
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                  Manage users with admin privileges.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-6 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-10 sm:pl-12 h-12 sm:h-14 border-2 rounded-xl focus:border-primary focus:ring-primary text-base sm:text-lg"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                {fetchingUsers ? (
                  <div className="py-12 sm:py-16 text-center">
                    <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-primary mx-auto" />
                    <p className="text-base sm:text-lg text-muted-foreground mt-4 font-medium">
                      Loading users...
                    </p>
                  </div>
                ) : usersData?.success && filteredUsers.length > 0 ? (
                  <div className="w-full">
                    {/* Mobile Card Layout */}
                    <div className="block sm:hidden space-y-3">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="border rounded-lg p-4 bg-card hover:border-primary/20 transition-colors"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 overflow-hidden shadow-md flex-shrink-0">
                              {user.imageUrl ? (
                                <img
                                  src={user.imageUrl}
                                  alt={user.name || "User"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Users className="w-5 h-5 text-primary mx-auto my-2.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground text-base truncate">
                                {user.name || "Unnamed User"}
                              </div>
                              <div className="text-muted-foreground text-sm truncate">
                                {user.email}
                              </div>
                              <Badge
                                className={`mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                  user.role === "ADMIN"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-muted text-muted-foreground border"
                                }`}
                              >
                                {user.role}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            {user.role === "ADMIN" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30 rounded-lg px-3 py-2 font-medium text-sm min-h-[36px]"
                                onClick={() => {
                                  setUserToDemote(user);
                                  setConfirmRemoveDialog(true);
                                }}
                                disabled={updatingRole}
                              >
                                <UserX className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/30 rounded-lg px-3 py-2 font-medium text-sm min-h-[36px]"
                                onClick={() => {
                                  setUserToPromote(user);
                                  setConfirmAdminDialog(true);
                                }}
                                disabled={updatingRole}
                              >
                                <Shield className="h-3 w-3 mr-1" /> Make Admin
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden sm:block w-full overflow-x-auto">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow className="bg-muted/30 border-b-2">
                            <TableHead className="text-left py-3 sm:py-4 px-4 sm:px-6 font-bold text-foreground text-sm sm:text-base md:text-lg">
                              User
                            </TableHead>
                            <TableHead className="text-left py-3 sm:py-4 px-4 sm:px-6 font-bold text-foreground text-sm sm:text-base md:text-lg">
                              Email
                            </TableHead>
                            <TableHead className="text-left py-3 sm:py-4 px-4 sm:px-6 font-bold text-foreground text-sm sm:text-base md:text-lg">
                              Role
                            </TableHead>
                            <TableHead className="text-right py-3 sm:py-4 px-4 sm:px-6 font-bold text-foreground text-sm sm:text-base md:text-lg">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow
                              key={user.id}
                              className="hover:bg-primary/5 transition-colors duration-200 border-b"
                            >
                              <TableCell className="py-3 sm:py-4 px-4 sm:px-6">
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 overflow-hidden shadow-md">
                                    {user.imageUrl ? (
                                      <img
                                        src={user.imageUrl}
                                        alt={user.name || "User"}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto my-2 sm:my-2.5" />
                                    )}
                                  </div>
                                  <span className="font-medium text-foreground text-sm sm:text-base md:text-lg">
                                    {user.name || "Unnamed User"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3 sm:py-4 px-4 sm:px-6 text-muted-foreground font-medium text-sm sm:text-base">
                                {user.email}
                              </TableCell>
                              <TableCell className="py-3 sm:py-4 px-4 sm:px-6">
                                <Badge
                                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                    user.role === "ADMIN"
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : "bg-muted text-muted-foreground border"
                                  }`}
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right py-3 sm:py-4 px-4 sm:px-6">
                                {user.role === "ADMIN" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30 rounded-lg px-3 sm:px-4 py-2 font-medium text-sm"
                                    onClick={() => {
                                      setUserToDemote(user);
                                      setConfirmRemoveDialog(true);
                                    }}
                                    disabled={updatingRole}
                                  >
                                    <UserX className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />{" "}
                                    Remove
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/30 rounded-lg px-3 sm:px-4 py-2 font-medium text-sm"
                                    onClick={() => {
                                      setUserToPromote(user);
                                      setConfirmAdminDialog(true);
                                    }}
                                    disabled={updatingRole}
                                  >
                                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />{" "}
                                    Make Admin
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 sm:py-16 text-center text-muted-foreground">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg sm:text-xl font-medium">
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
              <DialogContent className="bg-card rounded-2xl border shadow-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md mx-4">
                <DialogHeader className="text-center mb-4 sm:mb-6">
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
                    Confirm Admin Privileges
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    Are you sure you want to make{" "}
                    <span className="font-semibold text-primary">
                      {userToPromote?.name || userToPromote?.email}
                    </span>{" "}
                    an admin?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmAdminDialog(false)}
                    disabled={updatingRole}
                    className="flex-1 py-3 border-2 hover:bg-muted rounded-xl font-semibold text-sm sm:text-base min-h-[44px] order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleMakeAdmin}
                    disabled={updatingRole}
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-sm sm:text-base min-h-[44px] order-1 sm:order-2"
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
              <DialogContent className="bg-card rounded-2xl border shadow-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md mx-4">
                <DialogHeader className="text-center mb-4 sm:mb-6">
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
                    Remove Admin Privileges
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    Are you sure you want to remove admin privileges from{" "}
                    <span className="font-semibold text-primary">
                      {userToDemote?.name || userToDemote?.email}
                    </span>
                    ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmRemoveDialog(false)}
                    disabled={updatingRole}
                    className="flex-1 py-3 border-2 hover:bg-muted rounded-xl font-semibold text-sm sm:text-base min-h-[44px] order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRemoveAdmin}
                    disabled={updatingRole}
                    className="flex-1 py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-semibold text-sm sm:text-base min-h-[44px] order-1 sm:order-2"
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
