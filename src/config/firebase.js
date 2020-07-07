import firebase from "firebase/app";
import 'firebase/database';


var firebaseConfig = {
    apiKey: "AIzaSyCpbJ2jZBUHDeCIzkFmuu8ysjL_mbcH3Lo",
    authDomain: "jackabox-1.firebaseapp.com",
    databaseURL: "https://jackabox-1.firebaseio.com",
    projectId: "jackabox-1",
    storageBucket: "jackabox-1.appspot.com",
    messagingSenderId: "380443452266",
    appId: "1:380443452266:web:5f33cc6527c4ab95e5fb13",
    measurementId: "G-HJHDNL6B3Y"
  };
  // Initialize Firebase
  const fire = firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

  export default fire;