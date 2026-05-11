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

const instances = await client.query('SELECT id, raw_base_config FROM auth.instances;');
let config = JSON.parse(instances.rows[0].raw_base_config);

// Re-enable email confirmation
config.mailer_autoconfirm = false;
config.enable_confirmations = true;

const newConfig = JSON.stringify(config);
await client.query(`
  UPDATE auth.instances 
  SET raw_base_config = $1, updated_at = now()
  WHERE id = $2
`, [newConfig, instances.rows[0].id]);

console.log('✅ Email confirmation RE-ENABLED!');
console.log('📧 Auto confirm:', config.mailer_autoconfirm);
console.log('📧 Enable confirmations:', config.enable_confirmations);

await client.end();
