
import MainLayout from "@/components/layout/MainLayout";
import AppointmentList from "@/components/appointments/AppointmentList";
import AuthGuard from "@/components/auth/AuthGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ManageAppointmentsPage() {
  return (
    <AuthGuard adminOnly>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Manage Appointments</h1>
            
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="all">All Appointments</TabsTrigger>
              </TabsList>
              <TabsContent value="today">
                <AppointmentList showPatientInfo onlyToday />
              </TabsContent>
              <TabsContent value="upcoming">
                <AppointmentList showPatientInfo onlyUpcoming />
              </TabsContent>
              <TabsContent value="all">
                <AppointmentList showPatientInfo />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

export default ManageAppointmentsPage;
