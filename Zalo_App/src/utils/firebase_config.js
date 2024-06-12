import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

export const firebaseConfig = {
  // apiKey: "AIzaSyDFhN1kv7VOyN_Ec3j0dnbYXvyPoI8ozwM",
  // authDomain: "checkopt-2ad1f.firebaseapp.com",
  // projectId: "checkopt-2ad1f",
  // storageBucket: "checkopt-2ad1f.appspot.com",
  // messagingSenderId: "525916952677",
  // appId: "1:525916952677:web:23e76dde41b3d8da9d0e8c",
  // measurementId: "G-FT26V997XK"
  // apiKey: "AIzaSyAFn614q6SXvpNBGTqxwWBUiXiK1sId9FY",
  // authDomain: "zalo-web.firebaseapp.com",
  // projectId: "zalo-web",
  // storageBucket: "zalo-web.appspot.com",
  // messagingSenderId: "397340346509",
  // appId: "1:397340346509:web:bcbd80745003ae254dbac4",
  // measurementId: "G-WGVDH2K1EN"
  apiKey: "AIzaSyAE4nZR0Z3kXiXUYs6mu_migfk10TH2Omk",
  authDomain: "zalofakeauth124.firebaseapp.com",
  projectId: "zalofakeauth124",
  storageBucket: "zalofakeauth124.appspot.com",
  messagingSenderId: "409199550879",
  appId: "1:409199550879:web:c98972f7d4ae045c721daa",
  measurementId: "G-73FZ2J90KN"
};

if (firebase.app.length) {
  firebase.initializeApp(firebaseConfig);
}
