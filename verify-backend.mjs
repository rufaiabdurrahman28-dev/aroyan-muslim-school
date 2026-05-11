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
console.log('✅ Connected to Supabase Backend');

// Check auth users
console.log('\n👥 Auth Users (auth.users):');
const users = await client.query(`SELECT email, email_confirmed_at, created_at FROM auth.users ORDER BY created_at;`);
users.rows.forEach(u => {
  console.log(`  ${u.email} | Confirmed: ${u.email_confirmed_at ? 'YES' : 'NO'} | Created: ${u.created_at}`);
});

// Check profiles
console.log('\n📋 Profiles (public.profiles):');
const profiles = await client.query(`SELECT email, full_name, role, section FROM public.profiles ORDER BY created_at;`);
profiles.rows.forEach(p => {
  console.log(`  ${p.full_name} (${p.email}) | Role: ${p.role} | Section: ${p.section}`);
});

// Check trigger exists
console.log('\n🔗 Database Trigger:');
const triggers = await client.query(`
  SELECT trigger_name FROM information_schema.triggers 
  WHERE event_object_table = 'users' AND trigger_schema = 'auth';
`);
triggers.rows.forEach(t => console.log(`  ✅ ${t.trigger_name} (auto-creates profile on signup)`));

// Check section keys
console.log('\n🔑 Section Keys (public.section_keys):');
const keys = await client.query(`SELECT section, key_code FROM public.section_keys;`);
keys.rows.forEach(k => console.log(`  ${k.section}: ${k.key_code}`));

// Check school settings
console.log('\n🏫 School Settings:');
const settings = await client.query(`SELECT school_name, address, phone FROM public.school_settings;`);
settings.rows.forEach(s => console.log(`  ${s.school_name} | ${s.address} | ${s.phone}`));

await client.end();
console.log('\n✅ All backend tables are live and connected!');
