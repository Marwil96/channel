import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { auth, GetPost, PostComment, GetAllComments, GetForum, GetAllPosts, channelNotificationsSettings } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Spinner from "src/components/Spinner";
import { styled } from "../stitches.config";
import Button from "src/components/Button";
import PostCard from "src/components/PostCard";
import SubscribeDropdown from "src/components/SubscribeDropdown";

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
  marginBottom: '0.3rem'
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

const UpperSection = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  paddingBottom: '$4',
  marginBottom: '$6',
  borderBottom: '1px solid black'
})

const ForumOverview = () => {
  let { channelName, forumID } = useParams();
  const [loadingForum, setLoadingForum] = useState(false);
  const {allComments, allPosts} = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const {user, userLoading, openPopup, popupState}: {user: any, userLoading:any, openPopup?: any, popupState?: boolean} = useOutletContext();
  const [message, setMessage] = useState('');
  const [forum, setForum] = useState({notifiedOnPostsAndReplies: false, notifiedOnPosts: false, onlyOnMentions: false, title: '', desc: '', id: '', author: {displayName: '', email: '', photoUrl: ''}})
  const [notificationSetting, setNotificationSetting] = useState(forum.notifiedOnPostsAndReplies? 'postsAndReplies' : forum.notifiedOnPosts? 'posts' : 'mentions');
  const [notificationMenuState, setNotificationMenuState] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const AsyncFunc = async () => {
      setLoadingForum(true)
      const result = await GetForum({forumID: forumID, domain: channelName, userID: user.userID})

      setNotificationSetting(result.notifiedOnPostsAndReplies? 'postsAndReplies' : result.notifiedOnPosts? 'posts' : 'mentions')
      //@ts-ignore
      setForum({...result})
      console.log('RESULT', result)
      dispatch(GetAllPosts({domain: channelName, forumID: forumID}))
      setLoadingForum(false)
    }

    // dispatch(GetAllComments({domain: channelName, forumID: forumID}))
    if(user.userID.length > 0 && !userLoading) {
      AsyncFunc()
    }
  }, [user, forumID])

  useEffect(() => {
    let state = false;
    if(user.userID.length > 0 && !userLoading) {
      if(!popupState) {
        window.addEventListener('keyup', e => {
          if(state || notificationMenuState) {
            if(e.key === 's') {
              channelNotificationsSettings({userID: user.userID, notifyOn: 'posts', channelID: forumID}); 
              setNotificationSetting('posts');
            }

            if(e.key === 'a') {
              channelNotificationsSettings({userID: user.userID, notifyOn: 'posts_and_replies', channelID: forumID}); 
              setNotificationSetting('postsAndReplies');
            }

            if(e.key === 'u') {
              channelNotificationsSettings({userID: user.userID, notifyOn: '', channelID: forumID}); 
              setNotificationSetting('mentions');
            }
          }

          if(!notificationMenuState && e.key === 's') {
            console.log('OPENING MENU')
            setNotificationMenuState(true)
            state = true
          }

          if(e.key === 'Escape') {
            setNotificationMenuState(false)
            state = false
          }
        });
      }
   }
  }, [user, popupState]);

  useEffect(() => {
    console.log(allPosts)
  }, [allPosts])

  return (
    <ForumWrapper >
      <ForumContent style={{display:'flex', flexDirection:'column'}}>
        <UpperSection>
          {loadingForum ? <Spinner /> : 
          <div>
            <ForumTitle>{forum.title}</ForumTitle>
            <ForumDesc>{forum.desc}</ForumDesc>
          </div>}

          <SubscribeDropdown 
            open={notificationMenuState}
            onMouseEnter={() => setNotificationMenuState(true)}
            onMouseLeave={() => setNotificationMenuState(false)}
            title={notificationSetting === 'postsAndReplies' ? 'Notify on Posts and Replies' : notificationSetting === 'posts' ? 'Notify on Posts' : 'Notify on Mentions'}
            allOptions={
              [
                {
                  title: 'Subscribe to all posts and replies',
                  shortCut: 'A',
                  onClick:() => {channelNotificationsSettings({userID: user.userID, notifyOn: 'posts_and_replies', channelID: forumID}); setNotificationSetting('postsAndReplies')},
                  active:notificationSetting === 'postsAndReplies'
                },
                {
                  title: "Subscribe to all posts I'm involved in",
                  shortCut: 'S',
                  onClick:() => {channelNotificationsSettings({userID: user.userID, notifyOn: 'posts', channelID: forumID}); setNotificationSetting('posts')},
                  active: notificationSetting === 'posts'
                },
                {
                  title: 'Unsubscribe, mentions only',
                  shortCut: 'U',
                  onClick:() => {channelNotificationsSettings({userID: user.userID, notifyOn: '', channelID: forumID}); setNotificationSetting('mentions')},
                  active:notificationSetting === 'mentions'
                }
              ]
            }
          />
        </UpperSection>

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