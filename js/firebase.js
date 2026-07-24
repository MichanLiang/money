import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAWhCw5CbvbsaAbIvzU2NmNK-Mu0PRxf3Q',
  authDomain: 'money-8f87c.firebaseapp.com',
  projectId: 'money-8f87c',
  storageBucket: 'money-8f87c.firebasestorage.app',
  messagingSenderId: '368768361381',
  appId: '1:368768361381:web:bcb674f7a2ef891afb3e4c',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc };