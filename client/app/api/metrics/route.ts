import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*");

    if (eventsError) throw eventsError;

    const { data: volunteerEvents, error: volError } = await supabase
      .from("volunteer_events")
      .select("user_id");

    if (volError) throw volError;

    const totalEvents = events.length;

    const activeVolunteers = new Set(volunteerEvents.map(v => v.user_id)).size;


    const hoursDonated = volunteerEvents.length;

    const engagementRate = Math.min(
      100,
      Math.round((activeVolunteers / (totalEvents || 1)) * 100)
    );

    return NextResponse.json({
      totalEvents,
      activeVolunteers,
      hoursDonated,
      engagementRate,
    });
  } catch (error: any) {
    console.error("Supabase metrics error:", error.message || error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}

