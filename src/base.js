// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs3PJHDLvGefXrsA_y__vZLaHBToQiY3c",
  authDomain: "chuwa-project.firebaseapp.com",
  databaseURL: "https://chuwa-project-default-rtdb.firebaseio.com",
  projectId: "chuwa-project",
  storageBucket: "chuwa-project.appspot.com",
  messagingSenderId: "391583042556",
  appId: "1:391583042556:web:4abeaae9d3a6a5038f0079",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getDatabase(app);
export default app;
