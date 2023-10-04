import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCKFIiyjXHguzQQkVD-KuibhtRAw87KwEo",
    authDomain: "jobportal-2c308.firebaseapp.com",
    projectId: "jobportal-2c308",
    storageBucket: "jobportal-2c308.appspot.com",
    messagingSenderId: "470557614226",
    appId: "1:470557614226:web:2d684e1c394905336dc64b",
    measurementId: "G-ZD11QDWEGK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(app);