import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// import { auth, CreatePost, GetAllPosts } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Layout from "src/components/Layout";
import Spinner from "src/components/Spinner";
import { styled } from "src/stitches.config";
import Button from "src/components/Button";
import { GetAllNotifications } from "src/actions/database";
import Accordion from "src/components/Accordion";


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
  fontWeight: '600',
  marginBottom: '0.6rem',
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

const ChannelOverview = () => {
  const { allNotifications } = useSelector((state: RootStateOrAny) => state.DatabaseReducer);
  const {user, userLoading}: {user: any, userLoading:any} = useOutletContext();
  const dispatch = useDispatch();


  useEffect(() => {
    if(user?.userID.length > 0 && !userLoading) {
      dispatch(GetAllNotifications({userID: user.userID}))
    }
  }, [userLoading, user])
  

  return (
    <Wrapper >
      <Content style={{display:'flex', flexDirection:'column'}}>

        <Title css={{marginBottom: '$6'}}>Inbox</Title>

        <Header>
          <Subtitle>All</Subtitle>
        </Header>
        {allNotifications.length === 0 ? <Title css={{textAlign: 'center', marginTop: '4.2rem'}}>Empty Inbox</Title> : <Accordion sections={[{title: 'All', data:allNotifications, userID: user.userID}]} />}
      </Content>
    </Wrapper>
  );
}
export default ChannelOverview;