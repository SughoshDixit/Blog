# Quick Email Setup Guide

## 🚀 Quick Start (Gmail)

### Step 1: Generate Gmail App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Enable **2-Step Verification** (if not already enabled)
4. Scroll down and click **App passwords**
5. Select **Mail** and **Other (Custom name)**
6. Enter **"Blog Newsletter"** as the name
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this)

### Step 2: Create .env.local File

Create a file named `.env.local` in the root of your project with:

```env
# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=sughoshpdixit@gmail.com
EMAIL_PASSWORD=your-16-char-app-password-here
EMAIL_FROM=sughoshpdixit@gmail.com

# Editor Email (for notifications)
EDITOR_EMAIL=sughoshpdixit@gmail.com

# Site Configuration
SITE_NAME=Sughosh's Chronicles
NEXT_PUBLIC_SITE_URL=https://sughoshblog.vercel.app
```

**Replace `your-16-char-app-password-here` with the App Password you generated.**

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Restart Development Server

```bash
npm run dev
```

### Step 5: Test

1. Go to your blog's footer
2. Enter your email and click "Sign Up"
3. Check your email inbox for:
   - ✅ Confirmation email to subscriber
   - ✅ Notification email to admin (your EDITOR_EMAIL)

## 🔧 Automated Setup (Optional)

You can also use the setup script:

```bash
node setup-email.js
```

This will guide you through the setup process interactively.

## 📧 What Happens When Someone Subscribes

1. **Subscriber receives**: Welcome email with confirmation
2. **Admin receives**: Notification email with subscriber details
3. **Database**: Email is saved to Firestore `newsletter_subscribers` collection

## 📬 Weekly Digest

To send weekly digest to all subscribers:

```bash
POST /api/newsletter/send-digest
```

Requires admin authentication (same as writer dashboard).

### Automate Weekly Digest (Vercel)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/newsletter/send-digest",
      "schedule": "0 10 * * 1"
    }
  ]
}
```

This sends every Monday at 10 AM UTC.

## 🔍 Troubleshooting

### Emails not sending?

1. **Check environment variables**: Make sure `.env.local` exists and has correct values
2. **Verify App Password**: Use App Password, not your regular Gmail password
3. **Check server logs**: Look for error messages in console
4. **Check spam folder**: Emails might be in spam
5. **Restart server**: After changing `.env.local`, restart the dev server

### Gmail "Less secure app" error?

- You **must** use an App Password (not your regular password)
- Enable 2-Step Verification first
- Generate a new App Password specifically for this app

### "Email service not configured" warning?

- Make sure `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env.local`
- Check that nodemailer is installed: `npm list nodemailer`
- Restart your development server after adding environment variables

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `EMAIL_SERVICE` | Yes | `gmail` or `smtp` |
| `EMAIL_USER` | Yes | Your email address |
| `EMAIL_PASSWORD` | Yes | Your email password or App Password |
| `EMAIL_FROM` | Yes | Sender email address |
| `EMAIL_HOST` | No* | SMTP host (required if EMAIL_SERVICE=smtp) |
| `EMAIL_PORT` | No | SMTP port (default: 587) |
| `EDITOR_EMAIL` | Yes | Admin email for notifications |
| `SITE_NAME` | No | Site name (default: "Sughosh's Chronicles") |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL (default: "https://sughoshblog.vercel.app") |

*Required for custom SMTP providers

## 🔒 Security Notes

- ⚠️ **Never commit `.env.local` to version control**
- ✅ Use App Passwords for Gmail (not your main password)
- ✅ Rotate passwords regularly
- ✅ Use environment variables in production
- ✅ Add `.env.local` to `.gitignore`

## 📚 More Information

See `EMAIL_SETUP.md` for detailed documentation on:
- Other email providers (SendGrid, Mailgun, Resend)
- Advanced configuration
- Automation options
- Troubleshooting guide

