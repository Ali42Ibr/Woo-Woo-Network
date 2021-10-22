import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const cert = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// init connection to firestore
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(cert),
  });
}

export const adminAuth = admin.auth;
export default admin;
