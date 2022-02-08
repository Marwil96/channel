import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { auth, GetPost, PostComment, GetAllComments } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { styled } from "src/stitches.config";
import Spinner from "src/components/Spinner";
import PostCard from "src/components/PostCard";
import Input from "src/components/Input";
import Button from "src/components/Button";


const Wrapper = styled('section', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Content = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '90rem',
  paddingTop: '$6'
});

const Title = styled('h1', {
  fontSize: '$6',
  fontWeight: '700',
  marginBottom: '0.6rem'
});

const Desc = styled('span', {
  fontSize: '$4',
  fontWeight: '600',
  marginBottom: '$6'
});

const Subtitle = styled('span', {
  fontSize: '$1',
  fontWeight: '600',
  opacity: 0.8,
  textTransform: 'uppercase',
  fontFamily: '$mono',
})

const Header = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '0',
  paddingBottom: '$2',
  borderBottom: '1px solid $black',
  width: '100%',
});

const PostOverview = () => {
  let { channelName, postID, forumID } = useParams();
  const [loadingPost, setLoadingPost] = useState(false);
  const { allComments } = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const [userDomain, setUserDomain] = useState('')
  const { user, userLoading }: {user: any, userLoading:any} = useOutletContext();
  const [message, setMessage] = useState('');
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

    dispatch(GetAllComments({domain: channelName, postID: postID, forumsID: forumID}))
    AsyncFunc()
  }, [])


  const postCommentHelper = async () => {
    await PostComment({domain: channelName, postID: postID, forumID, message: message, author: {...user}, postTitle: post.title})
    setMessage('')
  }

  return (
    <Wrapper >
      <Content style={{display:'flex', flexDirection:'column'}}>
        {loadingPost ? <Spinner /> : 
        <>
          <Title>{post.title}</Title>
          <Desc>{post.body}</Desc>
        </>}

        <Header>
          <Subtitle>All Comments</Subtitle>
        </Header>
         {allComments && allComments.map((comment: any, index: any) => <PostCard title={comment.message} profileImage={comment.author.photoUrl} username={comment.author.displayName}   />)}
        <Input placeholder="Message" onChange={(e: any) => setMessage(e.target.value)}/>
        <Button onClick={() => message.length > 0 && postCommentHelper()}>
         Post Comment
       </Button>
      </Content>
    </Wrapper>
  );
}
export default PostOverview;