import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ClientConfirmationProps {
  clientName: string;
  serviceType: string;
  appointmentAt: string;
}

export default function ClientConfirmation({
  clientName,
  serviceType,
  appointmentAt,
}: ClientConfirmationProps) {
  const dateStr = new Date(appointmentAt).toLocaleString();

  return (
    <Html>
      <Head />
      <Preview>Your DESINKS Appointment is Confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're Booked, {clientName}!</Heading>
          
          <Text style={text}>
            Thank you for booking with DESINKS. Your appointment details are below.
          </Text>

          <Section style={detailsSection}>
            <Text style={text}><strong>Service:</strong> {serviceType}</Text>
            <Text style={text}><strong>Date & Time:</strong> {dateStr}</Text>
            <Text style={text}><strong>Deposit Paid:</strong> Yes ($35.00)</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h3" style={h3}>Cancellation Policy Reminder ‼️</Heading>
            <Text style={text}>
              When booking, ALL APPOINTMENTS REQUIRE a $35 deposit. This WILL GO TOWARDS your tattoo.
            </Text>
            <Text style={text}>
              If you do not cancel within 24 hours of your scheduled appointment time YOUR DEPOSIT IS NON REFUNDABLE. This means, if you schedule a future appointment you WILL NEED TO SEND A NEW DEPOSIT. 
            </Text>
            <Text style={text}>
              <strong>Need to cancel?</strong> Please contact us at least 24 hours in advance at <strong>bookings@travtatz.com</strong>.
            </Text>
          </Section>
          
          <Text style={footer}>
            Thank you for all the love & support, & most importantly for trusting me for your tattoo needs!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0A0A0A",
  fontFamily: "sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#141414",
  border: "1px solid #2A2A2A",
  borderRadius: "0px", // sharp corners as per design
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const h1 = {
  color: "#C9A84C",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
  fontFamily: "serif",
};

const h3 = {
  color: "#C0392B",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px",
};

const text = {
  color: "#E8D5A3",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 10px",
};

const detailsSection = {
  backgroundColor: "#0A0A0A",
  padding: "15px",
  borderLeft: "4px solid #C9A84C",
  margin: "20px 0",
};

const hr = {
  borderColor: "#2A2A2A",
  margin: "20px 0",
};

const footer = {
  color: "#E8D5A3",
  fontSize: "14px",
  fontStyle: "italic",
  marginTop: "20px",
  opacity: 0.8,
};
