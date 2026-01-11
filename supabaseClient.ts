/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

/**
 * Menggunakan casting ke 'any' sementara untuk menghindari error TS2339 pada lingkungan build
 * yang tidak memuat global types Vite dengan sempurna.
 */
const metaEnv = (import.meta as any).env;

const supabaseUrl = metaEnv?.VITE_SUPABASE_URL;
const supabaseAnonKey = metaEnv?.VITE_SUPABASE_ANON_KEY;

// Gunakan URL dummy yang valid formatnya jika env kosong agar tidak crash saat inisialisasi
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

// Log peringatan hanya di console untuk debugging
if (finalUrl.includes("placeholder")) {
  console.warn(
    "Supabase belum terkonfigurasi atau env tidak terbaca. Pastikan variabel VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diatur di Vercel Dashboard."
  );
}
