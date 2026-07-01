import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceRoleClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10" as any, // specify the api version compatible with your types
});

const DEPOSITS: Record<string, number> = {
  tattoo_appt: 3500,
  quarter_sleeve: 3500,
  half_sleeve: 5500,
  cover_up: 7500,
  spine: 3500,
  full_sleeve: 3500,
};

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Get booking details to populate customer email
    const supabase = getServiceRoleClient();
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Default to 3500 if the service_type doesn't match our exact keys for some reason
    const depositAmountCents = DEPOSITS[booking.service_type] || 3500;

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "https://booking.browinkconnect.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: booking.client_email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Deposit for ${booking.service_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Appointment`,
              description: `Booking for ${new Date(booking.appointment_at).toLocaleString()}`,
            },
            unit_amount: depositAmountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },
      success_url: `${origin}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
