const fs = require('fs');
const path = require('path');

const envContent = `# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=sughosh.bit@gmail.com
EMAIL_PASSWORD=Hsohgus@080998
EMAIL_FROM=sughosh.bit@gmail.com

# Editor Email (for notifications)
EDITOR_EMAIL=sughosh.bit@gmail.com

# NextAuth Configuration
NEXTAUTH_SECRET=Hsohgus
NEXTAUTH_URL=http://localhost:3000

# Site Configuration
SITE_NAME=Sughosh's Chronicles
NEXT_PUBLIC_SITE_URL=https://sughoshblog.vercel.app
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env.local file created successfully!');
  console.log('📧 Email configuration added');
  console.log('📝 File location:', envPath);
  console.log('\n⚠️  IMPORTANT: Restart your development server (npm run dev) for changes to take effect.');
  console.log('\n📧 NOTE: For Gmail, you may need to use an App Password instead of your regular password.');
  console.log('   If you get authentication errors, generate an App Password at:');
  console.log('   https://myaccount.google.com/apppasswords');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
}

