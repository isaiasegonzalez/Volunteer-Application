import  supabase from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
}
