import pg from 'pg';
const { Client } = pg;

const password = 'Aroyanschools234';

async function main() {
  const client = new Client({
    host: 'aws-0-eu-west-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.mfqxuddjomrobrcyczpf',
    password: password,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('✅ Connected to Supabase');

  // Update the auth config to use the correct site URL
  console.log('\n🔧 Updating auth configuration...');

  // Check current auth config
  const currentConfig = await client.query("SELECT * FROM auth.config WHERE key = 'site_url';");
  console.log('Current site_url config:', currentConfig.rows);

  // Update site_url in auth.config
  try {
    await client.query(`
      INSERT INTO auth.config (key, value) 
      VALUES ('site_url', '"https://my-project-eight-wheat.vercel.app"')
      ON CONFLICT (key) DO UPDATE SET value = '"https://my-project-eight-wheat.vercel.app"';
    `);
    console.log('✅ Updated site_url to https://my-project-eight-wheat.vercel.app');
  } catch (err) {
    console.log('auth.config approach failed:', err.message);
    
    // Try alternative: update via the auth schema
    try {
      await client.query(`
        UPDATE auth.config 
        SET value = '"https://my-project-eight-wheat.vercel.app"' 
        WHERE key = 'site_url';
      `);
      console.log('✅ Updated site_url via UPDATE');
    } catch (err2) {
      console.log('UPDATE approach also failed:', err2.message);
      console.log('⚠️ Will need to update this in Supabase Dashboard manually');
    }
  }

  // Also add the Vercel URL to allowed redirect URLs
  try {
    await client.query(`
      INSERT INTO auth.config (key, value) 
      VALUES ('uri_allow_list', '"https://my-project-eight-wheat.vercel.app/**"')
      ON CONFLICT (key) DO UPDATE SET value = '"https://my-project-eight-wheat.vercel.app/**"';
    `);
    console.log('✅ Updated redirect allow list');
  } catch (err) {
    console.log('Redirect allow list update failed:', err.message);
  }

  await client.end();
  console.log('\nDone!');
}

main().catch(err => console.error('Error:', err));
