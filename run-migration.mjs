import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Password with special chars - using object config to avoid URL encoding issues
const password = 'Olanrewaju123??!!++-&$#@*%®©€';

async function runBatch(client, batchFile, batchName) {
  console.log(`\n📦 Running ${batchName}...`);
  const sql = fs.readFileSync(batchFile, 'utf8');
  try {
    await client.query(sql);
    console.log(`✅ ${batchName} — SUCCESS`);
    return true;
  } catch (err) {
    console.error(`❌ ${batchName} — FAILED:`, err.message);
    return false;
  }
}

async function main() {
  // Try direct connection first
  const configs = [
    {
      name: 'Direct connection',
      host: 'db.mfqxuddjomrobrcyczpf.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: password,
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Pooler connection (us-east-1)',
      host: 'aws-0-us-east-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres.mfqxuddjomrobrcyczpf',
      password: password,
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Pooler connection (eu-west-1)',
      host: 'aws-0-eu-west-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres.mfqxuddjomrobrcyczpf',
      password: password,
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Pooler connection (ap-southeast-1)',
      host: 'aws-0-ap-southeast-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres.mfqxuddjomrobrcyczpf',
      password: password,
      ssl: { rejectUnauthorized: false }
    }
  ];

  let client = null;
  
  for (const config of configs) {
    console.log(`🔗 Trying ${config.name}...`);
    try {
      const testClient = new Client(config);
      testClient.connectionTimeoutMillis = 10000;
      await testClient.connect();
      console.log(`✅ Connected via ${config.name}!`);
      client = testClient;
      break;
    } catch (err) {
      console.log(`❌ ${config.name} failed: ${err.message}`);
    }
  }

  if (!client) {
    console.error('\n🚫 Could not connect with any method. Please check your password and try again.');
    process.exit(1);
  }

  // Run batches
  const batchesDir = '/home/z/my-project/supabase/migrations/batches';
  const batches = [
    { file: '01_enums_and_core_tables.sql', name: 'Batch 1: Enums + Core Tables' },
    { file: '02_workspace_and_files.sql', name: 'Batch 2: Workspaces + Files' },
    { file: '03_submissions_attendance_reports.sql', name: 'Batch 3: Submissions + Attendance + Reports' },
    { file: '04_helpdesk_settings_admission_links.sql', name: 'Batch 4: Helpdesk + Settings + Admission' },
    { file: '05_rls_policies.sql', name: 'Batch 5: RLS Policies' },
    { file: '06_storage_buckets.sql', name: 'Batch 6: Storage Buckets' },
  ];

  let allSuccess = true;
  for (const batch of batches) {
    const filePath = path.join(batchesDir, batch.file);
    const success = await runBatch(client, filePath, batch.name);
    if (!success) {
      allSuccess = false;
      console.log(`⚠️ Stopping at ${batch.name} due to error.`);
      break;
    }
  }

  // Verify tables
  if (allSuccess) {
    console.log('\n🔍 Verifying tables...');
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('\n📊 Tables created:');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));
    console.log(`\nTotal: ${result.rows.length} tables`);
  }

  await client.end();
  console.log('\n🎉 Migration complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
