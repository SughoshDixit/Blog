# 📧 Email Setup - Quick Start Guide

## ✅ What's Already Done

1. ✅ **Nodemailer installed** - Added to `package.json`
2. ✅ **Email library created** - `Lib/email.js` with all email functions
3. ✅ **API endpoints updated** - Subscription and digest endpoints
4. ✅ **Documentation created** - Complete setup guides

## 🚀 Quick Setup (3 Steps)

### Step 1: Generate Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** and **Other (Custom name)**
3. Enter **"Blog Newsletter"** as the name
4. Click **Generate**
5. **Copy the 16-character password** (remove spaces)

### Step 2: Create .env.local File

Create `.env.local` in the root directory with:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=sughoshpdixit@gmail.com
EMAIL_PASSWORD=your-16-char-app-password-here
EMAIL_FROM=sughoshpdixit@gmail.com
EDITOR_EMAIL=sughoshpdixit@gmail.com
NEXTAUTH_SECRET=Hsohgus
NEXTAUTH_URL=http://localhost:3000
SITE_NAME=Sughosh's Chronicles
NEXT_PUBLIC_SITE_URL=https://sughoshblog.vercel.app
```

**Replace `your-16-char-app-password-here` with your App Password.**

### Step 3: Restart Server

```bash
npm run dev
```

## 🧪 Test

1. Go to http://localhost:3000
2. Scroll to footer
3. Enter email and click "Sign Up"
4. Check your inbox for confirmation email

## 📚 Documentation

- **Complete Guide**: See `EMAIL_SETUP.md`
- **Quick Reference**: See `QUICK_EMAIL_SETUP.md`
- **Step-by-Step**: See `SETUP_EMAIL_STEPS.md`
- **Setup Complete**: See `EMAIL_SETUP_COMPLETE.md`

## 🔧 Troubleshooting

**Emails not sending?**
1. Check `.env.local` exists in root directory
2. Verify App Password (not regular password)
3. Remove spaces from App Password
4. Restart server after creating `.env.local`
5. Check spam folder

**Gmail App Password not working?**
1. Enable 2-Step Verification first
2. Generate new App Password for "Blog Newsletter"
3. Use 16-character password without spaces
4. Wait a few minutes after generating

## ✨ Features

- ✅ **Subscription Confirmation Email** - Sent to new subscribers
- ✅ **Admin Notification Email** - Sent to admin when someone subscribes
- ✅ **Weekly Digest Email** - Contains all new posts from past week
- ✅ **HTML Email Templates** - Beautiful, responsive emails
- ✅ **Error Handling** - Graceful error handling

## 📬 Weekly Digest

To send weekly digest:

**Manual**: POST to `/api/newsletter/send-digest` (requires admin auth)

**Automatic**: Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/newsletter/send-digest",
    "schedule": "0 10 * * 1"
  }]
}
```

This sends every Monday at 10 AM UTC.

---

**🎉 Once you complete the 3 steps above, email functionality will be fully working!**

