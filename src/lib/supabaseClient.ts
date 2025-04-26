import { createClient } from "@supabase/supabase-js";

// Carica le variabili di ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Crea il client di Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
