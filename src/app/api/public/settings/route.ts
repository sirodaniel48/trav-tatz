import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
