import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mfqxuddjomrobrcyczpf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcXh1ZGRqb21yb2JyY3ljenBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODAxOTU2NywiZXhwIjoyMDkzNTk1NTY3fQ.OWbGDXs1nomFtNFyVJjqhIn2Ud-PVJiSN2Y01IecTQg',
  { db: { schema: 'public' } }
);

async function setup() {
  // Try to query existing tables
  const { data, error } = await supabase.from('school_settings').select('*').limit(1);
  if (error) {
    console.log('Tables not created yet. Error:', error.message);
    console.log('');
    console.log('Please run the SQL migration manually:');
    console.log('1. Go to https://supabase.com/dashboard/project/mfqxuddjomrobrcyczpf/sql');
    console.log('2. Click "New Query"');
    console.log('3. Paste the SQL from supabase/migrations/001_initial.sql');
    console.log('4. Click "Run"');
  } else {
    console.log('Database is set up! School settings:', data);
  }
}

setup();
