
import MainLayout from "@/components/layout/MainLayout";
import SignUpForm from "@/components/auth/SignUpForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function SignUpPage() {
  const { user, isLoading } = useAuth();
  
  // If user is already logged in, redirect to home
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <SignUpForm />
        </div>
      </div>
    </MainLayout>
  );
}

export default SignUpPage;
