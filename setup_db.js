const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
          id text PRIMARY KEY,
          name text NOT NULL,
          icon text NOT NULL,
          description text NOT NULL,
          deposit integer NOT NULL,
          order_index integer NOT NULL,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
      );
    `);
    console.log('Created services table');
    
    const countRes = await client.query('SELECT count(*) FROM services');
    if (parseInt(countRes.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO services (id, name, icon, description, deposit, order_index) VALUES
        ('tattoo_appt', 'Tattoo Appointment', 'Scissors', 'Starts at $150. Pricing depends on detail.', 35, 1),
        ('quarter_sleeve', 'Quarter Sleeve', 'Scissors', 'Starts at $385. Pricing depends on detail.', 35, 2),
        ('half_sleeve', 'Half Sleeve', 'Scissors', 'Starts at $875. Pricing depends on detail.', 55, 3),
        ('cover_up', 'Cover Up', 'Scissors', 'Starts at $425. Requires more time/attention.', 75, 4),
        ('spine', 'Spine Tattoo', 'Scissors', 'Starts at $300. Pricing depends on detail.', 35, 5),
        ('full_sleeve', 'Full Sleeve', 'Scissors', '5 hours. $3,500 Total.', 35, 6),
        ('eyebrows', 'Eyebrow Services', 'Sparkles', 'Starts at $300. Premium eyebrow shaping.', 150, 7);
      `);
      console.log('Inserted default services');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
