import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { z } from "zod";

const bookingSchema = z.object({
  service_type: z.enum(["tattoo_appt", "quarter_sleeve", "half_sleeve", "cover_up", "spine", "full_sleeve"]),
  client_name: z.string().min(1, "Name is required"),
  client_email: z.string().email("Invalid email"),
  client_phone: z.string().min(1, "Phone is required"),
  service_detail: z.string().optional(),
  reference_image_url: z.string().url().optional().or(z.literal("")),
  appointment_at: z.string().datetime(), // ISO 8601 string
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = bookingSchema.parse(body);

    const supabase = getServiceRoleClient();

    // Insert into Supabase
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        service_type: validatedData.service_type,
        client_name: validatedData.client_name,
        client_email: validatedData.client_email,
        client_phone: validatedData.client_phone,
        service_detail: validatedData.service_detail,
        reference_image_url: validatedData.reference_image_url || null,
        appointment_at: validatedData.appointment_at,
        status: "pending",
        deposit_paid: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    return NextResponse.json({ bookingId: data.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Booking API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
