import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay, addDays, isAfter } from "date-fns";

interface DatePickerProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

interface AdminSettings {
  day_of_week: number;
}

export default function DatePicker({
  onSelectDate,
  selectedDate,
}: DatePickerProps) {
  const [workingDays, setWorkingDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkingDays = async () => {
      try {
        setIsLoading(true);

        // 1. First, get the admin user (assuming single admin system)
        console.log("Fetching admin user...");
        const { data: adminData, error: adminError } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "admin")
          .limit(1)
          .single();

        console.log("Admin data:", adminData);
        console.log("Admin error:", adminError);

        if (adminError || !adminData) {
          throw new Error("Could not find admin account");
        }

        const adminUserId = adminData.id;
        setAdminId(adminUserId);

        // 2. Get admin settings for working days
        console.log("Fetching admin settings for user:", adminUserId);
        const { data: settingsData, error: settingsError } = await supabase
          .from("admin_settings")
          .select("day_of_week")
          .eq("admin_user_id", adminUserId)
          .eq("is_active", true);

        console.log("Settings data:", settingsData);
        console.log("Settings error:", settingsError);

        if (settingsError) {
          throw settingsError;
        }

        const days = settingsData?.map((setting) => setting.day_of_week) || [];
        console.log("Working days:", days);
        setWorkingDays(days);
      } catch (error) {
        console.error("Error fetching working days:", error);
        toast({
          title: "Error",
          description: "Failed to load doctor's schedule. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkingDays();
  }, [toast]);

  // Disable dates that are:
  // 1. In the past
  // 2. Not on working days
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) {
      return true;
    }

    // Disable dates not on working days
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    return !workingDays.includes(dayOfWeek);
  };

  return (
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div>
            {workingDays.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg font-medium text-gray-500">
                  No available booking dates.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  The doctor has not set any available days for appointments.
                </p>
              </div>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => date && onSelectDate(date)}
                className="rounded-md border p-3"
                disabled={isDateDisabled}
                initialFocus
                fromDate={new Date()}
                toDate={addDays(new Date(), 60)} // Allow booking up to 60 days in advance
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
