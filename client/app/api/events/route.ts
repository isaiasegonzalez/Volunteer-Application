import  supabase  from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Gets All Events
export async function GET() {
    const { data, error } = await supabase.from('events').select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ events: data }, { status: 200 });
}

//Create a New Event
export async function POST(req: Request) {
    const { title, description, location, requiredSkills, urgency, date } = await req.json();

    const { data, error } = await supabase.from('events').insert([
        {
            title,
            description,
            location,
            required_skills: requiredSkills, // Stored as JSONB
            urgency,
            date,
        },
    ]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ event: data }, { status: 201 });
}

