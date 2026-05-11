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

// Update the user's profile - keep as manager since they're the school admin
await client.query(`
  UPDATE public.profiles 
  SET full_name = 'Rufai Abdurrahman'
  WHERE email = 'rufaiabdurrahman28@gmail.com';
`);
console.log('✅ Updated name to "Rufai Abdurrahman"');
console.log('✅ Role stays as: manager (Management) - You are the school admin!');

// Verify
const profile = await client.query(`SELECT email, full_name, role FROM public.profiles WHERE email = 'rufaiabdurrahman28@gmail.com';`);
console.log('Your profile:', profile.rows[0]);

await client.end();
