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

// Check current profile
const profile = await client.query(`SELECT * FROM public.profiles;`);
console.log('All profiles:');
profile.rows.forEach(p => {
  console.log(`  ${p.email} - Role: ${p.role} - Name: ${p.full_name}`);
});

// Check auth users
const users = await client.query(`SELECT email, raw_user_meta_data FROM auth.users;`);
console.log('\nAuth users with metadata:');
users.rows.forEach(u => {
  console.log(`  ${u.email} - Meta:`, u.raw_user_meta_data);
});

await client.end();
