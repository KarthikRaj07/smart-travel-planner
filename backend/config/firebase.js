// Firebase Admin SDK Configuration
const admin = require('firebase-admin');

let db;

function initFirebase() {
  if (admin.apps.length > 0) return;

  const hasCreds = process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID;

  if (hasCreds) {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('✅ Firebase Admin initialized with service account');
  } else {
    // Fallback: use project ID only — this will work if environment is already authenticated (GCP/GAC)
    // but we should warn the user if they're running locally without these.
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'smart-travel-planner-23860',
    });
    console.warn('⚠️ Firebase Admin initialized WITHOUT explicit service account credentials.');
    console.warn('   Trip saving/loading will likely fail locally until you add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env');
  }

  db = admin.firestore();
}

function getDb() {
  if (!db) {
    db = admin.firestore();
  }
  return db;
}

module.exports = { initFirebase, getDb, admin };
