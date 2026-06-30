import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.from("blocked_dates").select("*").order("date", { ascending: true });
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching blocked dates:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { date, reason } = await req.json();
    if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("blocked_dates")
      .insert([{ date, reason }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error adding blocked date:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const supabase = getServiceRoleClient();
    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting blocked date:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
