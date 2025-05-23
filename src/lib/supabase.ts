
import { supabase } from '@/integrations/supabase/client';

// Clean up any lingering auth state before signin/signup operations
export const cleanupAuthState = () => {
  localStorage.removeItem('supabase.auth.token');
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return {
    ...user,
    ...profile
  };
};

export async function signUp(email: string, password: string, fullName: string) {
  // Clean up existing state
  cleanupAuthState();
  
  // Try global sign out
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (err) {
    // Continue if this fails
  }
  
  // Patient registration only (no admin registration as per requirements)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  // Clean up existing state
  cleanupAuthState();
  
  // Try global sign out
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (err) {
    // Continue if this fails
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  // Clean up first
  cleanupAuthState();
  
  // Global sign out
  const { error } = await supabase.auth.signOut({ scope: 'global' });
  
  if (error) {
    throw error;
  }
  
  // Force page reload for clean state
  window.location.href = '/auth/signin';
}

// Re-export supabase for convenience
export { supabase };
