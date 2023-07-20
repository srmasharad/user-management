import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const bucketUrl = `${supabaseUrl}/storage/v1/object/public/avatars`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
