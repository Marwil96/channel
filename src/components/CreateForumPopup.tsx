import React, { useEffect, useState } from 'react';
import { styled, keyframes } from '@stitches/react';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { CreateForum } from 'src/actions/database';
import ShortcutHint from './ShortcutHint';

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

function Content({ children, closeFunction, ...props }:{closeFunction?: any, children?: any, props?: any }) {
  return (
    <DialogPrimitive.Portal>
      <StyledOverlay  />
      <StyledContent onEscapeKeyDown={closeFunction} {...props}>{children}</StyledContent>
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
  gap: 20,
  alignItems: 'center',
  marginBottom: 15,
});

const Label = styled('label', {
  fontSize: '$2',
  marginBottom: '1.2rem',
  color: '#000',
  fontFamily: '$mono',
  width: 90,
  textAlign: 'left',
});

const Input = styled('input', {
  all: 'unset',
  width: '-webkit-fill-available',
  flex: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 10px',
  fontSize: 15,
  lineHeight: 1,
  color: '#000',
  boxShadow: '0 0 0 1px #000',
  height: 35,

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
  color: 'blue',
  boxShadow: `0 0 0 1px #000`,

  '&:focus': { boxShadow: `0 0 0 2px #000` },
});

const CreateForumPopup = ({open, close, user, domain}: {open?: boolean, close?: any, user: any, domain: string }) => {
  const [forumName, setForumName] = useState('');
  const [forumDesc, setForumDesc] = useState('');
  // const [bio, setBio] = useState("");

  const keyListener = async (e: any) => {
    const ctrlKey = e.ctrlKey || e.metaKey;
    
    if(ctrlKey && (e.key === 'Return ' || e.key === 'Enter')) {
      await CreateForum({ domain: domain, title: forumName, desc: forumDesc, author: user}); 
      close();
    }
  }
  useEffect(() => {
    open && window.addEventListener('keydown', keyListener);

    return () => {
      window.removeEventListener('keydown', keyListener)
    };
  }, [open, forumName, forumDesc]);

  return (
    <Dialog open={open}>
      <DialogContent closeFunction={() => close()} >
        <DialogTitle>Create a new forum</DialogTitle>

        <Fieldset>
          <Label htmlFor="forumName">Forum Name</Label>
          <Input id="forumName" value={forumName} onChange={(e) => setForumName(e.target.value)} placeholder="Project Proposals" />
        </Fieldset>

        <Fieldset>
          <Label htmlFor="forumDesc">Description</Label>
          <Input id="forumDesc" value={forumDesc} onChange={(e) => setForumDesc(e.target.value)} placeholder="Propose projects and get feedback on your proposals." />
        </Fieldset>

        <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
          <ShortcutHint keys={[{displayed:'⌘', key: 'Meta'}, {displayed: 'Return', key:'Return'}]} action='To send' />
          {/* <DialogClose asChild onClick={async () =>{ await CreateForum({ domain: domain, title: forumName, desc: forumDesc, author: user}); close()}}> */}
            {/* <Button aria-label="Close" variant="green">
              Create Forum
            </Button> */}
          {/* </DialogClose> */}
          
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

export default CreateForumPopup;

