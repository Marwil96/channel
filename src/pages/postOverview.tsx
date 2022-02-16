import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { auth, GetPost, PostComment, GetAllComments, GetAllUsers, channelNotificationsSettings, postNotificationsSettings } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { styled } from "src/stitches.config";
import Spinner from "src/components/Spinner";
import PostCard from "src/components/PostCard";
import Input from "src/components/Input";
import Button from "src/components/Button";
import { Mention, MentionsInput } from "react-mentions";
import SubscribeDropdown from "src/components/SubscribeDropdown";
import ShortcutHint from "src/components/ShortcutHint";


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

const PostText = styled('p', {
  fontSize: '$3',
  fontWeight: '400',
  marginBottom: '$6',
  color: '#333',
  lineHeight: '2.3rem'
});

const Subtitle = styled('span', {
  fontSize: '$2',
  fontWeight: '500',
  opacity: 0.8,
  color: '$secondary',
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

const Label = styled('span', {
  fontSize: '$3',
  fontWeight: '400',
  color: '#868686',
})


const SuggestionWrapper = styled('div', { 
  padding: '1rem', 
  display: 'flex', 
  alignItems: 'center', 
  backgroundColor: '#f1f1f1',
  
  '&:hover': {
    opacity: 0.7,
  },

  "&:focus": {
    opacity: 0.5,
  }
})

const ReplyWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1.6rem',
  border: '1px solid black',
  borderRadius: '0.5rem',
  marginBottom: '1.2rem',
});

const ReplyHeader = styled('div', {
  marginBottom: '1rem',
  borderBottom: '1px solid #868686',
  paddingBottom: '0.6rem',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
});

const MentionsField = styled(MentionsInput, {
  border: 0,
  width: '-webkit-fill-available', 
  height: '10rem', 
  userSelect: 'all',

  '&:focus': { 
    border: '1px solid black'
  },

  'textArea, input': {
    border: 0,
    outline: 0,
    
    '&:focus': {
      border: '1px solid black',
    }
  },

  variants: {
    input: { 
      true : {
        width: '100%',
        height: 'auto',
      }
    }
  }
});

const UserTagWrapper = styled('div', {
  padding: '0.6rem',
  background: "#f1f1f1",
  borderRadius: '0.5rem',
  marginRight: '0.6rem',
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
});

const UserTagImage = styled('img', {
  borderRadius: '100%',
  width: '2.4rem',
  height: '2.4rem',
  marginRight: '0.6rem',
})

const UserTagName = styled('span', {
  fontSize: '1.6rem',
});

const UpperSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  paddingBottom: '$4',
  marginBottom: '$4',
  borderBottom: '1px solid black'
});

const UpperSectionRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '$6',

  '&:last-child': {
    marginBottom: '0',
  }
});

const TitleWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

const UserTag = ({name, image, onClick}: {name: string, image: string, onClick?: any}) => {
  return (
    <UserTagWrapper onClick={onClick}>
      <UserTagImage src={image} alt='user' />
      <UserTagName>{name}</UserTagName>
    </UserTagWrapper>
  )
}
const PostOverview = () => {
  let { channelName, postID, forumID }: {channelName?: string, postID?: string, forumID?: string} = useParams();
  const [loadingPost, setLoadingPost] = useState(false);
  const { allComments, allForums } = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const [userDomain, setUserDomain] = useState('')
  const { user, userLoading }: {user: any, userLoading:any} = useOutletContext();
  const [message, setMessage] = useState('');
  const [post, setPost] = useState({notifiedOnAllReplies: false, title: '', body: '', date: '', author: {displayName: '', email: '', photoUrl: ''}})
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [body, setBody] = useState("");
  const [userTerm, setUserTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersUnedited, setAllUsersUnedited] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([])
  const [notifyUsers, setNotifyUsers] = useState([]);
  const [notificationSetting, setNotificationSetting] = useState(post.notifiedOnAllReplies ? 'allReplies' : 'mentions');
  const [notificationMenuState, setNotificationMenuState] = useState(false);
  const [inputActive, setInputActive] = useState(false)

  useEffect(() => {
    const asyncFunc = async () => { 
      const result = await GetAllUsers({domain: channelName})
      const reMadeArray = result.map((user: any, index: any) => ({...user, id: index, display: user.email}))
      setAllUsers(reMadeArray)
      setAllUsersUnedited(reMadeArray)
    } 
    asyncFunc()
  }, [])


  const handleChange = async (value: string, type: string, newPlainTextValue: string) => { 
    const regex = /[^{}]+(?=})/g;
    let mentions = value.match(regex);

    if(type === 'body') {
      setBody(value)

      //@ts-ignore
      if(newPlainTextValue.split('[')[0] === '@@') {
        const uniqueMentions = await uniq(mentions ? mentions : [])
        setSelectedUsers(uniqueMentions ? uniqueMentions.map((mention: any) => allUsersUnedited[parseInt(mention)] ) : []);
      } 

      if(newPlainTextValue.split('[')[0] === '@') {
        console.log('here', newPlainTextValue)
        const uniqueMentions = await uniq(mentions ? mentions : [])
        setNotifyUsers(uniqueMentions ? uniqueMentions.map((mention: any) => allUsersUnedited[parseInt(mention)] ) : []);
      }
      
    } else {
      setUserTerm(value)
    }
  }

  const addUserHelper = async (user: any, type: string) => {
    const newSelectedUsers = [...selectedUsers, {...allUsers[user]}]
    const uniqueMentions = await removeDuplicates(newSelectedUsers)
    
    if(type === 'request_response') {
      setSelectedUsers(uniqueMentions);
    } else { 
      setNotifyUsers(uniqueMentions);
    }
  }

  const removeDuplicates = (arr: any) => { 
    return arr.filter((v:any,i:any,a: any)=>a.findIndex((t: any)=>(t.id===v.id))===i);
  }

  const uniq = async (a: any) => {
    return await a.sort().filter((item:any, pos:any, ary:any) => {
        return !pos || item !== ary[pos - 1];
    });
  }


  useEffect(() => {
    const AsyncFunc = async () => {
      setLoadingPost(true)
      const result = await GetPost({postID: postID, domain: channelName, forumID: forumID,userID: user.userID})
      console.log('RESULT', result)
      setNotificationSetting(result.notifiedOnAllReplies ? 'allReplies' : 'mentions')
      //@ts-ignore
      setNotifyUsers([{name: result.author.displayName, email: result.author.email, profileImage: result.author.photoUrl, id: result.author.id, }])
      //@ts-ignore
      setPost({...result})
      setLoadingPost(false)
    }

    dispatch(GetAllComments({domain: channelName, postID: postID, forumsID: forumID}))
    if(user.userID.length > 0 && !userLoading) {
      AsyncFunc()
    }
  }, [user])

  const keyListener = async (e: any) => {
    let state = false
    const ctrlKey = e.ctrlKey || e.metaKey;
    if(!inputActive){
      if(state || notificationMenuState) {
        if(e.key === 'a') {
          postNotificationsSettings({userID: user.userID, notifyOn: 'all_replies', postID: postID}); 
          setNotificationSetting('allReplies');
        }

        if(e.key === 'u') {
          postNotificationsSettings({userID: user.userID, notifyOn: '', postID: postID}); 
          setNotificationSetting('mentions');
        }
      }

      if(!notificationMenuState && e.key === 's') {
        setNotificationMenuState(true)
        state = true
      }

      if(e.key === 'Escape') {
        setNotificationMenuState(false)
        state = false
      }
    }

    if(ctrlKey && (e.key === 'Return ' || e.key === 'Enter')) {
      console.log('HELLO')
      postCommentHelper()
    }
  }

  useEffect(() => {
    if(user.userID.length > 0 && !userLoading) {
      window.addEventListener('keydown', keyListener);
    }

    return () => {
      window.removeEventListener('keydown', keyListener)
    };
  }, [user, notificationMenuState, inputActive]);


  const postCommentHelper = async () => {
    await PostComment({domain: channelName, postID: postID, forumID, message: body.split('}').pop(), author: {...user}, postTitle: post.title, requestedResponse: selectedUsers, notify: notifyUsers});
    setMessage('')
  }

  return (
    <Wrapper >
      <Content style={{display:'flex', flexDirection:'column'}}>
        <UpperSection>
          <UpperSectionRow>
            {loadingPost ? <Spinner /> : 
            <TitleWrapper>
              <Title>{post.title}</Title>
              <Subtitle>#{allForums.filter(({id}: any) => id === forumID )[0]?.title}</Subtitle>
            </TitleWrapper>}

            <SubscribeDropdown 
              open={inputActive ? false : notificationMenuState}
              onMouseEnter={() => setNotificationMenuState(true)}
              onMouseLeave={() => setNotificationMenuState(false)}
              title={notificationSetting === 'allReplies' ? 'Notify on all replies' : 'Notify on Mentions'}
              allOptions={
                [
                  {
                    title: 'Subscribe to all replies',
                    shortCut: 'A',
                    onClick:() => {postNotificationsSettings({userID: user.userID, notifyOn: 'all_replies', postID: postID}); setNotificationSetting('allReplies')},
                    active:notificationSetting === 'allReplies'
                  },
                  {
                    title: 'Unsubscribe, mentions only',
                    shortCut: 'U',
                    onClick:() => {postNotificationsSettings({userID: user.userID, notifyOn: '', postID: postID}); setNotificationSetting('mentions')},
                    active:notificationSetting === 'mentions'
                  }
                ]
              }
            />
          </UpperSectionRow>
          <UpperSectionRow>
            <UserTag image={user.photoUrl} name={user.displayName}/>
            {!loadingPost && <Subtitle>{new Date(post.date).toLocaleString()}</Subtitle> }
          </UpperSectionRow>
        </UpperSection>
        <PostText>{post.body}</PostText>

        {/* <Header>
          <Subtitle>All Comments</Subtitle>
        </Header> */}
         {allComments && allComments.map((comment: any, index: number) => <PostCard title={comment.message} profileImage={comment.author.photoUrl} username={comment.author.displayName}   />)}
        {/* <Input placeholder="Message" onChange={(e: any) => setMessage(e.target.value)}/> */}

        <ReplyWrapper>
          <ReplyHeader>
            <Label style={{marginRight: '1.2rem'}}>To:</Label>
            {removeDuplicates(notifyUsers.concat(selectedUsers)).map((user: any) => <span onClick={() => {setNotifyUsers(notifyUsers.filter((item) => item.email !== user.email)); setSelectedUsers(selectedUsers.filter((item) => item.email !== user.email))}} style={{width:'100%', maxWidth: 'fit-content', marginRight: '1.2rem'}}>{user.name}</span>)}
            <MentionsField 
              input={true}
              value={userTerm}
              singleLine={true}
              onChange={(e:any, newPlainTextValue: any) => handleChange(e.target.value, 'subject', newPlainTextValue)} 
              style={{width: '100%'}} 
              placeholder='Email'
            >
              <Mention
                trigger="@@"
                data={allUsers}
                appendSpaceOnAdd={true}
                renderSuggestion={(entry: any) => {
                  return (
                      <span style={{padding: '1rem', display: 'flex', alignItems: 'center', backgroundColor: '#f1f1f1'}}>
                        <img style={{width: 30, height: 30, marginRight: '1rem', padding: 0, borderRadius: '100%'}} src={allUsers[entry.id].profileImage} alt='profile' />
                        { entry.display }
                      </span>
                    );
                }}
                markup="[__display__]{__id__}"
                displayTransform={(id: any) => `@@${allUsersUnedited[id]?.name}`}
                //@ts-ignore
                onAdd={(user: any) => { addUserHelper(user, 'request_response'); setUserTerm('')}}            
              />

              <Mention
                trigger="@"
                markup="@[__display__]{__id__}"
                data={allUsers}
                className="mentions__mention"
                onAdd={(user: any) =>  addUserHelper(user, 'notify')}
                displayTransform={(id: any) => `@${allUsersUnedited[id]?.name}`}
                renderSuggestion={(entry: any) => {
                  return (
                      <SuggestionWrapper>
                        <img style={{width: 30, height: 30, marginRight: '1rem', padding: 0, borderRadius: '100%'}} src={allUsers[entry.id].profileImage} alt='profile' />
                        { entry.display }
                      </SuggestionWrapper>
                    );
                }}
              />
            </MentionsField>
          </ReplyHeader>
          <MentionsField
            value={body}
            onFocus={() => {setInputActive(true); setNotificationMenuState(false)}}
            onBlur={() => {setInputActive(false); setNotificationMenuState(false)}}
            placeholder='Reply body'
            onChange={(e:any, newPlainTextValue: any) => handleChange(e.target.value, 'body', newPlainTextValue)} 
          >

            <Mention
              trigger="@"
              markup="@[__display__]{__id__}"
              data={allUsers}
              className="mentions__mention"
              onAdd={(user: any) =>  addUserHelper(user, 'notify')}
              displayTransform={(id: any) => `@${allUsersUnedited[id]?.name}`}
              renderSuggestion={(entry: any) => {
                return (
                    <SuggestionWrapper>
                      <img style={{width: 30, height: 30, marginRight: '1rem', padding: 0, borderRadius: '100%'}} src={allUsers[entry.id].profileImage} alt='profile' />
                      { entry.display }
                    </SuggestionWrapper>
                  );
              }}
            />

            <Mention
              trigger="@@"
              markup="@@[__display__]{__id__}"
              data={allUsers}
              className="mentions__request-response"
              // style={{ backgroundColor: '#d1c4e9' }}
              onAdd={(user: any) =>  addUserHelper(user, 'request_response')}
              displayTransform={(id: any) => `@@${allUsersUnedited[id]?.name}`}
              renderSuggestion={(entry: any) => {
                return (
                    <SuggestionWrapper>
                      <img style={{width: 30, height: 30, marginRight: '1rem', padding: 0, borderRadius: '100%'}} src={allUsers[entry.id].profileImage} alt='profile' />
                      { entry.display }
                    </SuggestionWrapper>
                  );
              }}
            />
            </MentionsField>
          </ReplyWrapper>
        <ShortcutHint keys={[{displayed:'⌘', key: 'Meta'}, {displayed: 'Return', key:'Return'}]} action='To send' css={{marginTop: '1.2rem', alignSelf: 'flex-end'}} />
        {/* <Button style={{width:'12rem', alignSelf: 'self-end'}} onClick={() => body.length > 0 && postCommentHelper()}>
         Post Comment
       </Button> */}
      </Content>
    </Wrapper>
  );
}
export default PostOverview;