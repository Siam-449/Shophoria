import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpjC1SbmhR1EXcqv8CQVsFAX0yOeHfMmE",
  authDomain: "shophoria-4aa13.firebaseapp.com",
  projectId: "shophoria-4aa13",
  storageBucket: "shophoria-4aa13.appspot.com",
  messagingSenderId: "18412437215",
  appId: "1:18412437215:web:3e45d4f611d6952025336a",
  measurementId: "G-G5WMSPNZ3W"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export default app;