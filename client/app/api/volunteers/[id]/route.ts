import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

// Get a Single Event by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ volunteer: data }, { status: 200 });
}
