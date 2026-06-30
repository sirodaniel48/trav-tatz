import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface OwnerNotificationProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  serviceDetail: string | null;
  appointmentAt: string;
  adminUrl: string;
}

export default function OwnerNotification({
  clientName,
  clientEmail,
  clientPhone,
  serviceType,
  serviceDetail,
  appointmentAt,
  adminUrl,
}: OwnerNotificationProps) {
  const dateStr = new Date(appointmentAt).toLocaleString();

  return (
    <Html>
      <Head />
      <Preview>New Booking: {serviceType} for {clientName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Booking Alert</Heading>
          
          <Section style={detailsSection}>
            <Text style={text}><strong>Client:</strong> {clientName}</Text>
            <Text style={text}><strong>Email:</strong> {clientEmail}</Text>
            <Text style={text}><strong>Phone:</strong> {clientPhone}</Text>
            <Text style={text}><strong>Service:</strong> {serviceType}</Text>
            <Text style={text}><strong>Date:</strong> {dateStr}</Text>
            <Text style={text}>
              <strong>Details:</strong> {serviceDetail || "None provided"}
            </Text>
          </Section>

          <Link href={adminUrl} style={button}>
            View in Admin Dashboard
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const h1 = {
  color: "#0A0A0A",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 10px",
};

const detailsSection = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  borderLeft: "4px solid #C9A84C",
  margin: "20px 0",
};

const button = {
  backgroundColor: "#0A0A0A",
  color: "#ffffff",
  padding: "12px 20px",
  textDecoration: "none",
  display: "inline-block",
  fontWeight: "bold",
  marginTop: "20px",
};
