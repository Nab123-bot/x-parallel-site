export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabasePublishableKey = supabaseAnonKey;

// 🔒 Vérification (optionnelle mais utile)
if (!supabaseUrl) {
  throw new Error("❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
}

if (!supabaseAnonKey) {
  throw new Error("❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
}

// ❌ Sécurité : bloquer clé secrète
if (supabaseAnonKey.startsWith("sb_secret_")) {
  throw new Error("❌ Do NOT use secret key in frontend. Use anon key.");
}
