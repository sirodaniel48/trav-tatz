import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import * as jose from "jose";

export const dynamic = "force-dynamic";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jose.jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = getServiceRoleClient();
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const services = await request.json();
    const supabaseAdmin = getServiceRoleClient();
    
    // Simple batch update
    for (const service of services) {
      const { error } = await supabaseAdmin
        .from("services")
        .update({ 
          description: service.description,
          deposit: service.deposit,
          updated_at: new Date().toISOString()
        })
        .eq("id", service.id);
        
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update services error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
