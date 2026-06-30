import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.from("blocked_dates").select("date");
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
