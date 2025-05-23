
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface BlockedPeriod {
  id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string | null;
}

export function BlockedTimeList() {
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlockedPeriods = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('blocked_periods')
          .select('*')
          .eq('admin_user_id', user.id)
          .gte('end_datetime', new Date().toISOString())
          .order('start_datetime', { ascending: true });
          
        if (error) throw error;
        
        setBlockedPeriods(data || []);
      } catch (error) {
        console.error('Error fetching blocked periods:', error);
        toast({
          title: "Error",
          description: "Failed to load blocked time periods. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlockedPeriods();
  }, [user, toast]);

  const handleRemoveBlock = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('blocked_periods')
        .delete()
        .eq('id', blockId);
        
      if (error) throw error;
      
      // Update local state
      setBlockedPeriods(blockedPeriods.filter(block => block.id !== blockId));
      
      toast({
        title: "Block Removed",
        description: "The time block has been successfully removed.",
      });
    } catch (error) {
      console.error('Error removing time block:', error);
      toast({
        title: "Error",
        description: "Failed to remove time block. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Blocked Time Periods</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-4 border-medical-500 rounded-full border-t-transparent"></div>
          </div>
        ) : blockedPeriods.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No upcoming blocked time periods.
          </p>
        ) : (
          <div className="space-y-4">
            {blockedPeriods.map((block) => (
              <div 
                key={block.id} 
                className="border rounded-md p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {format(parseISO(block.start_datetime), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(block.start_datetime), "h:mm a")} - {format(parseISO(block.end_datetime), "h:mm a")}
                    </p>
                  </div>
                </div>
                
                {block.reason && (
                  <p className="text-sm">
                    <span className="font-semibold">Reason:</span> {block.reason}
                  </p>
                )}
                
                <div className="flex justify-end pt-2">
                  <Button 
                    variant="outline" 
                    className="text-destructive" 
                    onClick={() => handleRemoveBlock(block.id)}
                  >
                    Remove Block
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BlockedTimeList;
