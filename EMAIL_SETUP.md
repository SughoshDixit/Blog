# Email Configuration Guide

This guide explains how to set up email functionality for the newsletter subscription and weekly digest features.

## Required Environment Variables

Add these to your `.env.local` file (or your hosting platform's environment variables):

### For Gmail (Recommended for Testing)

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Optional
EMAIL_HOST=
EMAIL_PORT=587
```

### For Other SMTP Providers (SendGrid, Mailgun, etc.)

```env
# Email Configuration
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com
```

## Gmail Setup (Recommended)

### Step 1: Enable 2-Step Verification
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "Blog Newsletter" as the name
4. Click "Generate"
5. Copy the 16-character password
6. Use this password as `EMAIL_PASSWORD` (not your regular Gmail password)

### Step 3: Add to Environment Variables
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
```

## Other Email Providers

### SendGrid
```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### Mailgun
```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@yourdomain.com
EMAIL_PASSWORD=your-mailgun-password
EMAIL_FROM=noreply@yourdomain.com
```

### Resend
```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASSWORD=re_your-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## Testing Email Configuration

1. Start your development server: `npm run dev`
2. Try subscribing to the newsletter from the footer
3. Check your email inbox for:
   - Confirmation email to the subscriber
   - Notification email to admin (your EDITOR_EMAIL)

## Sending Weekly Digest

The weekly digest can be triggered manually via the API endpoint:

```bash
POST /api/newsletter/send-digest
```

You need to be authenticated as the admin (same as writer dashboard).

### Automating Weekly Digest

You can set up a cron job or scheduled task to automatically send the weekly digest:

#### Option 1: Vercel Cron Jobs
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

#### Option 2: GitHub Actions
Create `.github/workflows/weekly-digest.yml`:
```yaml
name: Weekly Digest
on:
  schedule:
    - cron: '0 10 * * 1'  # Every Monday at 10 AM UTC
jobs:
  send-digest:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Digest
        run: |
          curl -X POST https://your-domain.com/api/newsletter/send-digest \
            -H "Authorization: Bearer ${{ secrets.API_TOKEN }}"
```

#### Option 3: External Cron Service
Use services like:
- [Cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [cron-job.io](https://cron-job.io)

## Troubleshooting

### Emails not sending?
1. Check that environment variables are set correctly
2. Verify email credentials are correct
3. Check server logs for error messages
4. For Gmail, make sure you're using an App Password, not your regular password
5. Check spam folder

### Gmail "Less secure app" error?
- You must use an App Password (not your regular password)
- Enable 2-Step Verification first
- Generate a new App Password specifically for this app

### Email service not configured warning?
- Make sure `EMAIL_USER` and `EMAIL_PASSWORD` are set
- Check that nodemailer is installed: `npm install nodemailer`
- Restart your development server after adding environment variables

## Security Notes

- Never commit `.env.local` to version control
- Use App Passwords for Gmail, not your main password
- Rotate passwords regularly
- Use environment variables in production, never hardcode credentials

## Features

✅ **Subscription Confirmation Email**: Sent automatically when someone subscribes
✅ **Admin Notification Email**: Sent to admin when someone subscribes
✅ **Weekly Digest Email**: Contains all new posts from the past week
✅ **HTML Email Templates**: Beautiful, responsive email templates
✅ **Error Handling**: Graceful error handling, subscription still works if email fails

