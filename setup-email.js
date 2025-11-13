/**
 * Email Setup Helper Script
 * 
 * This script helps you set up email configuration for the newsletter.
 * Run: node setup-email.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEmail() {
  console.log('\n📧 Email Setup for Newsletter Subscription\n');
  console.log('This script will help you configure email settings.\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  let envVars = {};

  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Reading existing values...\n');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        envVars[match[1].trim()] = match[2].trim();
      }
    });
  }

  console.log('Email Provider Setup:\n');
  console.log('1. Gmail (Recommended for testing)');
  console.log('2. SendGrid');
  console.log('3. Mailgun');
  console.log('4. Custom SMTP\n');

  const provider = await question('Select email provider (1-4): ');
  
  if (provider === '1') {
    // Gmail setup
    console.log('\n📧 Gmail Setup\n');
    console.log('To use Gmail, you need to:');
    console.log('1. Enable 2-Step Verification in your Google Account');
    console.log('2. Generate an App Password: https://myaccount.google.com/apppasswords');
    console.log('3. Select "Mail" and "Other (Custom name)"');
    console.log('4. Enter "Blog Newsletter" as the name');
    console.log('5. Copy the 16-character password\n');

    const email = await question(`Enter your Gmail address [${envVars.EMAIL_USER || 'sughoshpdixit@gmail.com'}]: `) || envVars.EMAIL_USER || 'sughoshpdixit@gmail.com';
    const appPassword = await question('Enter your Gmail App Password: ');

    if (!appPassword) {
      console.log('\n❌ App Password is required. Exiting...');
      rl.close();
      return;
    }

    envVars.EMAIL_SERVICE = 'gmail';
    envVars.EMAIL_USER = email;
    envVars.EMAIL_PASSWORD = appPassword;
    envVars.EMAIL_FROM = email;
    
  } else if (provider === '2') {
    // SendGrid setup
    console.log('\n📧 SendGrid Setup\n');
    const apiKey = await question('Enter your SendGrid API Key: ');
    const fromEmail = await question('Enter sender email address: ');

    envVars.EMAIL_SERVICE = 'smtp';
    envVars.EMAIL_HOST = 'smtp.sendgrid.net';
    envVars.EMAIL_PORT = '587';
    envVars.EMAIL_USER = 'apikey';
    envVars.EMAIL_PASSWORD = apiKey;
    envVars.EMAIL_FROM = fromEmail;

  } else if (provider === '3') {
    // Mailgun setup
    console.log('\n📧 Mailgun Setup\n');
    const smtpUser = await question('Enter your Mailgun SMTP username: ');
    const smtpPassword = await question('Enter your Mailgun SMTP password: ');
    const fromEmail = await question('Enter sender email address: ');

    envVars.EMAIL_SERVICE = 'smtp';
    envVars.EMAIL_HOST = 'smtp.mailgun.org';
    envVars.EMAIL_PORT = '587';
    envVars.EMAIL_USER = smtpUser;
    envVars.EMAIL_PASSWORD = smtpPassword;
    envVars.EMAIL_FROM = fromEmail;

  } else if (provider === '4') {
    // Custom SMTP
    console.log('\n📧 Custom SMTP Setup\n');
    const host = await question('Enter SMTP host: ');
    const port = await question('Enter SMTP port [587]: ') || '587';
    const user = await question('Enter SMTP username: ');
    const password = await question('Enter SMTP password: ');
    const fromEmail = await question('Enter sender email address: ');

    envVars.EMAIL_SERVICE = 'smtp';
    envVars.EMAIL_HOST = host;
    envVars.EMAIL_PORT = port;
    envVars.EMAIL_USER = user;
    envVars.EMAIL_PASSWORD = password;
    envVars.EMAIL_FROM = fromEmail;
  } else {
    console.log('\n❌ Invalid selection. Exiting...');
    rl.close();
    return;
  }

  // Set admin email if not set
  if (!envVars.EDITOR_EMAIL) {
    envVars.EDITOR_EMAIL = envVars.EMAIL_USER || 'sughoshpdixit@gmail.com';
  }

  // Set site name and URL if not set
  if (!envVars.SITE_NAME) {
    envVars.SITE_NAME = "Sughosh's Chronicles";
  }
  if (!envVars.NEXT_PUBLIC_SITE_URL) {
    envVars.NEXT_PUBLIC_SITE_URL = "https://sughoshblog.vercel.app";
  }

  // Write to .env.local
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('\n✅ Email configuration saved to .env.local');
  console.log('\n📝 Next steps:');
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Test the subscription by signing up from the footer');
  console.log('3. Check your email inbox for confirmation');
  console.log('\n⚠️  Important: Add .env.local to .gitignore if not already added!');
  
  rl.close();
}

setupEmail().catch(console.error);

