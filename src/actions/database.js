import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { FETCH_ALL_POSTS, FETCH_ALL_COMMENTS } from "./constables.js";

export const firestoreAutoId = () => {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let autoId = "";

  for (let i = 0; i < 20; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return autoId;
};

const firebaseConfig = {
  apiKey: "AIzaSyD-t3PCdY_Tx4vuZxNmCopXBCYZGdufF2M",
  authDomain: "levels-code-test.firebaseapp.com",
  projectId: "levels-code-test",
  storageBucket: "levels-code-test.appspot.com",
  messagingSenderId: "927936069755",
  appId: "1:927936069755:web:53b341f54e4321537fe2de",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const addChannel = async ({ domain }) => {
  try {
    const q = query(collection(db, "channels"), where("name", "==", domain));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "channels", domain), {
        name: domain,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const addPost = async ({ domain, title, body, author }) => {
  try {
    const newId = firestoreAutoId();
    const ref = doc(db, "channels", domain, "posts", newId);
    await setDoc(ref, {
      title: title,
      body: body,
      author: author,
      id: newId
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const PostComment = async ({ domain, message, postID, author }) => {
  try {
    const newId = firestoreAutoId();
    const ref = doc(db, "channels", domain, "posts", postID, "comments", newId);
    await setDoc(ref, {
      message: message,
      author: author,
      id: newId,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const GetPost = async({ domain, postID }) => { 
  try {
    const ref = doc(db, "channels", domain, "posts", postID);
    const data = await getDoc(ref);
    return data.data();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

export const GetAllPosts = ({ domain }) => {
  return (dispatch) => {
    dispatch({type: FETCH_ALL_POSTS, payload: {loading: true, all_posts: []}})
    onSnapshot(collection(db, `channels/${domain}/posts`), (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push(doc.data());
      });

      dispatch({type: FETCH_ALL_POSTS, payload: {loading: false, all_posts: posts }})
    })
  }
}

export const GetAllComments = ({ domain, postID }) => {

  return (dispatch) => {
    dispatch({
      type: FETCH_ALL_COMMENTS,
      payload: { loading: true, all_posts: [] },
    });
    onSnapshot(collection(db, `channels/${domain}/posts/${postID}/comments`), (querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push(doc.data());
      });

      dispatch({
        type: FETCH_ALL_COMMENTS,
        payload: { loading: false, all_comments: comments },
      });
    });
  };
};

