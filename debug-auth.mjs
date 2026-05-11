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

// Check the profile
const profile = await client.query(`SELECT * FROM public.profiles WHERE email = 'rufaiabdurrahman28@gmail.com';`);
console.log('Profile:', profile.rows);

// Check RLS policies on profiles
const policies = await client.query(`
  SELECT policyname, cmd, qual, with_check 
  FROM pg_policies 
  WHERE tablename = 'profiles';
`);
console.log('\nRLS Policies on profiles:');
policies.rows.forEach(p => {
  console.log(`  ${p.policyname} (${p.cmd}): qual=${p.qual}, check=${p.with_check}`);
});

// Check if the user's email is confirmed
const user = await client.query(`SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'rufaiabdurrahman28@gmail.com';`);
console.log('\nAuth user:', user.rows[0]);

await client.end();
