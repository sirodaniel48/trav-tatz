require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

const sql = `
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY CHECK (id = 1),
  time_slots text[] NOT NULL,
  deposit_amount numeric NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Insert defaults if not exists
INSERT INTO settings (id, time_slots, deposit_amount)
VALUES (1, ARRAY['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'], 35.00)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);
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
    console.log("Running settings schema migration...");
    await client.query(sql);
    console.log("Settings table created successfully!");
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

main();
