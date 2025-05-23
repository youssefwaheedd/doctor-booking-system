
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DaySettings {
  id?: string;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

export function AvailabilitySettings() {
  const [days, setDays] = useState<DaySettings[]>([
    { day_of_week: 0, day_name: "Sunday", start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30, is_active: false },
    { day_of_week: 1, day_name: "Monday", start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30, is_active: true },
    { day_of_week: 2, day_name: "Tuesday", start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30, is_active: true },
    { day_of_week: 3, day_name: "Wednesday", start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30, is_active: true },
    { day_of_week: 4, day_name: "Thursday", start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30, is_active: true },
    { day_of_week: 5, day_name: "Friday", start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30, is_active: true },
    { day_of_week: 6, day_name: "Saturday", start_time: "09:00", end_time: "13:00", slot_duration_minutes: 30, is_active: false },
  ]);
  
  const [defaultSlotDuration, setDefaultSlotDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("admin_settings")
          .select("*")
          .eq("admin_user_id", user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map database settings to our days array
          const updatedDays = [...days];
          
          data.forEach(setting => {
            const dayIndex = updatedDays.findIndex(day => day.day_of_week === setting.day_of_week);
            
            if (dayIndex !== -1) {
              updatedDays[dayIndex] = {
                ...updatedDays[dayIndex],
                id: setting.id,
                start_time: setting.start_time,
                end_time: setting.end_time,
                slot_duration_minutes: setting.slot_duration_minutes,
                is_active: setting.is_active,
              };
            }
            
            // Set the default slot duration from the first setting
            if (setting.day_of_week === 1) { // Monday
              setDefaultSlotDuration(setting.slot_duration_minutes);
            }
          });
          
          setDays(updatedDays);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load availability settings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [user, toast]);

  const handleDayChange = (dayIndex: number, field: keyof DaySettings, value: any) => {
    const updatedDays = [...days];
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
    setDays(updatedDays);
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // For each day, insert or update the settings
      for (const day of days) {
        if (day.id) {
          // Update existing setting
          const { error } = await supabase
            .from("admin_settings")
            .update({
              start_time: day.start_time,
              end_time: day.end_time,
              slot_duration_minutes: day.slot_duration_minutes,
              is_active: day.is_active,
            })
            .eq("id", day.id);
            
          if (error) throw error;
        } else {
          // Insert new setting if the day is active
          if (day.is_active) {
            const { error } = await supabase
              .from("admin_settings")
              .insert({
                admin_user_id: user.id,
                day_of_week: day.day_of_week,
                start_time: day.start_time,
                end_time: day.end_time,
                slot_duration_minutes: day.slot_duration_minutes,
                is_active: true,
              });
              
            if (error) throw error;
          }
        }
      }
      
      toast({
        title: "Settings Saved",
        description: "Your availability settings have been updated successfully.",
      });
      
      // Reload settings to get the new IDs
      const { data, error } = await supabase
        .from("admin_settings")
        .select("*")
        .eq("admin_user_id", user.id);
        
      if (error) throw error;
      
      if (data) {
        const updatedDays = [...days];
        
        data.forEach(setting => {
          const dayIndex = updatedDays.findIndex(day => day.day_of_week === setting.day_of_week);
          
          if (dayIndex !== -1) {
            updatedDays[dayIndex] = {
              ...updatedDays[dayIndex],
              id: setting.id,
            };
          }
        });
        
        setDays(updatedDays);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save availability settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyToAll = () => {
    const updatedDays = days.map(day => ({
      ...day,
      slot_duration_minutes: defaultSlotDuration,
    }));
    
    setDays(updatedDays);
    
    toast({
      title: "Applied to All Days",
      description: `Set ${defaultSlotDuration} minute slots for all days.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-end gap-4 pb-6 border-b">
          <div className="w-full sm:w-1/3 space-y-2">
            <Label htmlFor="default-slot-duration">Default Appointment Duration</Label>
            <Select
              value={defaultSlotDuration.toString()}
              onValueChange={(value) => setDefaultSlotDuration(parseInt(value))}
            >
              <SelectTrigger id="default-slot-duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleApplyToAll}>
            Apply to All Days
          </Button>
        </div>

        {days.map((day, index) => (
          <div key={day.day_name} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b last:border-0">
            <div className="md:col-span-3 flex items-center space-x-2">
              <Checkbox 
                id={`day-${index}`}
                checked={day.is_active}
                onCheckedChange={(checked) => handleDayChange(index, "is_active", checked)}
              />
              <Label htmlFor={`day-${index}`} className="font-medium">
                {day.day_name}
              </Label>
            </div>
            
            <div className="md:col-span-3 space-y-1">
              <Label htmlFor={`start-time-${index}`} className="text-sm">
                Start Time
              </Label>
              <Input
                id={`start-time-${index}`}
                type="time"
                value={day.start_time}
                onChange={(e) => handleDayChange(index, "start_time", e.target.value)}
                disabled={!day.is_active}
              />
            </div>
            
            <div className="md:col-span-3 space-y-1">
              <Label htmlFor={`end-time-${index}`} className="text-sm">
                End Time
              </Label>
              <Input
                id={`end-time-${index}`}
                type="time"
                value={day.end_time}
                onChange={(e) => handleDayChange(index, "end_time", e.target.value)}
                disabled={!day.is_active}
              />
            </div>
            
            <div className="md:col-span-3 space-y-1">
              <Label htmlFor={`duration-${index}`} className="text-sm">
                Slot Duration
              </Label>
              <Select
                value={day.slot_duration_minutes.toString()}
                onValueChange={(value) => handleDayChange(index, "slot_duration_minutes", parseInt(value))}
                disabled={!day.is_active}
              >
                <SelectTrigger id={`duration-${index}`}>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        
        <div className="pt-4 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AvailabilitySettings;
