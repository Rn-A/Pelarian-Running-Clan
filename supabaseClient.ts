
import { createClient } from '@supabase/supabase-js';

// Deteksi variabel environment dari Vite
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Gunakan URL dummy yang valid formatnya jika env kosong agar tidak crash saat inisialisasi
const finalUrl = supabaseUrl && supabaseUrl !== "" && !supabaseUrl.includes('placeholder') 
  ? supabaseUrl 
  : 'https://placeholder-project.supabase.co';

const finalKey = supabaseAnonKey && supabaseAnonKey !== "" && !supabaseAnonKey.includes('placeholder')
  ? supabaseAnonKey
  : 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);

// Log peringatan hanya di console untuk debugging
if (finalUrl.includes('placeholder')) {
  console.warn("Supabase belum terkonfigurasi. Menggunakan data lokal (Initial Data).");
}
