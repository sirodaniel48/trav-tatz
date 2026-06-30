import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const supabase = getServiceRoleClient();
    
    const { data, error } = await supabase
      .from("settings")
      .update({
        time_slots: body.time_slots,
        deposit_amount: body.deposit_amount,
        updated_at: new Date().toISOString()
      })
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, settings: data });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
