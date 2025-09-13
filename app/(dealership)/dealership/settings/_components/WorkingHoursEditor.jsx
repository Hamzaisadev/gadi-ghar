"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, Save, RotateCcw } from "lucide-react";
import { saveWorkingHours } from "@/app/actions/settings";
import { getDealershipData } from "@/app/actions/dealership";
import useFetch from "@/hooks/use-fetch";

const DAYS = [
  { key: "MONDAY", label: "Monday", short: "Mon" },
  { key: "TUESDAY", label: "Tuesday", short: "Tue" },
  { key: "WEDNESDAY", label: "Wednesday", short: "Wed" },
  { key: "THURSDAY", label: "Thursday", short: "Thu" },
  { key: "FRIDAY", label: "Friday", short: "Fri" },
  { key: "SATURDAY", label: "Saturday", short: "Sat" },
  { key: "SUNDAY", label: "Sunday", short: "Sun" },
];

const DEFAULT_HOURS = {
  MONDAY: { openTime: "09:00", closeTime: "18:00", isOpen: true },
  TUESDAY: { openTime: "09:00", closeTime: "18:00", isOpen: true },
  WEDNESDAY: { openTime: "09:00", closeTime: "18:00", isOpen: true },
  THURSDAY: { openTime: "09:00", closeTime: "18:00", isOpen: true },
  FRIDAY: { openTime: "09:00", closeTime: "18:00", isOpen: true },
  SATURDAY: { openTime: "09:00", closeTime: "17:00", isOpen: true },
  SUNDAY: { openTime: "", closeTime: "", isOpen: false },
};

export default function WorkingHoursEditor() {
  const [workingHours, setWorkingHours] = useState(DEFAULT_HOURS);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    loading: loadingDealership,
    fn: fetchDealership,
    data: dealershipData,
  } = useFetch(getDealershipData);

  const {
    loading: savingHours,
    fn: saveHoursFn,
    data: saveResult,
  } = useFetch(saveWorkingHours);

  useEffect(() => {
    fetchDealership();
  }, []);

  useEffect(() => {
    if (dealershipData?.success && dealershipData.data.workingHours) {
      const hoursMap = {};
      dealershipData.data.workingHours.forEach((hour) => {
        hoursMap[hour.dayOfWeek] = {
          openTime: hour.openTime || "",
          closeTime: hour.closeTime || "",
          isOpen: hour.isOpen,
        };
      });
      
      const completeHours = { ...DEFAULT_HOURS };
      DAYS.forEach(day => {
        if (hoursMap[day.key]) {
          completeHours[day.key] = hoursMap[day.key];
        }
      });
      
      setWorkingHours(completeHours);
    }
  }, [dealershipData]);

  useEffect(() => {
    if (saveResult?.success) {
      toast.success("Working hours updated successfully");
      setHasChanges(false);
    }
  }, [saveResult]);

  const handleTimeChange = (day, field, value) => {
    if (!validateTimeFormat(value) && value !== "") return;
    
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleToggleDay = (day, isOpen) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen,
        openTime: isOpen ? (prev[day].openTime || "09:00") : "",
        closeTime: isOpen ? (prev[day].closeTime || "18:00") : ""
      }
    }));
    setHasChanges(true);
  };

  const validateTimeFormat = (time) => {
    if (!time) return true;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const validateHours = (openTime, closeTime) => {
    if (!openTime || !closeTime) return true;
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;
    return openMinutes < closeMinutes;
  };

  const handleSave = async () => {
    const errors = [];
    
    Object.entries(workingHours).forEach(([day, hours]) => {
      if (hours.isOpen) {
        if (!hours.openTime || !hours.closeTime) {
          errors.push(`${DAYS.find(d => d.key === day)?.label} is missing opening or closing time`);
        } else if (!validateHours(hours.openTime, hours.closeTime)) {
          errors.push(`${DAYS.find(d => d.key === day)?.label} closing time must be after opening time`);
        }
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    await saveHoursFn(workingHours);
  };

  const handleReset = () => {
    setWorkingHours(DEFAULT_HOURS);
    setHasChanges(true);
  };

  const getStatusBadge = (hours) => {
    if (!hours.isOpen) {
      return <Badge variant="secondary">Closed</Badge>;
    }
    if (hours.openTime && hours.closeTime) {
      return <Badge variant="default">{hours.openTime} - {hours.closeTime}</Badge>;
    }
    return <Badge variant="outline">Open</Badge>;
  };

  if (loadingDealership) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours
          </CardTitle>
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Unsaved Changes
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {DAYS.map(day => (
            <div key={day.key} className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="font-medium text-sm mb-1">{day.short}</div>
              {getStatusBadge(workingHours[day.key])}
            </div>
          ))}
        </div>

        {/* Detailed Editor */}
        <div className="space-y-4">
          {DAYS.map(day => (
            <div key={day.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <Switch
                  checked={workingHours[day.key].isOpen}
                  onCheckedChange={(checked) => handleToggleDay(day.key, checked)}
                />
                <Label className="font-medium min-w-[100px]">{day.label}</Label>
              </div>
              
              {workingHours[day.key].isOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={workingHours[day.key].openTime}
                    onChange={(e) => handleTimeChange(day.key, 'openTime', e.target.value)}
                    className="w-32"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={workingHours[day.key].closeTime}
                    onChange={(e) => handleTimeChange(day.key, 'closeTime', e.target.value)}
                    className="w-32"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <span>Closed</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={savingHours || !hasChanges}
            className="gap-2"
          >
            {savingHours ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Working Hours
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
