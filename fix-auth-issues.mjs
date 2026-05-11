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

// 1. Create the missing profile for the existing user
console.log('\n🔧 Creating profile for existing user...');
const userId = (await client.query(`SELECT id FROM auth.users WHERE email = 'rufaiabdurrahman28@gmail.com'`)).rows[0]?.id;

if (userId) {
  try {
    await client.query(`
      INSERT INTO public.profiles (id, email, full_name, role, section)
      VALUES ($1, 'rufaiabdurrahman28@gmail.com', 'Admin', 'admin', 'primary')
      ON CONFLICT (id) DO NOTHING
    `, [userId]);
    console.log('✅ Profile created for rufaiabdurrahman28@gmail.com with ADMIN role!');
  } catch(e) {
    console.log('Profile creation failed:', e.message);
  }
}

// 2. Disable email confirmation so users can sign up and log in immediately
console.log('\n🔧 Disabling email confirmation for easier access...');
const instances = await client.query('SELECT id, raw_base_config FROM auth.instances;');
if (instances.rows.length > 0) {
  let config;
  try {
    config = JSON.parse(instances.rows[0].raw_base_config);
  } catch { config = {}; }
  
  config.mailer_autoconfirm = true;
  config.enable_signup = true;
  config.enable_confirmations = false;
  
  const newConfig = JSON.stringify(config);
  await client.query(`
    UPDATE auth.instances 
    SET raw_base_config = $1, updated_at = now()
    WHERE id = $2
  `, [newConfig, instances.rows[0].id]);
  console.log('✅ Email confirmation DISABLED — users can log in immediately after signup!');
}

// 3. Verify
console.log('\n🔍 Verifying...');
const profiles = await client.query('SELECT id, email, full_name, role, section FROM public.profiles;');
profiles.rows.forEach(p => {
  console.log(`  ✅ ${p.full_name} (${p.email}) - Role: ${p.role}, Section: ${p.section}`);
});

const verifyConfig = JSON.parse((await client.query('SELECT raw_base_config FROM auth.instances')).rows[0].raw_base_config);
console.log('\n📧 Auto confirm:', verifyConfig.mailer_autoconfirm);
console.log('📧 Enable confirmations:', verifyConfig.enable_confirmations);

await client.end();
console.log('\n🎉 All auth issues fixed!');
