/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

/**
 * Menggunakan casting ke 'any' untuk mematikan pengecekan tipe pada import.meta.env.
 * Ini adalah solusi paling stabil untuk deployment di Vercel yang menggunakan Vite + TypeScript.
 */
const env = (import.meta as any).env || {};

// Mengambil URL dari env, jika tidak ada gunakan URL yang Anda berikan sebagai fallback
const supabaseUrl =
  env.VITE_SUPABASE_URL || "https://zwbpwcyoljhebvuhblmc.supabase.co";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "";

// Fallback dummy key agar tidak crash jika env benar-benar kosong saat inisialisasi awal
const finalKey =
  supabaseAnonKey && supabaseAnonKey !== ""
    ? supabaseAnonKey
    : "placeholder-key";

export const supabase = createClient(supabaseUrl, finalKey);

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "PERHATIAN: Variabel lingkungan Supabase tidak terdeteksi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diisi di Vercel Dashboard."
  );
}
