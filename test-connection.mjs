import pg from 'pg';

const { Client } = pg;

// The password from user - let's test both with and without potential invisible chars
const passwords = [
  'Olanrewaju123??!!++-&$#@*%®©€',
  'Olanrewaju123??!!++-&$#@*%®©€'.trim(),
];

// More Supabase regions to try
const regions = [
  'aws-0-eu-west-1',
  'aws-0-us-east-1', 
  'aws-0-us-west-1',
  'aws-0-eu-central-1',
  'aws-0-ap-northeast-1',
  'aws-0-ap-south-1',
  'aws-0-ca-central-1',
  'aws-0-sa-east-1',
  'aws-0-eu-north-1',
  'aws-0-us-east-2',
  'aws-0-af-south-1',
];

async function main() {
  for (const pwd of passwords) {
    console.log(`\n🔑 Testing password (length=${pwd.length}, first char code=${pwd.charCodeAt(0)})...`);
    
    for (const region of regions) {
      const config = {
        host: `${region}.pooler.supabase.com`,
        port: 6543,
        database: 'postgres',
        user: 'postgres.mfqxuddjomrobrcyczpf',
        password: pwd,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000,
      };
      
      try {
        const client = new Client(config);
        await client.connect();
        console.log(`✅ SUCCESS! Connected via ${region} with password length ${pwd.length}`);
        const res = await client.query('SELECT current_database(), current_user');
        console.log('Database:', res.rows[0]);
        await client.end();
        return;
      } catch (err) {
        const msg = err.message.substring(0, 60);
        if (msg.includes('password authentication')) {
          console.log(`  ${region}: Found tenant, WRONG PASSWORD`);
          // Only need to show this once per password
          break;
        } else if (msg.includes('Tenant or user not found')) {
          // silent
        } else {
          console.log(`  ${region}: ${msg}`);
        }
      }
    }
  }
  console.log('\n❌ Could not connect. The password may be incorrect or has hidden characters.');
}

main();
