# Firebase Storage Configuration

This project uses Firebase Storage for file storage (avatars, covers, and post media).

## Prerequisites

1. Firebase account (https://firebase.google.com/)
2. Project created in Firebase Console

## Firebase Storage Setup

### 1. Get Private Key

1. Access the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file

### 2. Add Key to Project

1. Create the `certs` folder in the backend root if it doesn't exist:
   ```bash
   mkdir -p apps/backend/certs
   ```

2. Move the downloaded JSON file to `apps/backend/certs/`
3. Rename to: `strak-social-firebase-adminsdk-fbsvc-e92b92c42e.json`

### 3. Configure Storage Bucket

The bucket used is: `strak-social.firebasestorage.app`

#### Folder Structure in Bucket

```
strak-social.firebasestorage.app/
├── avatars/          # User profile photos
├── covers/           # Profile cover photos
└── medias/           # Post images and videos
```

### 4. Firebase Storage Security Rules

Configure security rules in Firebase Console under **Storage** > **Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only backend can upload (via Admin SDK)
    match /{allPaths=**} {
      allow write: if false;
    }
  }
}
```

## How It Works

### File Upload

1. Frontend sends file to API (`/api/upload/avatar`, `/api/upload/cover`, or `/api/upload/media`)
2. API validates file (size, type)
3. File is saved to Firebase Storage using Firebase Admin SDK
4. Public URL of the file is returned and saved to database

### File Naming Convention

- **Avatars**: `{userId}_{timestamp}.{ext}` (e.g., `1_20231208143022.jpg`)
- **Covers**: `{userId}_{timestamp}.{ext}` (e.g., `1_20231208143022.jpg`)
- **Media**: `{uuid}_{timestamp}.{ext}` (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890_20231208143022.jpg`)

### Old File Deletion

When a user updates their avatar or cover:
1. Old file is automatically deleted from Firebase Storage
2. New file is uploaded
3. URL in database is updated

## Environment Variables

No environment variables are needed for Firebase. The system automatically looks for the certificate file at `certs/strak-social-firebase-adminsdk-fbsvc-e92b92c42e.json`.

## Limits and Quotas

- **Avatar**: Maximum 5MB
- **Cover**: Maximum 10MB
- **Media**: Maximum 20MB

## Troubleshooting

### Error: "Failed to upload file to Firebase Storage"

Check:
1. Certificate file is in the correct location
2. Bucket name is correct: `strak-social.firebasestorage.app`
3. Firebase Storage permissions are configured correctly

### Error: "ENOENT: no such file or directory"

Certificate file was not found. Make sure it's at:
```
apps/backend/certs/strak-social-firebase-adminsdk-fbsvc-e92b92c42e.json
```

## Public URLs

All generated URLs follow the pattern:
```
https://storage.googleapis.com/strak-social.firebasestorage.app/{folder}/{filename}
```

Example:
```
https://storage.googleapis.com/strak-social.firebasestorage.app/avatars/1_20231208143022.jpg
```

## Database Storage

**Important:** The complete Firebase Storage URL is saved in the database:
- `users.avatar` column stores the full URL (e.g., `https://storage.googleapis.com/...`)
- `users.cover` column stores the full URL
- Post media URLs are stored in `post_media` table

This means:
- Frontend doesn't need to construct URLs
- URLs work directly from database
- No environment-dependent URL building logic needed
