import { createClient } from "@supabase/supabase-js";
import { runtimeConfig } from "./runtimeConfig";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || runtimeConfig.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || runtimeConfig.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env or runtime env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
