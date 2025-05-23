
import { useState, useEffect } from "react";
import { format, addMinutes, isSameDay, parseISO, isAfter } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeSlotsProps {
  selectedDate: Date;
  onSelectSlot: (startTime: Date, endTime: Date, adminId: string) => void;
}

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  adminId: string;
}

export default function TimeSlots({ selectedDate, onSelectSlot }: TimeSlotsProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setIsLoading(true);
        
        // 1. First, get the admin user (assuming single admin system)
        const { data: adminData, error: adminError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
          .single();

        if (adminError || !adminData) {
          throw new Error("Could not find admin account");
        }

        const adminUserId = adminData.id;
        
        // 2. Get settings for the selected day of the week
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
        const { data: settingsData, error: settingsError } = await supabase
          .from('admin_settings')
          .select('*')
          .eq('admin_user_id', adminUserId)
          .eq('day_of_week', dayOfWeek)
          .eq('is_active', true)
          .single();
          
        if (settingsError && settingsError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - not an error if the day is not active
          throw settingsError;
        }
        
        // If no settings for this day, return empty array
        if (!settingsData) {
          setTimeSlots([]);
          return;
        }
        
        // 3. Generate time slots based on settings
        const { start_time, end_time, slot_duration_minutes } = settingsData;
        
        // Parse the time strings
        const startHour = parseInt(start_time.split(':')[0]);
        const startMinute = parseInt(start_time.split(':')[1]);
        const endHour = parseInt(end_time.split(':')[0]);
        const endMinute = parseInt(end_time.split(':')[1]);
        
        // Create start and end datetime objects
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(startHour, startMinute, 0, 0);
        
        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(endHour, endMinute, 0, 0);
        
        // Generate slots
        const slots: TimeSlot[] = [];
        let currentSlotStart = new Date(startDateTime);
        
        while (currentSlotStart < endDateTime) {
          const currentSlotEnd = new Date(currentSlotStart);
          currentSlotEnd.setMinutes(currentSlotStart.getMinutes() + slot_duration_minutes);
          
          // Don't add slots that go beyond the end time
          if (currentSlotEnd <= endDateTime) {
            slots.push({
              startTime: new Date(currentSlotStart),
              endTime: new Date(currentSlotEnd),
              isAvailable: true,
              adminId: adminUserId
            });
          }
          
          currentSlotStart = new Date(currentSlotEnd);
        }
        
        // 4. Get blocked periods for the day
        const dayStart = new Date(selectedDate);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        const { data: blockedData, error: blockedError } = await supabase
          .from('blocked_periods')
          .select('*')
          .eq('admin_user_id', adminUserId)
          .lte('start_datetime', dayEnd.toISOString())
          .gte('end_datetime', dayStart.toISOString());
          
        if (blockedError) {
          throw blockedError;
        }
        
        // 5. Get existing appointments for the day
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select('*')
          .eq('admin_user_id', adminUserId)
          .eq('status', 'booked')
          .lte('start_datetime', dayEnd.toISOString())
          .gte('end_datetime', dayStart.toISOString());
          
        if (appointmentError) {
          throw appointmentError;
        }
        
        // 6. Mark slots as unavailable if they overlap with blocked periods or appointments
        const isSlotBlocked = (slotStart: Date, slotEnd: Date) => {
          // Check for blocked periods
          for (const blocked of blockedData || []) {
            const blockStart = new Date(blocked.start_datetime);
            const blockEnd = new Date(blocked.end_datetime);
            
            if (
              (slotStart >= blockStart && slotStart < blockEnd) ||
              (slotEnd > blockStart && slotEnd <= blockEnd) ||
              (slotStart <= blockStart && slotEnd >= blockEnd)
            ) {
              return true;
            }
          }
          
          // Check for existing appointments
          for (const appointment of appointmentData || []) {
            const apptStart = new Date(appointment.start_datetime);
            const apptEnd = new Date(appointment.end_datetime);
            
            if (
              (slotStart >= apptStart && slotStart < apptEnd) ||
              (slotEnd > apptStart && slotEnd <= apptEnd) ||
              (slotStart <= apptStart && slotEnd >= apptEnd)
            ) {
              return true;
            }
          }
          
          return false;
        };
        
        // Mark slots as unavailable
        const availableSlots = slots.map(slot => ({
          ...slot,
          isAvailable: !isSlotBlocked(slot.startTime, slot.endTime) && isAfter(slot.startTime, new Date())
        }));
        
        setTimeSlots(availableSlots);
        
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast({
          title: "Error",
          description: "Failed to load available appointment slots. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [selectedDate, toast]);
  
  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      onSelectSlot(slot.startTime, slot.endTime, slot.adminId);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-gray-500">No available slots.</p>
            <p className="text-sm text-gray-400 mt-2">The doctor is not available on this day or all slots are booked.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot, index) => (
              <Badge
                key={index}
                className={`flex items-center justify-center px-3 py-2 text-center ${
                  slot.isAvailable
                    ? "bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer"
                    : "bg-gray-100 text-gray-500 opacity-50 cursor-not-allowed"
                }`}
                variant="outline"
                onClick={() => slot.isAvailable && handleSelectSlot(slot)}
              >
                {format(slot.startTime, "h:mm a")}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
