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

// Create a database trigger that auto-creates profile on signup
console.log('\n🔧 Creating auto-profile trigger...');

try {
  // Create the trigger function
  await client.query(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name, role, section)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::role_enum, 'student'),
        CASE 
          WHEN COALESCE((NEW.raw_user_meta_data->>'role')::role_enum, 'student') = 'student' THEN 'primary'
          ELSE NULL
        END
      )
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);
  console.log('✅ Trigger function created');

  // Drop existing trigger if any
  await client.query(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
  console.log('✅ Cleaned up old trigger');

  // Create the trigger
  await client.query(`
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `);
  console.log('✅ Trigger created — profiles will auto-create on signup!');

} catch(e) {
  console.log('❌ Trigger creation failed:', e.message);
}

// Verify
const triggers = await client.query(`
  SELECT trigger_name, event_object_table 
  FROM information_schema.triggers 
  WHERE trigger_schema = 'auth' OR event_object_schema = 'auth';
`);
console.log('\n🔍 Active triggers:');
triggers.rows.forEach(t => console.log(`  ${t.trigger_name} on ${t.event_object_table}`));

await client.end();
console.log('\n🎉 Profile auto-creation trigger is live!');
