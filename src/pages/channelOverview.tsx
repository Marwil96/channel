import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, addPost, GetAllPosts } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Layout from "src/components/Layout";

const ChannelOverview = () => {
  let { channelName } = useParams();
  const [user, loading, error] = useAuthState(auth);
  const {allPosts} = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const [userDomain, setUserDomain] = useState('')
  const [userDetails, setUserDetails] = useState({displayName: '', email: '', photoUrl: ''})
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(GetAllPosts({domain: channelName}))
  }, [])


  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    
    if(user) {
     setUserDomain(getDomain({email: user.email}))
     setUserDetails({displayName: user.displayName, email: user.email, photoUrl: user.photoURL})
    }
    if (!user && userDomain !== channelName) navigate("/");
  }, [user, loading]);

  const createPostHelper = async () => {
    await addPost({domain: channelName, title: title, body: body, author: {...userDetails}})
  }

  return (
    <Layout>
      <div style={{display:'flex', flexDirection:'column',}}>
       <h1>{channelName}</h1>
        {!loading && 
          <>
            <img src={userDetails.photoUrl} style={{width: 40, height: 40}} alt='profile'/>
            <h2>{userDetails.displayName}</h2>
            <h3>{userDetails.email}</h3>
          </>
        }
        <input placeholder="title" onChange={(e) => setTitle(e.target.value)} value={title} />
        <textarea placeholder="body text" onChange={(e) => setBody(e.target.value)} value={body} />
       <button onClick={() => title.length > 0 && body.length > 0 && createPostHelper()} style={{background: title.length === 0 || body.length === 0 ? 'white' : 'orange'}}>
         Create Post
       </button>
       <h1>All Posts</h1>
       {allPosts.map(({title, body, author, id} : {title: string, body: string, author?: any, id: string}, index: any) => <button onClick={() => navigate(`/channels/${channelName}/${id}`)} key={index} style={{display: 'flex', cursor: 'pointer', flexDirection:'column', padding: '24px', background: '#f1f1f1'}}> <img src={author.photoUrl} style={{width: 40, height: 40}} alt='profile'/><h5>{author.email}</h5><h3>{title}</h3><p>{body}</p></button>)}
      </div>
    </Layout>
  );
}
export default ChannelOverview;