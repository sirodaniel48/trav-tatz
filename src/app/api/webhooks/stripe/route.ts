import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceRoleClient } from "@/lib/supabase";
import { Resend } from "resend";
import { headers } from "next/headers";
import { render } from "@react-email/render";
import ClientConfirmation from "@/emails/ClientConfirmation";
import OwnerNotification from "@/emails/OwnerNotification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10" as any,
});
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      const supabase = getServiceRoleClient();
      
      // Update booking status
      const { data: booking, error } = await supabase
        .from("bookings")
        .update({
          deposit_paid: true,
          status: "confirmed",
          stripe_session_id: session.id,
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (error || !booking) {
        console.error("Error updating booking:", error);
      } else {
        // Send emails
        try {
          const clientHtml = await render(
            ClientConfirmation({
              clientName: booking.client_name,
              serviceType: booking.service_type,
              appointmentAt: booking.appointment_at
            })
          );

          const ownerHtml = await render(
            OwnerNotification({
              clientName: booking.client_name,
              clientEmail: booking.client_email,
              clientPhone: booking.client_phone,
              serviceType: booking.service_type,
              serviceDetail: booking.service_detail,
              appointmentAt: booking.appointment_at,
              adminUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/appointments`
            })
          );

          await Promise.all([
            // Client email
            resend.emails.send({
              from: process.env.EMAIL_FROM || "bookings@travtatz.com",
              to: booking.client_email,
              subject: "Your Trav-Tatz Appointment is Confirmed",
              html: clientHtml,
            }),
            // Owner email
            resend.emails.send({
              from: process.env.EMAIL_FROM || "bookings@travtatz.com",
              to: process.env.OWNER_EMAIL || "owner@travtatz.com",
              subject: `New Booking — ${booking.service_type}`,
              html: ownerHtml,
            })
          ]);
        } catch (emailError) {
          console.error("Error sending emails:", emailError);
        }
      }
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
