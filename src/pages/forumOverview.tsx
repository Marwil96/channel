import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { auth, GetPost, PostComment, GetAllComments, GetForum, GetAllPosts } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Spinner from "src/components/Spinner";
import { styled } from "../stitches.config";
import Button from "src/components/Button";
import PostCard from "src/components/PostCard";

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

const ForumOverview = () => {
  let { channelName, forumID } = useParams();
  const [loadingForum, setLoadingForum] = useState(false);
  const {allComments, allPosts} = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const {user, userLoading, openPopup}: {user: any, userLoading:any, openPopup?: any} = useOutletContext();
  const [message, setMessage] = useState('');
  const [forum, setForum] = useState({title: '', desc: '', id: '', author: {displayName: '', email: '', photoUrl: ''}})
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const AsyncFunc = async () => {
      setLoadingForum(true)
      const result = await GetForum({forumID: forumID, domain: channelName})
      setForum({title: result.title, desc: result.desc, author: result.author, id: result.id})
      dispatch(GetAllPosts({domain: channelName, forumID: forumID}))
      setLoadingForum(false)
    }

    // dispatch(GetAllComments({domain: channelName, forumID: forumID}))
    AsyncFunc()
  }, [forumID])

  useEffect(() => {
    console.log(allPosts)
  }, [allPosts])

  return (
    <ForumWrapper >
      <ForumContent style={{display:'flex', flexDirection:'column'}}>
        {loadingForum ? <Spinner /> : 
        <>
          <ForumTitle>{forum.title}</ForumTitle>
          <ForumDesc>{forum.desc}</ForumDesc>
        </>}

        <Header>
          <Subtitle>All Posts</Subtitle>
          <Button onClick={() => openPopup({state: true, type:'createPost'})}>Add Post</Button>
        </Header>
        {allPosts.map(({title, body, author, id}: {title: string, body: string, author: any, id: string}) => <PostCard onClick={() => navigate(`/channels/${channelName}/${forumID}/${id}`)} title={title} body={body} username={author.displayName} profileImage={author.photoUrl}  />)}
      </ForumContent>
    </ForumWrapper>
  );
}
export default ForumOverview;