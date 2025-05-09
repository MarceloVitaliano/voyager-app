// Importar Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXf7B3J605nvDPr7zlnfxQ4HGRKNlBQbU",
  authDomain: "voyager-app-8c677.firebaseapp.com",
  projectId: "voyager-app-8c677",
  storageBucket: "voyager-app-8c677.appspot.com",
  messagingSenderId: "19194177029",
  appId: "1:19194177029:web:fb8e809b2a62923c29de6c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
