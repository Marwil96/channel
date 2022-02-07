import React from 'react';
import { styled } from '../stitches.config';

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f1f1f1',
  padding: '$2',
  cursor: 'pointer',

  '&:nth-child(odd)': {
    backgroundColor: '#E8E8E8',
  },

  '&:hover': {
    opacity: '0.5',
  }
});

const Title = styled('span', {
  fontSize: '$2',
})

const ProfileImage = styled('img', {
  width: '3.2rem',
  height: '3.2rem',
  borderRadius: '100%',
  marginRight: '$1',
  objectFit: 'cover'
});

const Username = styled('span', {
  fontSize: '$2',
  fontWeight: '500',
  color: '$mono',
  marginRight: '$4',
})

const PostCard = ({title, profileImage, username, body, onClick}: {onClick?: any, title: string, username: string, profileImage: string, body: string}) => {
  return (
    <Wrapper onClick={onClick}>
      <ProfileImage src={profileImage} />
      <Username>{username}</Username>
      <Title>{title}</Title>
    </Wrapper>
  )
}

export default PostCard;