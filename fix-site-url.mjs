import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.mfqxuddjomrobrcyczpf',
  password: 'Aroyanschools234',
  ssl: { rejectUnauthorized: false },
  statement_timeout: 10000,
  query_timeout: 10000,
  connectionTimeoutMillis: 10000,
});

await client.connect();
console.log('✅ Connected');

// Find auth config tables
console.log('\n🔍 Looking for auth config tables...');
try {
  const tables = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    ORDER BY table_name;
  `);
  console.log('Auth schema tables:', tables.rows.map(r => r.table_name));
} catch(e) {
  console.log('Error listing auth tables:', e.message.substring(0, 100));
}

// Try to find and update site_url
console.log('\n🔧 Looking for site_url setting...');
try {
  const result = await client.query(`
    SELECT name, value FROM auth.settings WHERE name = 'site_url';
  `);
  console.log('Current site_url:', result.rows);
} catch(e) {
  console.log('auth.settings failed:', e.message.substring(0, 100));
}

// Try another approach - supabase_auth schema
try {
  const result = await client.query(`
    SELECT * FROM auth.acl LIMIT 1;
  `);
  console.log('auth.acl exists:', result.rows.length > 0);
} catch(e) {
  console.log('auth.acl:', e.message.substring(0, 60));
}

// Try the most common approach
try {
  const result = await client.query(`
    SELECT current_setting('app.settings.site_url', true);
  `);
  console.log('Postgres setting:', result.rows);
} catch(e) {
  console.log('PG setting:', e.message.substring(0, 60));
}

await client.end();
console.log('Done!');
