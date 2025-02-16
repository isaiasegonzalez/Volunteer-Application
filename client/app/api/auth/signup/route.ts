import { NextResponse } from 'next/server';
import { supabase } from '@/supabaseClient';

// Correctly export the POST method
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User created successfully!', data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
