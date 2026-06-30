import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();
    
    // Get all blocked time slots for this specific date
    const { data, error } = await supabase
      .from("blocked_time_slots")
      .select("time_slot")
      .eq("date", date);
      
    if (error) throw error;
    
    // Also, theoretically we should check if appointments already exist and block those times!
    // We can do that by checking the bookings table for confirmed/pending appointments on this date.
    
    // Construct start and end of day in UTC for the given date (assuming the studio is in local time, this can get complex, but we'll do simple string matching or date range)
    // To be safe, we just fetch bookings that cast to this date.
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("appointment_at")
      .in("status", ["pending", "confirmed"])
      .gte("appointment_at", `${date}T00:00:00Z`)
      .lte("appointment_at", `${date}T23:59:59Z`);
      
    if (bookingsError) throw bookingsError;

    // Convert booking times to slot strings (e.g., "10:00 AM")
    const bookedSlots = (bookingsData || []).map(b => {
      return new Date(b.appointment_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    });

    // Combine manual blocks and existing bookings
    const manualBlocks = (data || []).map(b => b.time_slot);
    const allBlockedSlots = [...new Set([...manualBlocks, ...bookedSlots])];
    
    return NextResponse.json(allBlockedSlots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
