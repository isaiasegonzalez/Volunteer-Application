import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: "./.env.local" });

console.log("DEBUG - SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("DEBUG - SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("❌ Environment variables not loaded! Check .env.local file.");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "jasonvu@gmail.com",
    password: "1234Five!",
  });

  if (error) {
    console.error("Login failed:", error.message);
  } else {
    console.log("✅ Login successful:", data);
  }
}

login();
