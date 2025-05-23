
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to DocBook</h1>
          <p className="text-xl text-gray-600 mb-12">
            The easiest way to book your doctor appointments
          </p>

          {/* Main features cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Book Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Easily book appointments for your medical needs with our simple booking system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Your Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  View and manage all your upcoming appointments in one place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simple & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your information is always secure and your schedule is always up to date.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA section */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : !user ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Get Started Today</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" onClick={() => navigate("/auth/signup")}>
                    Sign Up
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/auth/signin")}>
                    Sign In
                  </Button>
                </div>
              </div>
            ) : isAdmin ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Doctor Dashboard</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" onClick={() => navigate("/admin/dashboard")}>
                    Go to Dashboard
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/admin/availability")}>
                    Manage Availability
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/admin/appointments")}>
                    View Appointments
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Patient Portal</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" onClick={() => navigate("/patient/book")}>
                    Book an Appointment
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/patient/appointments")}>
                    Manage Your Appointments
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default HomePage;
