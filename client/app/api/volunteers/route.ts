import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

// Get All Profiles
export async function GET() {
  const { data, error } = await supabase.from("profile").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ volunteers: data }, { status: 200 });
}
