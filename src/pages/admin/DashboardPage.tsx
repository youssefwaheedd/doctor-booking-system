
import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AuthGuard from "@/components/auth/AuthGuard";

export function DashboardPage() {
  return (
    <AuthGuard adminOnly>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <AdminDashboard />
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

export default DashboardPage;
