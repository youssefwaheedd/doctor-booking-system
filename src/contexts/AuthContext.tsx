
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type UserRole = 'patient' | 'admin';

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
};

type AuthContextType = {
  session: Session | null;
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPatient: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            loadUserProfile(currentSession.user);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession) {
        loadUserProfile(currentSession.user);
      } else {
        setIsLoading(false);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadUserProfile(authUser: User) {
    try {
      setIsLoading(true);
      
      // Get the user's profile from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', authUser.id)
        .single();
      
      if (profileError) {
        console.error('Error loading user profile:', profileError);
        throw profileError;
      }
      
      // Create the combined user profile object
      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: profileData?.full_name,
        role: profileData?.role as UserRole || 'patient'
      };
      
      setUser(userProfile);
    } catch (error) {
      console.error('Error loading user:', error);
      // Clear any potentially corrupted state
      cleanupAuthState();
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    setUser(null);
    setSession(null);
  };

  const isAdmin = user?.role === 'admin';
  const isPatient = user?.role === 'patient';

  const value = {
    session,
    user,
    isLoading,
    isAdmin,
    isPatient,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
