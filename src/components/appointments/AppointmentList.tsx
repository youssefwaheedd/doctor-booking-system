
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AppointmentListProps {
  showPatientInfo?: boolean;
  onlyUpcoming?: boolean;
  onlyToday?: boolean;
}

interface Appointment {
  id: string;
  start_datetime: string;
  end_datetime: string;
  reason_for_visit: string | null;
  status: 'booked' | 'cancelled_by_patient' | 'cancelled_by_admin' | 'completed';
  patient?: {
    full_name: string;
  };
  admin?: {
    full_name: string;
  };
}

export function AppointmentList({ showPatientInfo = false, onlyUpcoming = false, onlyToday = false }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        let query = supabase
          .from('appointments')
          .select(`
            id,
            start_datetime,
            end_datetime,
            reason_for_visit,
            status,
            patient:profiles!patient_user_id (full_name),
            admin:profiles!admin_user_id (full_name)
          `);
        
        // Filter by user role
        if (isAdmin) {
          query = query.eq('admin_user_id', user.id);
        } else {
          query = query.eq('patient_user_id', user.id);
        }
        
        // Filter by date if needed
        if (onlyUpcoming) {
          query = query.gte('start_datetime', new Date().toISOString());
        }
        
        if (onlyToday) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          query = query
            .gte('start_datetime', today.toISOString())
            .lt('start_datetime', tomorrow.toISOString());
        }
        
        // Order by date
        query = query.order('start_datetime', { ascending: true });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform the data to match the Appointment interface
        const formattedAppointments = data?.map(item => ({
          id: item.id,
          start_datetime: item.start_datetime,
          end_datetime: item.end_datetime,
          reason_for_visit: item.reason_for_visit,
          status: item.status as 'booked' | 'cancelled_by_patient' | 'cancelled_by_admin' | 'completed',
          patient: item.patient,
          admin: item.admin
        })) || [];
        
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user, isAdmin, onlyUpcoming, onlyToday, toast]);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const status = isAdmin ? 'cancelled_by_admin' : 'cancelled_by_patient';
      
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);
        
      if (error) throw error;
      
      // Update local state
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status } : appt
      ));
      
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been successfully cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel the appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    if (!isAdmin) return;
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointmentId);
        
      if (error) throw error;
      
      // Update local state
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status: 'completed' } : appt
      ));
      
      toast({
        title: "Appointment Completed",
        description: "The appointment has been marked as completed.",
      });
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast({
        title: "Error",
        description: "Failed to complete the appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-blue-500">Booked</Badge>;
      case 'cancelled_by_patient':
        return <Badge variant="destructive">Cancelled by Patient</Badge>;
      case 'cancelled_by_admin':
        return <Badge variant="destructive">Cancelled by Doctor</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Check if an appointment is upcoming and not cancelled
  const isUpcomingAndActive = (appointment: Appointment) => {
    return (
      appointment.status === 'booked' && 
      new Date(appointment.start_datetime) > new Date()
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {onlyToday ? "Today's Appointments" : "Your Appointments"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No appointments found.
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="border rounded-md p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {format(parseISO(appointment.start_datetime), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(appointment.start_datetime), "h:mm a")} - {format(parseISO(appointment.end_datetime), "h:mm a")}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
                
                {showPatientInfo && appointment.patient && (
                  <p className="text-sm">
                    <span className="font-semibold">Patient:</span> {appointment.patient.full_name}
                  </p>
                )}
                
                {!showPatientInfo && appointment.admin && (
                  <p className="text-sm">
                    <span className="font-semibold">Doctor:</span> {appointment.admin.full_name}
                  </p>
                )}
                
                {appointment.reason_for_visit && (
                  <p className="text-sm">
                    <span className="font-semibold">Reason:</span> {appointment.reason_for_visit}
                  </p>
                )}
                
                {isUpcomingAndActive(appointment) && (
                  <div className="flex justify-end pt-2">
                    <Button 
                      variant="outline" 
                      className="text-destructive" 
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </Button>
                    
                    {isAdmin && (
                      <Button 
                        className="ml-2" 
                        onClick={() => handleCompleteAppointment(appointment.id)}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AppointmentList;
