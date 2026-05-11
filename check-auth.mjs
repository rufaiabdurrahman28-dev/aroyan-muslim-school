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

// Check auth users
console.log('\n👥 Users in auth.users:');
const users = await client.query(`
  SELECT id, email, email_confirmed_at, created_at, 
         raw_app_meta_data, raw_user_meta_data
  FROM auth.users
  ORDER BY created_at DESC;
`);
users.rows.forEach(u => {
  console.log(`  Email: ${u.email}`);
  console.log(`  Confirmed: ${u.email_confirmed_at || 'NOT CONFIRMED'}`);
  console.log(`  Created: ${u.created_at}`);
  console.log(`  ---`);
});

// Check profiles
console.log('\n📋 Profiles:');
const profiles = await client.query('SELECT id, email, full_name, role, section FROM public.profiles;');
profiles.rows.forEach(p => {
  console.log(`  ${p.full_name} (${p.email}) - Role: ${p.role}, Section: ${p.section}`);
});

await client.end();
