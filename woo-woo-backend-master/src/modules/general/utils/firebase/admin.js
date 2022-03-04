import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

var serviceAccount = require('../../../../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const adminAuth = admin.auth;
export default admin;
