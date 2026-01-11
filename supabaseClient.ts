import { createClient } from "@supabase/supabase-js";

/**
 * Kami menggunakan @ts-ignore karena tsc (TypeScript Compiler) terkadang gagal
 * mengenali environment variables Vite di lingkungan CI/CD seperti Vercel
 * meskipun types sudah dikonfigurasi.
 */

// @ts-ignore
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Fallback jika env tidak ditemukan agar aplikasi tidak crash
const finalUrl =
  supabaseUrl && supabaseUrl !== "" && !supabaseUrl.includes("placeholder")
    ? supabaseUrl
    : "https://placeholder-project.supabase.co";

const finalKey =
  supabaseAnonKey &&
  supabaseAnonKey !== "" &&
  !supabaseAnonKey.includes("placeholder")
    ? supabaseAnonKey
    : "placeholder-key";

export const supabase = createClient(finalUrl, finalKey);

if (finalUrl.includes("placeholder")) {
  console.warn(
    "PERHATIAN: VITE_SUPABASE_URL tidak terbaca. Pastikan sudah input di Vercel Dashboard > Settings > Environment Variables."
  );
}
