import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
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
import { FETCH_ALL_POSTS, FETCH_ALL_COMMENTS, FETCH_ALL_FORUMS } from "./constables";

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
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const addChannel = async ({ domain }: {domain: string}) => {
  try {
    const q = query(collection(db, "channels"), where("name", "==", domain));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "channels", domain), {
        name: domain,
      });
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const CreateForum = async ({ domain, title, desc, author } : { domain: string, title: string, desc: string, author: any }) => {
  try {
    const newId = firestoreAutoId();
    const ref = doc(db, "channels", domain, "forums", newId);
    await setDoc(ref, {
      title: title,
      desc: desc,
      author: author,
      id: newId
    });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const addPost = async ({ domain, title, body, author } : { domain: string, title: string, body: string, author: any }) => {
  try {
    const newId = firestoreAutoId();
    const ref = doc(db, "channels", domain, "posts", newId);
    await setDoc(ref, {
      title: title,
      body: body,
      author: author,
      id: newId
    });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const PostComment = async ({ domain, message, postID, author, forumID} : { domain: string, message: string, postID: string, author: any, forumID: string }) => {
  try {
    const newId = firestoreAutoId();
    const ref = doc(db, "channels", domain, 'forums', forumID, "posts", postID, "comments", newId);
    await setDoc(ref, {
      message: message,
      author: author,
      id: newId,
    });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const GetPost = async({ domain, postID } : { domain: string, postID: string }) => { 
  try {
    const ref = doc(db, "channels", domain, "posts", postID);
    const data = await getDoc(ref);
    return data.data();
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
}

export const GetForum = async({ domain, forumID } : { domain: string, forumID: string }) => { 
  try {
    const ref = doc(db, "channels", domain, "forums", forumID);
    const data = await getDoc(ref);
    return data.data();
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
}


export const GetAllPosts = ({ domain, forumID } : {domain: string, forumID: string}) => {
  return (dispatch: any) => {
    dispatch({type: FETCH_ALL_POSTS, payload: {loading: true, all_posts: []}})
    onSnapshot(collection(db, `channels/${domain}/${forumID}/posts`), (querySnapshot) => {
      const posts: any[] = [];
      querySnapshot.forEach((doc) => {
        posts.push(doc.data());
      });

      dispatch({type: FETCH_ALL_POSTS, payload: {loading: false, all_posts: posts }})
    })
  }
}

export const GetAllForums = ({ domain } : {domain: any}) => {
  return (dispatch: any) => {
    dispatch({type: FETCH_ALL_FORUMS, payload: {loading: true, all_forums: []}})
    onSnapshot(collection(db, `channels/${domain}/forums`), (querySnapshot) => {
      const forums: any[] = [];
      querySnapshot.forEach((doc) => {
        forums.push(doc.data());
      });

      dispatch({type: FETCH_ALL_FORUMS, payload: {loading: false, all_forums: forums }})
    })
  }
}

export const GetAllComments = ({ domain, postID } :{ domain: string, postID: string }) => {

  return (dispatch: any) => {
    dispatch({
      type: FETCH_ALL_COMMENTS,
      payload: { loading: true, all_posts: [] },
    });
    onSnapshot(collection(db, `channels/${domain}/posts/${postID}/comments`), (querySnapshot) => {
      const comments: any[] = [];
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

