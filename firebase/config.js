import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLI5RTzB1rY1DNFTsColl04-EwMUPWKG8",
  authDomain: "shophoria-86f4c.firebaseapp.com",
  projectId: "shophoria-86f4c",
  storageBucket: "shophoria-86f4c.appspot.com",
  messagingSenderId: "106590869929",
  appId: "1:106590869929:web:c8f5e9c6270ca61d01ccb8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;