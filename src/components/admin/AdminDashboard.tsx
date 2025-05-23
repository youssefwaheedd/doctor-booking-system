
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppointmentList from "../appointments/AppointmentList";

interface Stats {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalCount: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    totalCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Current date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // One week ago from today
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // One month ago from today
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        // Tomorrow at midnight
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Get today's appointments
        const { data: todayData, error: todayError, count: todayCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('admin_user_id', user.id)
          .gte('start_datetime', today.toISOString())
          .lt('start_datetime', tomorrow.toISOString());
          
        if (todayError) throw todayError;
        
        // Get this week's appointments
        const { data: weekData, error: weekError, count: weekCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('admin_user_id', user.id)
          .gte('start_datetime', oneWeekAgo.toISOString())
          .lt('start_datetime', tomorrow.toISOString());
          
        if (weekError) throw weekError;
        
        // Get this month's appointments
        const { data: monthData, error: monthError, count: monthCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('admin_user_id', user.id)
          .gte('start_datetime', oneMonthAgo.toISOString())
          .lt('start_datetime', tomorrow.toISOString());
          
        if (monthError) throw monthError;
        
        // Get total appointments
        const { data: totalData, error: totalError, count: totalCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('admin_user_id', user.id);
          
        if (totalError) throw totalError;
        
        setStats({
          todayCount: todayCount || 0,
          weekCount: weekCount || 0,
          monthCount: monthCount || 0,
          totalCount: totalCount || 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Today's Appointments" 
          value={stats.todayCount} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="This Week" 
          value={stats.weekCount} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="This Month" 
          value={stats.monthCount} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Total Appointments" 
          value={stats.totalCount} 
          isLoading={isLoading} 
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <AppointmentList showPatientInfo onlyToday />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  isLoading: boolean;
}

function StatCard({ title, value, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminDashboard;
