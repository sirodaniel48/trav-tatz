require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

const sql = `
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  service_type text NOT NULL CHECK (service_type IN ('tattoo', 'lashes', 'eyebrows')),
  service_detail text,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  appointment_at timestamptz NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  deposit_paid boolean DEFAULT false,
  stripe_session_id text,
  notes text
);

CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cloudinary_id text NOT NULL,
  url text NOT NULL,
  category text NOT NULL CHECK (category IN ('tattoo', 'lashes', 'eyebrows')),
  caption text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Note: RLS policies are usually best setup in the Supabase UI for fine-grained control, 
-- but we can enable RLS on these tables at least.
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gallery_images
CREATE POLICY "Public read access for gallery images" ON gallery_images FOR SELECT USING (true);
`;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No DATABASE_URL found in .env.local");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
  });

  try {
    console.log("Connecting to Supabase...");
    await client.connect();
    console.log("Running schema migrations...");
    await client.query(sql);
    console.log("Database schema created successfully!");
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

main();
