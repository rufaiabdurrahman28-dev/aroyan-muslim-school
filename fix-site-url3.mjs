import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.mfqxuddjomrobrcyczpf',
  password: 'Aroyanschools234',
  ssl: { rejectUnauthorized: false },
  statement_timeout: 15000,
  query_timeout: 15000,
  connectionTimeoutMillis: 10000,
});

await client.connect();
console.log('✅ Connected');

// In newer Supabase, the auth config is stored in the instances table
console.log('\n🔍 Checking auth.instances table...');
try {
  const result = await client.query('SELECT * FROM auth.instances;');
  console.log('Instances:', JSON.stringify(result.rows, null, 2));
} catch(e) {
  console.log('Error:', e.message.substring(0, 100));
}

// Try updating the instances table
console.log('\n🔧 Updating site_url in auth.instances...');
try {
  await client.query(`
    UPDATE auth.instances 
    SET raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{site_url}',
      '"https://my-project-eight-wheat.vercel.app"'::jsonb
    )
    WHERE id = '00000000-0000-0000-0000-000000000000';
  `);
  console.log('✅ Updated raw_app_meta_data');
} catch(e) {
  console.log('Update failed:', e.message.substring(0, 100));
}

// Check what columns instances has
console.log('\n🔍 Checking auth.instances columns...');
try {
  const cols = await client.query(`
    SELECT column_name, data_type FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'instances';
  `);
  console.log('Columns:', cols.rows);
} catch(e) {
  console.log('Error:', e.message.substring(0, 100));
}

await client.end();
console.log('Done!');
