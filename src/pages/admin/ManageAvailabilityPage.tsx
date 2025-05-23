
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import AvailabilitySettings from "@/components/admin/AvailabilitySettings";
import BlockTimeForm from "@/components/admin/BlockTimeForm";
import BlockedTimeList from "@/components/admin/BlockedTimeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ManageAvailabilityPage() {
  return (
    <AuthGuard adminOnly>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Manage Your Availability</h1>
            
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
                <TabsTrigger value="blocks">Block Time Off</TabsTrigger>
              </TabsList>
              <TabsContent value="schedule">
                <AvailabilitySettings />
              </TabsContent>
              <TabsContent value="blocks">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BlockTimeForm />
                  <BlockedTimeList />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

export default ManageAvailabilityPage;
