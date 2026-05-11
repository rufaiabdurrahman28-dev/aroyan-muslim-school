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

try {
  await client.query(`UPDATE auth.config SET value = '"https://my-project-eight-wheat.vercel.app"' WHERE key = 'site_url';`);
  console.log('✅ Site URL updated');
} catch(e) {
  console.log('Site URL update:', e.message.substring(0, 80));
}

try {
  await client.query(`UPDATE auth.config SET value = '"https://my-project-eight-wheat.vercel.app/**,http://localhost:3000/**"' WHERE key = 'uri_allow_list';`);
  console.log('✅ Redirect URLs updated');
} catch(e) {
  console.log('Redirect update:', e.message.substring(0, 80));
}

await client.end();
console.log('Done!');
