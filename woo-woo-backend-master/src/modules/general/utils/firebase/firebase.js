import firebase from 'firebase';

/**
 * Firebase credentials to connect to firebase services
 */
 const firebaseConfig = {
  apiKey: "AIzaSyBHgWrdxrNW0tcheACV45rzou5b4jIZmC4",
  authDomain: "woo-woo-network.firebaseapp.com",
  projectId: "woo-woo-network",
  storageBucket: "woo-woo-network.appspot.com",
  messagingSenderId: "257418938856",
  appId: "1:257418938856:web:6319ea7393e05ae3107c5d",
  measurementId: "G-XNZR33LCJZ"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;

export default firebase;
