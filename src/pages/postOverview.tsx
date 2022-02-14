import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { auth, GetPost, PostComment, GetAllComments, GetAllUsers } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { styled } from "src/stitches.config";
import Spinner from "src/components/Spinner";
import PostCard from "src/components/PostCard";
import Input from "src/components/Input";
import Button from "src/components/Button";
import { Mention, MentionsInput } from "react-mentions";


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

const PostOverview = () => {
  let { channelName, postID, forumID }: {channelName?: string, postID?: string, forumID?: string} = useParams();
  const [loadingPost, setLoadingPost] = useState(false);
  const { allComments } = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const [userDomain, setUserDomain] = useState('')
  const { user, userLoading }: {user: any, userLoading:any} = useOutletContext();
  const [message, setMessage] = useState('');
  const [post, setPost] = useState({title: '', body: '', author: {displayName: '', email: '', photoUrl: ''}})
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [postSubject, setPostSubject] = useState('');
  const [body, setBody] = useState("");
  const [userTerm, setUserTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersUnedited, setAllUsersUnedited] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [notifyUsers, setNotifyUsers] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => { 
      const result = await GetAllUsers({domain: channelName})
      const reMadeArray = result.map((user: any, index: any) => ({...user, id: index, display: user.email}))
      setAllUsers(reMadeArray)
      setAllUsersUnedited(reMadeArray)
      setFilteredUsers(result)
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
        console.log('UNIQUEMENTIONS', uniqueMentions)
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
        {/* <Input placeholder="Message" onChange={(e: any) => setMessage(e.target.value)}/> */}

        <MentionsInput
            value={body}
            onChange={(e, newPlainTextValue): any => handleChange(e.target.value, 'body', newPlainTextValue)} 
            style={{width: '-webkit-fill-available', height: '20rem', padding: '0.8rem 1.6rem'}} 
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
          </MentionsInput>
        <Button onClick={() => message.length > 0 && postCommentHelper()}>
         Post Comment
       </Button>
      </Content>
    </Wrapper>
  );
}
export default PostOverview;