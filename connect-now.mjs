import pg from 'pg';
const { Client } = pg;

const basePassword = 'Olanrewaju123??!!++-&$#@*%®©€';

// Try multiple password variations (in case chat garbled some chars)
const passwords = [
  basePassword,
  basePassword.trim(),
  // Maybe the ®©€ are actually registered/copyright/euro symbols
  "Olanrewaju123??!!++-&$#@*%\u00AE\u00A9\u20AC",
  // Maybe it's without the special unicode
  "Olanrewaju123??!!++-&$#@*%",
  // URL encoded version
  "Olanrewaju123%3F%3F!!%2B%2B-%26%24%23%40*%25%C2%AE%C2%A9%E2%82%AC",
];

const configs = [
  {
    name: 'Direct',
    host: 'db.mfqxuddjomrobrcyczpf.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
  },
  {
    name: 'Pooler eu-west-1',
    host: 'aws-0-eu-west-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.mfqxuddjomrobrcyczpf',
  },
];

async function main() {
  for (const config of configs) {
    for (let i = 0; i < passwords.length; i++) {
      const pwd = passwords[i];
      const label = `Config: ${config.name}, Password variation ${i+1} (len=${pwd.length})`;
      try {
        const client = new Client({
          ...config,
          password: pwd,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 8000,
        });
        await client.connect();
        console.log(`✅ SUCCESS! ${label}`);
        const res = await client.query('SELECT current_database(), current_user');
        console.log('Connected to:', res.rows[0]);
        await client.end();
        
        // Now run the full migration with the working config
        console.log('\n🚀 Starting migration with working credentials...');
        const { Client: Client2 } = (await import('pg')).default;
        const migClient = new Client({
          ...config,
          password: pwd,
          ssl: { rejectUnauthorized: false },
        });
        await migClient.connect();
        
        // Run a simple test first
        const testRes = await migClient.query('SELECT count(*) FROM pg_tables WHERE schemaname = \'public\'');
        console.log('Current public tables:', testRes.rows[0].count);
        await migClient.end();
        
        return { config, password: pwd, passwordIndex: i };
      } catch (err) {
        const shortMsg = err.message.substring(0, 50);
        if (shortMsg.includes('ENETUNREACH') || shortMsg.includes('Tenant')) {
          // Skip remaining passwords for this config if connection itself fails
          console.log(`❌ ${label}: ${shortMsg}`);
          break;
        }
        console.log(`❌ ${label}: ${shortMsg}`);
      }
    }
  }
  console.log('\n❌ All attempts failed.');
  return null;
}

main();
