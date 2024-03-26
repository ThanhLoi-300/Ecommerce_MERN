import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKd6tzvpsAcXBIfs5MV8s-lsYiUjjck2o",
  authDomain: "video-8f328.firebaseapp.com",
  projectId: "video-8f328",
  storageBucket: "video-8f328.appspot.com",
  messagingSenderId: "1039293544656",
  appId: "1:1039293544656:web:c41e66acf392a658b546d5",
  measurementId: "G-3ERN69X1ED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth()
export const provider = new GoogleAuthProvider()

export default app