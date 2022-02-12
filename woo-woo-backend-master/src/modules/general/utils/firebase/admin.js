import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

var serviceAccount = require('C://Users//ali0//Documents//GitHub//Woo-Woo-Network//woo-woo-backend-master//serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const adminAuth = admin.auth;
export default admin;
