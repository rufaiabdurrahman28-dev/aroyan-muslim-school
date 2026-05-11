import pg from 'pg';
const { Client } = pg;

const password = 'Aroyanschools234';
const regions = [
  'aws-0-eu-west-1',
  'aws-0-eu-west-2', 
  'aws-0-eu-central-1',
  'aws-0-us-east-1',
  'aws-0-us-east-2',
  'aws-0-us-west-1',
  'aws-0-ap-south-1',
  'aws-0-ap-northeast-1',
  'aws-0-ap-southeast-1',
  'aws-0-ca-central-1',
  'aws-0-sa-east-1',
  'aws-0-af-south-1',
];

async function main() {
  for (const region of regions) {
    // Try transaction pooler (port 6543)
    for (const port of [6543, 5432]) {
      const poolerType = port === 6543 ? 'txn' : 'session';
      const config = {
        host: `${region}.pooler.supabase.com`,
        port: port,
        database: 'postgres',
        user: 'postgres.mfqxuddjomrobrcyczpf',
        password: password,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000,
      };
      
      try {
        const client = new Client(config);
        await client.connect();
        console.log(`✅ SUCCESS! ${region} port ${port} (${poolerType})`);
        const res = await client.query('SELECT 1 as test');
        console.log('Query test:', res.rows);
        await client.end();
        return { region, port };
      } catch (err) {
        const msg = err.message.substring(0, 80);
        if (msg.includes('password authentication')) {
          console.log(`${region}:${port} (${poolerType}): FOUND TENANT - WRONG PASSWORD`);
        } else if (msg.includes('Tenant')) {
          // wrong region, skip silently
        } else {
          console.log(`${region}:${port} (${poolerType}): ${msg}`);
        }
      }
    }
  }
  console.log('\n❌ Password is not working. Did you save the new password?');
  console.log('Make sure you clicked Save/Confirm after resetting it.');
}
main();
