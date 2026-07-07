import pg from 'pg';

// Using the same password as the old database to check if it's the same
const connectionString = 'postgresql://postgres.kfrrndpuxmtnoeznaeee:r695I8IrEv6iJD7m@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

try {
  await client.connect();
  console.log('Successfully connected to the new database!');
  
  // Alter table to add theme_name column
  await client.query("ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS theme_name text DEFAULT 'obsidian-gold'");
  console.log('Successfully added theme_name column to public.site_settings!');
  
  const res = await client.query("SELECT id, theme_name FROM public.site_settings WHERE id = 1");
  console.log('Query result:', res.rows[0]);
} catch (err) {
  console.error('Operation failed:', err.message);
} finally {
  await client.end();
}
