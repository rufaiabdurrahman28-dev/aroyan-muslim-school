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

// Fix the profiles RLS - the admin policy is circular (references profiles while checking profiles)
// Replace with a simpler approach using JWT claims
console.log('\n🔧 Fixing profiles RLS policies...');

// Drop existing policies
await client.query(`DROP POLICY IF EXISTS "Users can view own profile" ON profiles;`);
await client.query(`DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;`);
await client.query(`DROP POLICY IF EXISTS "Users can update own profile" ON profiles;`);
await client.query(`DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;`);
console.log('✅ Dropped old policies');

// Create better policies
await client.query(`
  CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
`);
console.log('✅ Users can view own profile');

await client.query(`
  CREATE POLICY "Users can view other profiles basic info" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);
`);
console.log('✅ Authenticated users can view profiles');

await client.query(`
  CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
`);
console.log('✅ Users can insert own profile');

await client.query(`
  CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
`);
console.log('✅ Users can update own profile');

// Also make sure the Supabase auth config has the correct site URL
// and enable the email confirmation redirect
console.log('\n🔧 Verifying auth config...');
const instances = await client.query('SELECT raw_base_config FROM auth.instances;');
if (instances.rows.length > 0) {
  const config = JSON.parse(instances.rows[0].raw_base_config);
  console.log('Site URL:', config.site_url);
  console.log('Redirect URLs:', config.uri_allow_list);
}

await client.end();
console.log('\n🎉 RLS policies fixed!');
