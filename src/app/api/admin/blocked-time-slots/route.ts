import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // optional filter by date

    const supabase = getServiceRoleClient();
    
    let query = supabase.from("blocked_time_slots").select("*").order("date", { ascending: true });
    if (date) {
      query = query.eq("date", date);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { date, time_slot, reason } = await req.json();

    if (!date || !time_slot) {
      return NextResponse.json({ error: "Date and time slot are required" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("blocked_time_slots")
      .insert([{ date, time_slot, reason }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.code === '23505') { // unique constraint violation
      return NextResponse.json({ error: "This time slot is already blocked on this date" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();
    const { error } = await supabase.from("blocked_time_slots").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
