import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const password = 'Aroyanschools234';

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
  const client = new Client({
    host: 'aws-0-eu-west-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.mfqxuddjomrobrcyczpf',
    password: password,
    ssl: { rejectUnauthorized: false },
  });

  console.log('🔗 Connecting to Supabase...');
  await client.connect();
  console.log('✅ Connected!');

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
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    console.log('\n📊 Tables created:');
    result.rows.forEach(row => console.log(`  ✅ ${row.table_name}`));
    console.log(`\nTotal: ${result.rows.length} tables`);

    // Check seed data
    const sectionKeys = await client.query('SELECT * FROM section_keys;');
    console.log('\n🔑 Section Keys:');
    sectionKeys.rows.forEach(row => console.log(`  ${row.section}: ${row.key_code}`));

    const settings = await client.query('SELECT * FROM school_settings;');
    console.log('\n🏫 School Settings:');
    settings.rows.forEach(row => console.log(`  ${row.school_name} | ${row.address}`));
  }

  await client.end();
  console.log('\n🎉 Migration complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
