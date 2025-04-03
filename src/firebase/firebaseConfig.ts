import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, serverTimestamp } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxbYFhrNnCUE0dHt_tqgSj7LNFLPBkEZ0",
  authDomain: "status-paw.firebaseapp.com",
  databaseURL: "https://status-paw-default-rtdb.firebaseio.com/",
  projectId: "status-paw",
  storageBucket: "status-paw.appspot.com",
  messagingSenderId: "465327617762",
  appId: "1:465327617762:web:94a05ac7491fe88cf7d0bb",
  measurementId: "G-1PM6XL3WXM"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default serverTimestamp();