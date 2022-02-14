import React, { useEffect, useRef, useState } from 'react';
import { styled, keyframes } from '@stitches/react';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as DialogPrimitive from '@radix-ui/react-dialog';
//ts-ignore
import { MentionsInput, Mention } from 'react-mentions'
import { CreateForum, CreatePost, GetAllUsers } from 'src/actions/database';

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: '#00000073',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  padding: 25,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&:focus': { outline: 'none' },
});

function Content({ children, ...props }:{children?: any, props?: any }) {
  return (
    <DialogPrimitive.Portal>
      <StyledOverlay  />
      <StyledContent {...props}>{children}</StyledContent>
    </DialogPrimitive.Portal>
  );
}

const StyledTitle = styled(DialogPrimitive.Title, {
  margin: 0,
  fontWeight: 500,
  fontSize: '$3',
  marginBottom: '$4'
});

const StyledDescription = styled(DialogPrimitive.Description, {
  margin: '10px 0 20px',
  fontSize: 15,
  lineHeight: 1.5,
});

// Exports
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = Content;
const DialogTitle = StyledTitle;
const DialogDescription = StyledDescription;
const DialogClose = DialogPrimitive.Close;

// Your app...
const Flex = styled('div', { display: 'flex' });
const Box = styled('div', {});

const Button = styled('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,
  cursor: 'pointer',

  variants: {
    variant: {
      violet: {
        backgroundColor: 'white',
        color: 'blue',
        boxShadow: `0 2px 10px ${'blue'}`,
        '&:hover': { backgroundColor: 'blue' },
        '&:focus': { boxShadow: `0 0 0 2px black` },
      },
      green: {
        backgroundColor: '$text',
        color: '#fff',
        fontWeight: 400,
        '&:hover': { backgroundColor: '#333' },
        '&:focus': { boxShadow: `0 0 0 2px 'blue'` },
      },
    },
  },

  defaultVariants: {
    variant: 'violet',
  },
});

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 25,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#000',
  position: 'absolute',
  top: 10,
  right: 10,
  cursor: 'pointer',

  '&:hover': { backgroundColor: '#333' },
  '&:focus': { boxShadow: `0 0 0 2px #000` },
});

const Fieldset = styled('fieldset', {
  all: 'unset',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'flex-start',
  marginBottom: '$5',
  width: '100%',

  // '.mentions__request-response': {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: '100%',
  //   width: '100%',
  //   background: 'blue',
  // }
});

const Label = styled('label', {
  fontSize: '$2',
  color: '#000',
  fontFamily: '$mono',
  textAlign: 'left',
});

const Input = styled('input', {
  all: 'unset',
  width: '-webkit-fill-available',
  flex: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '$2',
  lineHeight: 1,
  padding: '0.8rem $1',
  color: '#000',
  boxShadow: '0 0 0 1px #000',

  '&:focus': { boxShadow: `0 0 0 2px #000` },
});

const TextArea = styled('textarea', {
  all: 'unset',
  width: '100%',
  height: '12rem',
  flex: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0.8rem 0.8rem',
  fontSize: 15,
  lineHeight: 1.3,
  color: '#000',
  boxShadow: `0 0 0 1px #000`,

  '&:focus': { boxShadow: `0 0 0 2px #000` },
});

const UsersSubtitle = styled('span', {
  fontSize: '$2',
  color: '#000',
  fontFamily: '$mono',
});
const UsersWrapper = styled('div', {
  display: 'flex',
  // marginBottom: '2rem'
})

const UserBox = styled('div', {
  padding: '0.6rem',
  background: "#f1f1f1",
  width: 'fit-content',
  fontSize: '$2',
  fontFamily: '$mono',
  cursor: 'pointer'
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

const SuggestionItemsWrapper = styled('div', {
  display: 'flex',
  width: '100%',
  borderBottom: '1px solid black',
  marginBottom: '2rem',
  paddingBottom: '0.6rem',

  'input': {
    border: '0',
    outline: 0,
  }
})

const CreatePostPopup = ({open, close, user, domain, forumID}: {open?: boolean, close?: any, user: any, domain: string, forumID?: string }) => {
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
      const result = await GetAllUsers({domain})
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

  return (
    <Dialog open={open}>
      <DialogContent >
        <DialogTitle>Create Post</DialogTitle>
        {/* <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription> */}
        <Fieldset>
          <Label htmlFor="postSubject">Subject</Label>
          <Input id="postSubject" value={postSubject} onChange={(e) => setPostSubject(e.target.value)} placeholder="Post Subject" />
        </Fieldset>

        <Fieldset>
          <Label>Notify</Label>
          <UsersWrapper style={{ marginRight: '1.2rem' }}>
            {notifyUsers.map((user: any) => <UserBox onClick={() => {setNotifyUsers(selectedUsers.filter((item) => item.email !== user.email))}}>{user.email}</UserBox>)}
          </UsersWrapper>
        </Fieldset>
        <Fieldset>
          <Label htmlFor="requestResponse">Request Response</Label>
          <SuggestionItemsWrapper>
            <UsersWrapper style={{ marginRight: '1.2rem' }}>
              {selectedUsers.map((user: any) => <UserBox onClick={() => {setSelectedUsers(selectedUsers.filter((item) => item.email !== user.email))}}>{user.email}</UserBox>)}
            </UsersWrapper>
            <MentionsInput 
              value={userTerm}
              singleLine={true}
              onChange={(e, newPlainTextValue): any => handleChange(e.target.value, 'subject', newPlainTextValue)} 
              style={{width: '100%'}} 
              placeholder='Add users'
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
            </MentionsInput>
          </SuggestionItemsWrapper>
        </Fieldset>

        <Fieldset>
          <Label htmlFor="body">Forum Body</Label>
          {/* <TextArea id="body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Desc" /> */}
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
        </Fieldset>

        <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
          <DialogClose asChild onClick={async () =>{ await CreatePost({ domain: domain, forumID: forumID, title: postSubject, body: body, author: user, requestedResponse: selectedUsers, notify: notifyUsers}); close()}}>
            <Button aria-label="Close" variant="green">
              Create Post
            </Button>
          </DialogClose>
        </Flex>
        
        <DialogClose asChild onClick={() => close()}>
          <IconButton>
            <Cross2Icon />
          </IconButton>
        </DialogClose>

      </DialogContent>
    </Dialog>
  )
};

export default CreatePostPopup;

