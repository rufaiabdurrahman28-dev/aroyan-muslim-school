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

// Check current config
const instances = await client.query('SELECT id, raw_base_config FROM auth.instances;');
console.log('Current config:', instances.rows[0]?.raw_base_config);

let config;
try {
  config = JSON.parse(instances.rows[0]?.raw_base_config || '{}');
} catch {
  config = {};
}

// Add email template customization for Aroyan Muslim School
config.site_url = 'https://my-project-eight-wheat.vercel.app';
config.uri_allow_list = 'https://my-project-eight-wheat.vercel.app/**,http://localhost:3000/**';
config.mailer_autoconfirm = false;
config.mailer_subjects_confirmation = 'Aroyan Muslim School - Confirm Your Email';
config.mailer_subjects_invitation = 'Aroyan Muslim School - You Have Been Invited';
config.mailer_subjects_recovery = 'Aroyan Muslim School - Reset Your Password';
config.mailer_subjects_email_change = 'Aroyan Muslim School - Confirm Email Change';
config.mailer_subjects_magic_link = 'Aroyan Muslim School - Your Login Link';

// Custom email templates
config.mailer_templates_confirmation = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:40px;margin-bottom:40px;">
    <tr>
      <td style="background:linear-gradient(135deg,#1F3D2A,#2D5F3F);padding:30px 40px;text-align:center;">
        <h1 style="color:#C9A961;margin:0;font-size:28px;">Aroyan Muslim School</h1>
        <p style="color:#ffffff;margin:8px 0 0 0;font-size:14px;opacity:0.9;">Excellence in Education, Faith in Practice</p>
      </td>
    </tr>
    <tr>
      <td style="padding:30px 40px;">
        <h2 style="color:#1F3D2A;font-size:20px;margin:0 0 16px 0;">Confirm Your Email Address</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px 0;">As-salamu alaykum! Thank you for registering with Aroyan Muslim School. Please confirm your email address by clicking the button below:</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:10px 0;">
              <a href="{{ .ConfirmationURL }}" style="background-color:#2D5F3F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">Confirm Email</a>
            </td>
          </tr>
        </table>
        <p style="color:#888;font-size:13px;margin:20px 0 0 0;">If you did not create an account with Aroyan Muslim School, you can safely ignore this email.</p>
      </td>
    </tr>
    <tr>
      <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#999;font-size:12px;margin:0;">© 2026 Aroyan Muslim School. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

config.mailer_templates_invitation = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:40px;margin-bottom:40px;">
    <tr>
      <td style="background:linear-gradient(135deg,#1F3D2A,#2D5F3F);padding:30px 40px;text-align:center;">
        <h1 style="color:#C9A961;margin:0;font-size:28px;">Aroyan Muslim School</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:30px 40px;">
        <h2 style="color:#1F3D2A;margin:0 0 16px 0;">You Have Been Invited</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;">You have been invited to join Aroyan Muslim School. Click below to accept:</p>
        <a href="{{ .ConfirmationURL }}" style="background-color:#2D5F3F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;margin-top:16px;">Accept Invitation</a>
      </td>
    </tr>
    <tr>
      <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#999;font-size:12px;margin:0;">© 2026 Aroyan Muslim School</p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

config.mailer_templates_recovery = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:40px;margin-bottom:40px;">
    <tr>
      <td style="background:linear-gradient(135deg,#1F3D2A,#2D5F3F);padding:30px 40px;text-align:center;">
        <h1 style="color:#C9A961;margin:0;font-size:28px;">Aroyan Muslim School</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:30px 40px;">
        <h2 style="color:#1F3D2A;margin:0 0 16px 0;">Reset Your Password</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;">We received a request to reset your password. Click below to set a new one:</p>
        <a href="{{ .ConfirmationURL }}" style="background-color:#2D5F3F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;margin-top:16px;">Reset Password</a>
        <p style="color:#888;font-size:13px;margin:20px 0 0 0;">If you did not request this, please ignore this email.</p>
      </td>
    </tr>
    <tr>
      <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#999;font-size:12px;margin:0;">© 2026 Aroyan Muslim School</p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

// Update the config
const newConfig = JSON.stringify(config);

try {
  await client.query(`
    UPDATE auth.instances 
    SET raw_base_config = $1, updated_at = now()
    WHERE id = $2
  `, [newConfig, instances.rows[0].id]);
  console.log('✅ Email templates updated with Aroyan Muslim School branding!');
  console.log('✅ Confirmation email subject: "Aroyan Muslim School - Confirm Your Email"');
  console.log('✅ Invitation email subject: "Aroyan Muslim School - You Have Been Invited"');
  console.log('✅ Password reset subject: "Aroyan Muslim School - Reset Your Password"');
  console.log('✅ Email change subject: "Aroyan Muslim School - Confirm Email Change"');
  console.log('✅ Magic link subject: "Aroyan Muslim School - Your Login Link"');
} catch(e) {
  console.log('Update failed:', e.message);
}

// Verify
const verify = await client.query('SELECT raw_base_config FROM auth.instances;');
const verifyConfig = JSON.parse(verify.rows[0].raw_base_config);
console.log('\n📧 Verified email subjects:');
console.log('  Confirmation:', verifyConfig.mailer_subjects_confirmation);
console.log('  Invitation:', verifyConfig.mailer_subjects_invitation);
console.log('  Recovery:', verifyConfig.mailer_subjects_recovery);

await client.end();
console.log('\n🎉 Email templates fully customized!');
