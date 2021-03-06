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
  serverTimestamp,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { FETCH_ALL_POSTS, FETCH_ALL_COMMENTS, FETCH_ALL_FORUMS, FETCH_ALL_NOTIFICATIONS } from "./constables";

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
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "levels-code-test.firebaseapp.com",
  projectId: "levels-code-test",
  storageBucket: "levels-code-test.appspot.com",
  messagingSenderId: "927936069755",
  appId: process.env.REACT_APP_APP_ID,
};

console.log('HALLOOO', process.env.REACT_APP_API_KEY)

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

const sortAfterDateAsc = (arr: any []) => {
  const result = arr.sort(function(a,b){return a.timestamp > b.timestamp ? 1 : a.timestamp < b.timestamp ? -1 : 0 })
  return result
}

const sortAfterDateDesc = (arr: any []) => {
  const result = arr.sort(function(a,b){return a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0 })
  return result
}

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        profileImage: user.photoURL,
        domain: user.email.split('@')[1]
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
        timestamp: serverTimestamp()
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
      id: newId,
      timestamp: serverTimestamp()
    });

    await CreateNotification({ link: `/channels/${domain}/${newId}`, channelID: newId, author, message: `${title} ??? ${desc}`, type: 'New forum', timestamp: serverTimestamp() });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const CreatePost = async ({ domain, forumID, title, body, author, requestedResponse, notify } : { domain: string, forumID: string, title: string, body: string, author: any, requestedResponse: any, notify: any }) => {
  try {
    const newId = firestoreAutoId();
    const ref = doc(db, "channels", domain, 'forums', forumID, "posts", newId);
    await setDoc(ref, {
      title: title,
      body: body,
      author: author,
      id: newId,
      timestamp: serverTimestamp()
    });
    await CreateNotification({ link: `/channels/${domain}/${forumID}/${newId}`, channelID: forumID, postID: newId, author, message: `${title} ??? ${body}`, type: 'New post', timestamp: serverTimestamp(), requestedResponse: requestedResponse, notify: notify });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const PostComment = async ({ domain, message, postID, author, forumID, postTitle, requestedResponse, notify} : { domain: string, message: string, postID: string, author: any, forumID: string, postTitle: any, requestedResponse: any, notify: any }) => {
  try {
    const newId = firestoreAutoId();
    const ref = doc(db, "channels", domain, 'forums', forumID, "posts", postID, "comments", newId);
    
    await setDoc(ref, {
      message: message,
      author: author,
      id: newId,
      timestamp: serverTimestamp()
    });

    await CreateNotification({ link: `/channels/${domain}/${forumID}/${postID}`,channelID: forumID, postID, commentID: newId,  author, message: `${postTitle} ??? ${message}`, type: 'New comment', timestamp: serverTimestamp(), requestedResponse: requestedResponse, notify: notify });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

export const GetPost = async({ domain, postID, forumID, userID } : { domain: string, postID: string, forumID: string, userID: string }) => { 

  try {
    const ref = doc(db, "channels", domain, "forums", forumID, "posts", postID);
    console.log(ref)
    const data = await getDoc(ref);
    const getUserDoc = await getDoc(doc(db, "users", userID));
    const user =  getUserDoc.data();
    const allData = data.data();
    const notifiedOnAllReplies = user.followed_posts !== undefined ? user.followed_posts.includes(postID) : false;

    console.log(notifiedOnAllReplies)
    return {...allData, date: allData.timestamp.toDate(), notifiedOnAllReplies};
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
}

export const GetForum = async({ domain, forumID, userID } : { domain: string, forumID: string, userID: string }) => { 
  console.log('GET FORUM', userID)
  try {
    const ref = doc(db, "channels", domain, "forums", forumID);
    const data = await getDoc(ref);
    const getUserDoc = await getDoc(doc(db, "users", userID));
    const user =  getUserDoc.data();
    const allData = data.data();

    const notifiedOnPostsAndReplies = user.notified_on_post_and_replies.includes(forumID);
    const notifiedOnPosts = user.notified_on_post.includes(forumID);
    const onlyOnMentions = !notifiedOnPosts && !notifiedOnPostsAndReplies;
    
    return {...allData, notifiedOnPostsAndReplies, notifiedOnPosts, onlyOnMentions};
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
}

export const GetAllUsers = async({ domain } : { domain: string }) => { 
  console.log(domain)
  try {
    const q = query(collection(db, "users"), where("domain", "==", domain));
    const querySnapshot = await getDocs(q);
    const users: any [] = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      users.push(doc.data());
    });
    return users;
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
}


export const GetAllPosts = ({ domain, forumID } : {domain: string, forumID: string}) => {
  return (dispatch: any) => {
    dispatch({type: FETCH_ALL_POSTS, payload: {loading: true, all_posts: []}})
    onSnapshot(collection(db, `channels/${domain}/forums/${forumID}/posts`), (querySnapshot) => {
      const posts: any[] = [];
      querySnapshot.forEach((doc) => {
        posts.push(doc.data());
      });

      dispatch({type: FETCH_ALL_POSTS, payload: {loading: false, all_posts: sortAfterDateDesc(posts) }})
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

export const GetAllComments = ({ domain, postID, forumsID } :{ domain: string, postID: string, forumsID: string }) => {
  return (dispatch: any) => {
    dispatch({
      type: FETCH_ALL_COMMENTS,
      payload: { loading: true, all_comments: [] },
    });
    onSnapshot(collection(db, `channels/${domain}/forums/${forumsID}/posts/${postID}/comments`), (querySnapshot) => {
      const comments: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({...data, date: data.timestamp.toDate()});
      });

      dispatch({
        type: FETCH_ALL_COMMENTS,
        payload: { loading: false, all_comments: sortAfterDateDesc(comments) },
      });
    });
  };
};

const putPrioFirst = (arr: any) => {
  const result = arr.sort( (a: any,b: any) => !(a.requestedResponse ^ b.requestedResponse) ? 0 : a.requestedResponse ? -1 : 1)
  return result;
}

export const GetAllNotifications = ({ userID } :{ userID: string }) => {
  return (dispatch: any) => {
    dispatch({
      type: FETCH_ALL_NOTIFICATIONS,
      payload: { loading: true, all_notifications: [] },
    });
    onSnapshot(collection(db, `users/${userID}/notifications`), (querySnapshot) => {
      const notifications: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({...data, date: data.timestamp.toDate()});
      });

      const afterDate = sortAfterDateAsc(notifications);
      const prioFirst = putPrioFirst(afterDate);

      dispatch({
        type: FETCH_ALL_NOTIFICATIONS,
        payload: { loading: false, all_notifications: prioFirst },
      });
    });
  };
};


export const channelNotificationsSettings = async ({userID, notifyOn, channelID} : {userID: string, notifyOn?: string, postID?: string, channelID?: string}) => {
  if(notifyOn === 'posts_and_replies'){
    await setDoc(doc(db, "users", userID), {
      notified_on_post_and_replies: arrayUnion(channelID),
      notified_on_post: arrayRemove(channelID),
    }, {merge: true});
  } else if(notifyOn === 'posts') {
    await setDoc(doc(db, "users", userID), {
      notified_on_post_and_replies: arrayRemove(channelID),
      notified_on_post: arrayUnion(channelID),
    }, {merge: true});
  } else {
    await setDoc(doc(db, "users", userID), {
      notified_on_post_and_replies: arrayRemove(channelID),
      notified_on_post: arrayRemove(channelID),
    }, {merge: true});
  }
};

export const postNotificationsSettings = async ({userID, notifyOn, postID} : {userID: string, notifyOn?: string, postID?: string}) => {
  console.log(userID, postID)
  if(notifyOn === 'all_replies'){
    await setDoc(doc(db, "users", userID), {
      followed_posts: arrayUnion(postID),
    }, {merge: true});
  } else {
    await setDoc(doc(db, "users", userID), {
      followed_posts: arrayRemove(postID),
    }, {merge: true});
  }
};


export const CreateNotification = async ({message, author, link, type, timestamp, requestedResponse, notify, channelID, postID, commentID}: any) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    
    querySnapshot.forEach(async (user) => {
      const newId = await firestoreAutoId();
      const {notified_on_post, notified_on_post_and_replies, followed_posts} = user.data();
      const requestResponse = requestedResponse !== undefined ? await requestedResponse.some(({email}: {email: string}) => email === author.email) : false;
              console.log('REQUEST RESPONSE', requestResponse, requestedResponse)
      const notifed = notify !== undefined ? await notify.some(({email}: {email: string}) => email === author.email) : false;

      if(notifed || type === 'New forum' || requestResponse) {
        await setDoc(doc(db, "users", user.id, 'notifications', newId), {message, author, link, type, id: newId, timestamp, read: false, requestedResponse: requestResponse});
      } else if(notified_on_post_and_replies.includes(channelID)) {
        await setDoc(doc(db, "users", user.id, 'notifications', newId), {message, author, link, type, id: newId, timestamp, read: false, requestedResponse: requestResponse});
      } else if(followed_posts.includes(postID)) {
        await setDoc(doc(db, "users", user.id, 'notifications', newId), {message, author, link, type, id: newId, timestamp, read: false, requestedResponse: requestResponse});
      }
        else if(type ==='New post' && notified_on_post.includes(channelID)) { 
        await setDoc(doc(db, "users", user.id, 'notifications', newId), {message, author, link, type, id: newId, timestamp, read: false, requestedResponse: requestResponse});
      }
    });
  }
  catch(err: any) {
    console.error(err);
    alert(err.message);
  }
}

export const RemoveNotification = async ({ userID, id }: {userID: string, id: string}) => {
  try {
    await deleteDoc(doc(db, "users", userID, 'notifications', id));
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

