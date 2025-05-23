
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nfnwdplwxwjzrosbkgny.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mbndkcGx3eHdqenJvc2JrZ255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDM2NjYsImV4cCI6MjA2MzU3OTY2Nn0.TDc0EzQ75EmQl8Y0p1Cpue_GOLr0ADZMmkLl0CDcaKw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
  }
});
