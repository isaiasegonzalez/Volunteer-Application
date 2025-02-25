import  supabase  from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Get a Single Event by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { data, error } = await supabase.from('events').select('*').eq('id', params.id).single();

    if (error) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: data }, { status: 200 });
}

// Update an Event by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;  // Ensure `id` is accessed correctly

    if (!id) {
        return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const { title, description, location, requiredSkills, urgency, date } = await req.json();

    // Convert requiredSkills to JSONB format
    const updatedEvent = {
        title,
        description,
        location,
        required_skills: requiredSkills ? JSON.stringify(requiredSkills) : null, // Convert array to JSONB format
        urgency,
        date,
    };

    const { data, error } = await supabase
        .from("events")
        .update(updatedEvent)
        .eq("id", id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ event: data }, { status: 200 });
}

// Delete an Event by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;  // Ensure params is awaited

    if (!id) {
        return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
}

