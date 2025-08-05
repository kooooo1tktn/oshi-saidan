import { createClient } from "@supabase/supabase-js";

// データベースとの通信用に単一のSupabaseクライアントを作成します。
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);
