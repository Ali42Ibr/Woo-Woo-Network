import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

var serviceAccount = require('/Users/davidpinosproano/Desktop/Group Project/Git repo/Woo-Woo-Network/woo-woo-backend-master/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const adminAuth = admin.auth;
export default admin;
