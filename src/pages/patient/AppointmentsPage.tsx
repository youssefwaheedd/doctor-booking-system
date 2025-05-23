
import MainLayout from "@/components/layout/MainLayout";
import AppointmentList from "@/components/appointments/AppointmentList";
import AuthGuard from "@/components/auth/AuthGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AppointmentsPage() {
  return (
    <AuthGuard patientOnly>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Appointments</h1>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="all">All Appointments</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                <AppointmentList onlyUpcoming />
              </TabsContent>
              <TabsContent value="all">
                <AppointmentList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

export default AppointmentsPage;
