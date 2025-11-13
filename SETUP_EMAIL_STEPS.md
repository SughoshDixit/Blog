# 📧 Email Setup Steps - Follow These Instructions

## Step 1: Generate Gmail App Password ✅

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Scroll down and click **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter **"Blog Newsletter"** as the name
6. Click **Generate**
7. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

## Step 2: Create .env.local File ✅

Create a file named `.env.local` in the root directory with this content:

```env
# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=sughoshpdixit@gmail.com
EMAIL_PASSWORD=your-16-char-app-password-here
EMAIL_FROM=sughoshpdixit@gmail.com

# Editor Email (for notifications)
EDITOR_EMAIL=sughoshpdixit@gmail.com

# NextAuth Configuration
NEXTAUTH_SECRET=Hsohgus
NEXTAUTH_URL=http://localhost:3000

# Site Configuration
SITE_NAME=Sughosh's Chronicles
NEXT_PUBLIC_SITE_URL=https://sughoshblog.vercel.app
```

**Important**: Replace `your-16-char-app-password-here` with the App Password you generated in Step 1.

**Note**: Remove spaces from the App Password (e.g., `abcdefghijklmnop` instead of `abcd efgh ijkl mnop`)

## Step 3: Install Dependencies ✅

```bash
npm install
```

This should already be done, but verify that `nodemailer` is installed.

## Step 4: Restart Development Server ✅

```bash
npm run dev
```

**Important**: You must restart the server after creating/updating `.env.local` for the changes to take effect.

## Step 5: Test Email Functionality ✅

1. Go to your blog: http://localhost:3000
2. Scroll down to the footer
3. Enter your email in the newsletter form
4. Click "Sign Up"
5. Check your email inbox (and spam folder) for:
   - ✅ **Confirmation email** to the subscriber
   - ✅ **Notification email** to admin (sughoshpdixit@gmail.com)

## Step 6: Verify Email Configuration ✅

Check the server console for:
- ✅ "Email sent successfully" messages
- ✅ "Confirmation email sent to: [email]"
- ✅ "Notification email sent to admin"

If you see warnings like "Email configuration not found", check your `.env.local` file.

## Troubleshooting

### Emails Not Sending?

1. **Check .env.local exists**: Make sure the file is in the root directory
2. **Verify App Password**: Use App Password, NOT your regular Gmail password
3. **Remove spaces**: App Password should be 16 characters without spaces
4. **Check server logs**: Look for error messages in the console
5. **Restart server**: After changing `.env.local`, restart the dev server
6. **Check spam folder**: Emails might be in spam

### Gmail App Password Not Working?

1. Make sure 2-Step Verification is enabled
2. Generate a new App Password specifically for "Blog Newsletter"
3. Use the full 16-character password (remove spaces)
4. Wait a few minutes after generating the password before using it

### "Email service not configured" Warning?

1. Check that `.env.local` exists in the root directory
2. Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly
3. Make sure there are no extra spaces or quotes in the values
4. Restart your development server

## Production Deployment

For production (Vercel), add these environment variables in your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the variables from `.env.local`
4. Make sure to set `NEXTAUTH_URL` to your production URL

## Weekly Digest Setup

To send weekly digest emails:

1. **Manual**: POST to `/api/newsletter/send-digest` (requires admin auth)
2. **Automatic**: Add to `vercel.json`:

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

## Next Steps

1. ✅ Generate Gmail App Password
2. ✅ Create `.env.local` file
3. ✅ Install dependencies (`npm install`)
4. ✅ Restart development server (`npm run dev`)
5. ✅ Test email subscription from footer
6. ✅ Verify emails are received
7. ✅ Set up weekly digest automation (optional)

## Support

If you encounter issues:
1. Check `EMAIL_SETUP.md` for detailed documentation
2. Check `QUICK_EMAIL_SETUP.md` for quick reference
3. Check server logs for error messages
4. Verify environment variables are set correctly

