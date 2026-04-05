import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Create user profile in Firestore
async function createUserProfile(user) {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
    });
  }
}

export async function signUpWithEmail(email, password, displayName) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName });
  await createUserProfile(userCred.user);
  return userCred.user;
}

export async function signInWithEmail(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

export async function signInWithGoogle() {
  const userCred = await signInWithPopup(auth, googleProvider);
  await createUserProfile(userCred.user);
  return userCred.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
