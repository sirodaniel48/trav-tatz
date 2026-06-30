import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

// GET all appointments
export async function GET(req: Request) {
  try {
    const supabase = getServiceRoleClient();
    
    // Parse query params for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    let query = supabase.from("bookings").select("*").order("appointment_at", { ascending: false });
    
    if (status && status !== "All Statuses") {
      query = query.eq("status", status.toLowerCase());
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH to update appointment status
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, booking: data });
  } catch (error: any) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
