import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://rltjwjafntmimoinohne.supabase.co';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdGp3amFmbnRtaW1vaW5vaG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5Mjc1MjcsImV4cCI6MjA3NjUwMzUyN30.o7eTQJf_jePxsUtg5nykl21QwSERez1RFnioMW09RAA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
