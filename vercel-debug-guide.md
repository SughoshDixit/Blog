# Vercel Deployment Debug Guide

## Issues with Like and Comment Functionality on Vercel

### 1. Environment Variables Check

Make sure these environment variables are set in your Vercel dashboard:

#### Firebase Admin (Server-side)
```
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key-with-escaped-newlines
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
```

#### Firebase Client (Client-side)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 2. Common Issues and Solutions

#### Issue 1: Environment Variables Not Set
- **Symptom**: API calls fail with authentication errors
- **Solution**: Check Vercel dashboard → Settings → Environment Variables

#### Issue 2: Private Key Format
- **Symptom**: Firebase Admin initialization fails
- **Solution**: Ensure private key has proper newline characters (`\n`)

#### Issue 3: CORS Issues
- **Symptom**: API calls blocked by browser
- **Solution**: Check if API routes are properly configured

#### Issue 4: Database Rules
- **Symptom**: Permission denied errors
- **Solution**: Check Firestore security rules

### 3. Debugging Steps

1. **Check Vercel Function Logs**
   - Go to Vercel Dashboard → Functions tab
   - Look for error messages in the logs

2. **Test API Endpoints Directly**
   ```bash
   curl -X GET https://your-domain.vercel.app/api/likes/test-post
   curl -X GET https://your-domain.vercel.app/api/comments/test-post
   ```

3. **Check Browser Network Tab**
   - Open browser dev tools
   - Look for failed API requests
   - Check response status codes

4. **Verify Firebase Connection**
   - Check if Firebase Admin SDK is properly initialized
   - Verify service account permissions

### 4. Updated API Structure

The following API endpoints should work:

- `GET /api/likes/[pid]` - Get like status and count
- `POST /api/like-blog` - Toggle like
- `GET /api/comments/[pid]` - Get comments
- `POST /api/comments/post` - Post comment
- `DELETE /api/comments/delete` - Delete comment

### 5. Testing Commands

```bash
# Test like functionality
curl -X POST https://your-domain.vercel.app/api/like-blog \
  -H "Content-Type: application/json" \
  -d '{"id": "test-post"}'

# Test comment functionality
curl -X POST https://your-domain.vercel.app/api/comments/post \
  -H "Content-Type: application/json" \
  -d '{"pid": "test-post", "comment": "Test comment", "userName": "Test User", "userId": "test-user"}'
```

### 6. Firestore Security Rules

Make sure your Firestore rules allow the operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId}/likes/{likeId} {
      allow read, write: if true;
    }
    match /posts/{postId}/comments/{commentId} {
      allow read, write: if true;
    }
  }
}
```

### 7. Common Vercel Issues

1. **Cold Start**: First request might be slow
2. **Timeout**: API routes have 10-second timeout
3. **Memory**: Free tier has 1GB memory limit
4. **Environment**: Variables might not be available immediately

### 8. Quick Fixes

1. **Redeploy**: Sometimes a fresh deployment fixes issues
2. **Clear Cache**: Clear Vercel cache and redeploy
3. **Check Logs**: Always check Vercel function logs first
4. **Test Locally**: Ensure everything works locally first
