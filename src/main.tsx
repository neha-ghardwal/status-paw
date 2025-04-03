import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAxbYFhrNnCUE0dHt_tqgSj7LNFLPBkEZ0",
  authDomain: "status-paw.firebaseapp.com",
  projectId: "status-paw",
  storageBucket: "status-paw.firebasestorage.app",
  messagingSenderId: "465327617762",
  appId: "1:465327617762:web:94a05ac7491fe88cf7d0bb",
  measurementId: "G-1PM6XL3WXM"
};

initializeApp(firebaseConfig);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
