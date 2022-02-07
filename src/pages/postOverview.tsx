import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, GetPost, PostComment, GetAllComments } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";

const PostOverview = () => {
  let { channelName, postID, forumID } = useParams();
  const [loadingPost, setLoadingPost] = useState(false);
  const {allComments} = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const [userDomain, setUserDomain] = useState('')
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState({displayName: '', email: '', photoUrl: ''})
  const [post, setPost] = useState({title: '', body: '', author: {displayName: '', email: '', photoUrl: ''}})
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const AsyncFunc = async () => {
      setLoadingPost(true)
      const result = await GetPost({postID: postID, domain: channelName, forumID: forumID})
      console.log(result)
      setPost({title: result.title, body: result.body, author: result.author})
      setLoadingPost(false)
    }

    // dispatch(GetAllComments({domain: channelName, postID: postID}))
    AsyncFunc()
  }, [])


  const postCommentHelper = async () => {
    // await PostComment({domain: channelName, postID: postID, message: message, author: {...userDetails}})
  }

  return (
    <div >
      <div style={{display:'flex', flexDirection:'column'}}>
        {!loadingPost && 
        <div>
          <h1>{post.title}</h1>
          <h5>Author</h5>
          <img src={post.author.photoUrl} alt='post' style={{width: 40, height: 40}} />
          <h2>{post.author.displayName}</h2>
          <h3>{post.author.email}</h3>

          <h5>Message</h5>
          <p>{post.body}</p>
            
        </div>}

        <h5>Comments</h5>
          {allComments && allComments.map((comment: any, index: any) => <div key={index} style={{display:'flex', flexDirection:'row'}}><h5 style={{marginRight: 16}}>{comment.author.displayName}</h5> <p>{comment.message}</p></div>)}
        <input placeholder="Message" onChange={(e) => setMessage(e.target.value)}/>
        <button onClick={() => message.length > 0 && postCommentHelper()} style={{background: message.length === 0 ? 'white' : 'orange'}}>
         Create Post
       </button>
      </div>
    </div>
  );
}
export default PostOverview;