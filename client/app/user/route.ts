import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });
  
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, full_name, email, phone_number, profile_picture_url, role, bio, created_at")
    .eq("id", user?.id)
    .single();
  
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase.from("users").update(body).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}