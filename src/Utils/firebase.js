// Import the functions you need from the SDKs you need
import { initializeApp } from '@firebase/app'
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from '@firebase/auth'
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCM3GWnvWXfNz_TLf6-uY4AyCTl0n6IE14',
  authDomain: 'blog-app-735fa.firebaseapp.com',
  projectId: 'blog-app-735fa',
  storageBucket: 'blog-app-735fa.appspot.com',
  messagingSenderId: '867459199421',
  appId: '1:867459199421:web:fd012d6d4921e40de322d4'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()
provider.setCustomParameters({
  prompt: 'select_account '
})
export const signInWithGooglePopup = () => signInWithPopup(auth, provider)
export default app
