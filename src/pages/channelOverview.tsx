import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// import { auth, CreatePost, GetAllPosts } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Layout from "src/components/Layout";
import Spinner from "src/components/Spinner";

const ChannelOverview = () => {
  let { channelName } = useParams();
  const {allPosts} = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const {user, userLoading}: {user: any, userLoading:any} = useOutletContext();
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const navigate = useNavigate();

  console.log(user, userLoading)

  const createPostHelper = async () => {
    // await CreatePost({domain: channelName, title: title, body: body, author: {...user}})
  }

  return (
    <div>
      <div style={{display:'flex', flexDirection:'column',}}>
       <h1>{channelName}</h1>
        {userLoading ? <Spinner /> :
          <>
            <img src={user.photoUrl} style={{width: 40, height: 40}} alt='profile'/>
            <h2>{user.displayName}</h2>
            <h3>{user.email}</h3>
          </>
        }
        <input placeholder="title" onChange={(e) => setTitle(e.target.value)} value={title} />
        <textarea placeholder="body text" onChange={(e) => setBody(e.target.value)} value={body} />
       <button onClick={() => title.length > 0 && body.length > 0 && createPostHelper()} style={{background: title.length === 0 || body.length === 0 ? 'white' : 'orange'}}>
         Create Post
       </button>
       <h1>Dashboard</h1>
       {allPosts.map(({title, body, author, id} : {title: string, body: string, author?: any, id: string}, index: any) => <button onClick={() => navigate(`/channels/${channelName}/${id}`)} key={index} style={{display: 'flex', cursor: 'pointer', flexDirection:'column', padding: '24px', background: '#f1f1f1'}}> <img src={author.photoUrl} style={{width: 40, height: 40}} alt='profile'/><h5>{author.email}</h5><h3>{title}</h3><p>{body}</p></button>)}
      </div>
    </div>
  );
}
export default ChannelOverview;