import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Attempt to send the email
    const { error: emailError } = await resend.emails.send({
      from: "DESINKS <booking@travtatz.com>",
      to: booking.client_email,
      subject: `Booking Update: Your appointment is ${booking.status}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Booking Status: ${booking.status.toUpperCase()}</h2>
          <p>Hi ${booking.client_name},</p>
          <p>This is a manual confirmation that your appointment on ${new Date(booking.appointment_at).toLocaleString()} has been marked as <strong>${booking.status}</strong>.</p>
          <p>Service: ${booking.service_type}</p>
          <br/>
          <p>Thanks,<br/>DESINKS Studio</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error resending email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
