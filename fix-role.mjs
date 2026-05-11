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

// Update role from admin to manager
await client.query(`
  UPDATE public.profiles 
  SET role = 'manager' 
  WHERE email = 'rufaiabdurrahman28@gmail.com';
`);
console.log('✅ Role updated to MANAGER (Management)!');

// Also update the trigger function so new management signups get manager role
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
console.log('✅ Trigger function kept consistent');

// Verify
const profile = await client.query(`SELECT email, full_name, role FROM public.profiles WHERE email = 'rufaiabdurrahman28@gmail.com';`);
console.log('\n📋 Your profile:', profile.rows[0]);

await client.end();
console.log('\n🎉 You now have MANAGEMENT access!');
