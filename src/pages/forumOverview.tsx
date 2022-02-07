import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, GetPost, PostComment, GetAllComments, GetForum, GetAllPosts } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Spinner from "src/components/Spinner";
import { styled } from "../stitches.config";

const ForumWrapper = styled('section', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ForumContent = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '90rem',
  paddingTop: '$6'
});

const ForumTitle = styled('h1', {
  fontSize: '$6',
  fontWeight: '700',
  marginBottom: '0.6rem'
});

const ForumDesc = styled('span', {
  fontSize: '$4',
  fontWeight: '600',
  marginBottom: '$6'
});

const Subtitle = styled('span', {
  fontSize: '$3',
  marginBottom: '$2',
  fontWeight: '600',
  opacity: 0.8,
  textTransform: 'uppercase',
  fontFamily: '$mono',
})

const ForumOverview = () => {
  let { channelName, forumID } = useParams();
  const [user, loading, error] = useAuthState(auth);
  const [loadingForum, setLoadingForum] = useState(false);
  const {allComments, allPosts} = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const [userDomain, setUserDomain] = useState('')
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState({displayName: '', email: '', photoUrl: ''})
  const [forum, setForum] = useState({title: '', desc: '', id: '', author: {displayName: '', email: '', photoUrl: ''}})
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const AsyncFunc = async () => {
      setLoadingForum(true)
      const result = await GetForum({forumID: forumID, domain: channelName})
      // dispatch(GetAllPosts({domain: channelName, forumID: forumID}))
      setForum({title: result.title, desc: result.desc, author: result.author, id: result.id})
      setLoadingForum(false)
    }

    // dispatch(GetAllComments({domain: channelName, forumID: forumID}))
    AsyncFunc()
  }, [forumID])

  useEffect(() => {
    console.log(allPosts)
  }, [allPosts])



  const postCommentHelper = async () => {
    // await PostComment({domain: channelName, forumID: forumID, message: message, author: {...userDetails}})
  }

  return (
    <ForumWrapper >
      <ForumContent style={{display:'flex', flexDirection:'column'}}>
        {loadingForum ? <Spinner /> : 
        <>
          <ForumTitle>{forum.title}</ForumTitle>
          <ForumDesc>{forum.desc}</ForumDesc>
        </>}

        <Subtitle>All Posts</Subtitle>
        {allComments && allComments.map((comment: any, index: any) => <div key={index} style={{display:'flex', flexDirection:'row'}}><h5 style={{marginRight: 16}}>{comment.author.displayName}</h5> <p>{comment.message}</p></div>)}
        <input placeholder="Message" onChange={(e) => setMessage(e.target.value)}/>
        <button onClick={() => message.length > 0 && postCommentHelper()} style={{background: message.length === 0 ? 'white' : 'orange'}}>
         Create Post
       </button>
      </ForumContent>
    </ForumWrapper>
  );
}
export default ForumOverview;