
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import BookAppointmentPage from "./pages/patient/BookAppointmentPage";
import AppointmentsPage from "./pages/patient/AppointmentsPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ManageAvailabilityPage from "./pages/admin/ManageAvailabilityPage";
import ManageAppointmentsPage from "./pages/admin/ManageAppointmentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Auth Routes */}
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            
            {/* Patient Routes */}
            <Route path="/patient/book" element={<BookAppointmentPage />} />
            <Route path="/patient/appointments" element={<AppointmentsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/availability" element={<ManageAvailabilityPage />} />
            <Route path="/admin/appointments" element={<ManageAppointmentsPage />} />
            
            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
