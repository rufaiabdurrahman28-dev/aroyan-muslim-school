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

// The Supabase auth config is managed via the GoTrue service, not in PostgreSQL directly
// But we can try using the Supabase Management API
// Let's try calling the Management API with the service role key

const projectRef = 'mfqxuddjomrobrcyczpf';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcXh1ZGRqb21yb2JyY3ljenBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODAxOTU2NywiZXhwIjoyMDkzNTk1NTY3fQ.OWbGDXs1nomFtNFyVJjqhIn2Ud-PVJiSN2Y01IecTQg';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcXh1ZGRqb21yb2JyY3ljenBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTk1NjcsImV4cCI6MjA5MzU5NTU2N30.RzOoNFXD7FlVQycyMKnLxBL8FFua5YWcU4Zi9wqQCo0';

// Try the internal GoTrue admin API
console.log('\n🔧 Trying GoTrue admin API...');
try {
  const response = await fetch(`https://${projectRef}.supabase.co/auth/v1/admin/config`, {
    method: 'GET',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
  });
  const text = await response.text();
  console.log('GoTrue config response:', response.status, text.substring(0, 200));
} catch(e) {
  console.log('GoTrue admin failed:', e.message.substring(0, 100));
}

// Try the Supabase Management API (needs personal access token, but let's try with service key)
console.log('\n🔧 Trying Management API...');
try {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
    },
  });
  const text = await response.text();
  console.log('Management API response:', response.status, text.substring(0, 200));
} catch(e) {
  console.log('Management API failed:', e.message.substring(0, 100));
}

// Try updating via the GoTrue admin endpoint
console.log('\n🔧 Trying to update site_url via GoTrue...');
try {
  const response = await fetch(`https://${projectRef}.supabase.co/auth/v1/admin/config`, {
    method: 'PUT',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      site_url: 'https://my-project-eight-wheat.vercel.app',
    }),
  });
  const text = await response.text();
  console.log('GoTrue update response:', response.status, text.substring(0, 200));
} catch(e) {
  console.log('GoTrue update failed:', e.message.substring(0, 100));
}

await client.end();
console.log('\nDone!');
