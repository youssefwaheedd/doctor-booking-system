import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
  adminOnly?: boolean;
  patientOnly?: boolean;
}

export default function AuthGuard({ children, adminOnly = false, patientOnly = false }: AuthGuardProps) {
  const { user, isLoading, isAdmin, isPatient } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to sign in
  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  // If admin only and user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If patient only and user is not patient
  if (patientOnly && !isPatient) {
    return <Navigate to="/" replace />;
  }

  // Otherwise render children
  return <>{children}</>;
}
