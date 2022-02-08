import { ArchiveIcon, ArrowTopRightIcon, CopyIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { auth } from "../actions/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useParams } from 'react-router-dom';
import { styled } from '../stitches.config';
import Button from './Button';
import Spinner from './Spinner';
import { RootStateOrAny, useSelector } from 'react-redux';

const Wrapper = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '$2 $4',
  marginRight: '$5',
  borderRight: '1px solid $text',
  width: '15rem',
  height: '96.7vh',
  position: 'sticky',
  top: 0,
  left: 0,
});

const Title = styled('h1', {
  fontSize: '$3',
  marginBottom: '$5',
  cursor: 'pointer',
  
  '&:hover': {
    opacity: '0.5',
  }
});

const ActionItem = styled('span', {
  fontSize: '$2',
  display: 'flex',
  alignItems: 'center',
  fontWeight: '500',
  cursor: 'pointer',
  "&:hover": {
    opacity: '0.5',
  },

  'svg': {
    marginRight: '1rem'
  },

  variants: {
    highlighted: { 
      'true': {
        color: '$darkGreen'
      },
      'false': {

      }
    }
  }
});

const ActionsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '$5'
});

const ForumItem = styled('span', {
  fontSize: '$2',
  display: 'flex',
  alignItems: 'center',
  fontWeight: '500',
  color: '$text',
  cursor: 'pointer',
  "&:hover": {
    opacity: '0.5',
  },

  'svg': {
    marginRight: '1rem'
  }
});

const ForumsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '$2'
});


const Subtitle = styled('h2', {
  fontSize: '$1',
  marginBottom: '$3',
  opacity: 0.8,
  textTransform: 'uppercase',
  fontFamily: '$mono',
});

const ProfileTagWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  padding: '$1 $1',
  background: '#f1f1f1',
  cursor: 'pointer',
  marginBottom: '$3',

  '&:hover': {
    opacity: 0.8,
  }
});

const ProfileImage = styled('img', {
  width: '3.2rem',
  height: '3.2rem',
  borderRadius: '100%',
  marginRight: '$1',
  objectFit: 'cover'
});

const ProfileName = styled('span', {
  fontSize: '$2',
  fontWeight: '500',
  marginRight: '0.6rem',
});

const ProfileTag = ({username, image }: {username: string, image: string}) => {
  return (
    <ProfileTagWrapper>
      <ProfileImage src={image} />
      <ProfileName>{username}</ProfileName>
      <ArrowTopRightIcon />
    </ProfileTagWrapper>
  )
};

const ComposedForumItem = ({children, highlighted} : {children: React.ReactNode, highlighted?: boolean}) => (
  <ForumsWrapper>
    <ForumItem css={highlighted && {color:'$darkGreen'}}><CopyIcon /> {children}</ForumItem>
  </ForumsWrapper>
);

const Sidebar = ({user, loading, openPopup} : {user: any, loading: boolean, openPopup: any}) => {
  let { channelName, forumID } = useParams();
  const { allForums } = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  
  return (
    <Wrapper>
      <div>
        {/* Channel Title */}
        <Link to={`channels/${channelName}`}><Title>{channelName}</Title></Link>
        {/* Start Thread */}

        {/* All Actions */}
        <Subtitle>All Actions</Subtitle>
        <ActionsWrapper>
          <Link to={`/channels/${channelName}`}><ActionItem highlighted={forumID === undefined}> <ArchiveIcon /> Inbox </ActionItem></Link>
        </ActionsWrapper>
        {/* Inbox */}

        {/* All Threads */}
        <Subtitle>All Forums</Subtitle>
          <ActionsWrapper>
           {allForums.map(({title, id} : {title: string, id: string }) => <Link to={`/channels/${channelName}/${id}`}><ComposedForumItem highlighted={forumID === id}>{title}</ComposedForumItem></Link>)}
           <span style={{fontSize:'1.4rem', textDecoration:'underline', cursor: 'pointer'}} onClick={() => openPopup({state: true, type: 'createForum'})}>Start Forum</span>
          </ActionsWrapper>
      </div>
      {/* Thread List*/}

      {/* Userprofile */}
      <div>
        {!loading ? <ProfileTag image={user.photoUrl} username={user.displayName}  /> : <Spinner />}
        <Button fullWidth>Create Post</Button>
      </div>
    </Wrapper>
  )
}

export default Sidebar;
