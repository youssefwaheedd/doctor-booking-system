
import MainLayout from "@/components/layout/MainLayout";
import SignInForm from "@/components/auth/SignInForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function SignInPage() {
  const { user, isLoading } = useAuth();
  
  // If user is already logged in, redirect to home
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <SignInForm />
        </div>
      </div>
    </MainLayout>
  );
}

export default SignInPage;
