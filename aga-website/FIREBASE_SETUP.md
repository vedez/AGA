# Firebase Authentication Setup

This guide will help you set up Firebase Authentication for the AGA website project.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project" and follow the steps to create a new project
3. Give your project a name and follow the setup wizard

## Step 2: Register Your Web App

1. In the Firebase Console, click on your project
2. Click on the web icon (</>) to add a web app to your project
3. Register your app with a nickname (e.g., "AGA Website")
4. You can skip the Firebase Hosting setup for now

## Step 3: Get Your Firebase Configuration

After registering your app, you'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## Step 4: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project (copy from `.env.local.example`)
2. Add your Firebase configuration values to the `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

## Step 5: Enable Authentication Methods

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click on "Get started" or "Sign-in method" tab
3. Enable the authentication methods you want to use (at minimum, enable Email/Password)
4. Save your changes

## Step 6: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in production mode (recommended for deployed applications) or test mode (for development)
4. Choose a location for your database that is closest to your users
5. Wait for the database to be provisioned

## Step 7: Create Firestore Collections and Security Rules

1. After your database is created, you'll need to set up the necessary collections:
   - `tasks` - Stores user tasks

2. Set up security rules for your Firestore database by going to the "Rules" tab and adding the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Basic user authentication check
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Verify the user owns the document they're accessing
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Tasks collection rules
    match /tasks/{taskId} {
      // Allow read/write only if the task belongs to the authenticated user
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if isAuthenticated() && 
                                    resource.data.userId == request.auth.uid;
    }
    
    // User profile rules (if you add user profiles later)
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

3. Publish your security rules by clicking "Publish"

## Step 8: Test Your Authentication and Firestore

1. Run your Next.js application with `npm run dev`
2. Navigate to the login/signup page and create an account
3. Try creating and managing tasks
4. Check the Firebase Console under "Firestore Database" > "Data" to see if your test data was created correctly

## Additional Features

### Firestore Database Indexes (if needed)

If you're using complex queries that require indexes:

1. Firebase will notify you in the console if an index is required
2. Click on the provided link to create the needed index
3. Alternatively, navigate to Firestore Database > Indexes and create them manually

### Troubleshooting

- If you encounter CORS issues, make sure your Firebase project has the correct domains listed in the Authentication > Settings > Authorized domains section.
- Check browser console for any Firebase-related errors.
- Ensure your environment variables are correctly set and accessible in your application.
- If security rules are blocking operations, check the Firebase console for security rule errors. 