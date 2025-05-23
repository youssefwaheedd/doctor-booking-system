
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AppointmentFormProps {
  selectedDate: Date;
  selectedStartTime: Date | null;
  selectedEndTime: Date | null;
  adminId: string | null;
  onReset: () => void;
}

export function AppointmentForm({ 
  selectedDate, 
  selectedStartTime, 
  selectedEndTime, 
  adminId,
  onReset 
}: AppointmentFormProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedStartTime || !selectedEndTime || !adminId) {
      toast({
        title: "Error",
        description: "Missing required information for booking.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the appointment
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_user_id: user.id,
          admin_user_id: adminId,
          start_datetime: selectedStartTime.toISOString(),
          end_datetime: selectedEndTime.toISOString(),
          reason_for_visit: reason || null,
          status: 'booked'
        });
        
      if (error) throw error;
      
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully booked!",
      });
      
      // Reset the form and navigate to the appointments page
      onReset();
      navigate('/patient/appointments');
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "There was a problem booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Your Appointment</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="font-semibold">Date</p>
            <p>{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
          </div>
          
          {selectedStartTime && selectedEndTime && (
            <div className="space-y-2">
              <p className="font-semibold">Time</p>
              <p>{format(selectedStartTime, "h:mm a")} - {format(selectedEndTime, "h:mm a")}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="font-semibold">Reason for Visit (Optional)</p>
            <Textarea
              placeholder="Please briefly describe the reason for your visit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="pt-4 flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onReset} 
              disabled={isSubmitting}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting || !selectedStartTime || !selectedEndTime || !adminId}
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AppointmentForm;
