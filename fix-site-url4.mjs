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

// First, insert an instance record if it doesn't exist
console.log('\n🔍 Checking if instance record exists...');
const instances = await client.query('SELECT * FROM auth.instances;');
console.log('Instances count:', instances.rows.length);

if (instances.rows.length === 0) {
  console.log('📝 No instance found. Creating one with correct config...');
  const config = JSON.stringify({
    site_url: 'https://my-project-eight-wheat.vercel.app',
    uri_allow_list: 'https://my-project-eight-wheat.vercel.app/**,http://localhost:3000/**',
  });
  
  try {
    await client.query(`
      INSERT INTO auth.instances (id, uuid, raw_base_config, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        gen_random_uuid(),
        $1,
        now(),
        now()
      )
    `, [config]);
    console.log('✅ Created instance with correct site_url!');
  } catch(e) {
    console.log('Insert failed:', e.message);
  }
} else {
  const row = instances.rows[0];
  console.log('Current config:', row.raw_base_config);
  
  // Parse and update the config
  let config;
  try {
    config = JSON.parse(row.raw_base_config);
  } catch {
    config = {};
  }
  
  config.site_url = 'https://my-project-eight-wheat.vercel.app';
  config.uri_allow_list = 'https://my-project-eight-wheat.vercel.app/**,http://localhost:3000/**';
  
  const newConfig = JSON.stringify(config);
  
  try {
    await client.query(`
      UPDATE auth.instances 
      SET raw_base_config = $1, updated_at = now()
      WHERE id = $2
    `, [newConfig, row.id]);
    console.log('✅ Updated site_url to https://my-project-eight-wheat.vercel.app');
    console.log('✅ Updated redirect URLs');
  } catch(e) {
    console.log('Update failed:', e.message);
  }
}

// Verify
console.log('\n🔍 Verifying...');
const verify = await client.query('SELECT raw_base_config FROM auth.instances;');
console.log('Updated config:', verify.rows[0]?.raw_base_config);

await client.end();
console.log('\n🎉 Site URL updated successfully!');
