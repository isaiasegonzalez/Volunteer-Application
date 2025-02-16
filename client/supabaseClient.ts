import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rxnlwyhypigbryqtiscv.supabase.co'; // Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bmx3eWh5cGlnYnJ5cXRpc2N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwOTU4NDUsImV4cCI6MjA1MzY3MTg0NX0.8uh_qZ9YUR8kneFtjgmID-dxzueOYxmr0a17PvRtSN0'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
