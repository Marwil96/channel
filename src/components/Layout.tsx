import React, { Children, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { auth, GetAllForums, GetAllPosts } from 'src/actions/database';
import { getDomain } from 'src/helperFunctions';
import { styled } from '../stitches.config';
import CreateForumPopup from './CreateForumPopup';
import CreatePostPopup from './CreatePostPopup';
import Sidebar from './Sidebar';
import CommandBar from "../components/CommandBar/index";

const Wrapper = styled('main', {
  display: 'flex',
});

const Layout = ({ children } : {children?: any}) => {
  let { channelName, forumID } = useParams();
  const [user, loading, error] = useAuthState(auth);
  const [userDomain, setUserDomain] = useState('')
  const [userDetails, setUserDetails] = useState({displayName: '', email: '', photoUrl: '', userID: ''})
  const [openPopup, setOpenPopup] = useState({state: false, type: '', data: {}}) ;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(userDomain)
  useEffect(() => {
    if(channelName) {
      // dispatch(GetAllPosts({domain: channelName}))
      dispatch(GetAllForums({domain: channelName}))
    }
  }, [])


  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    console.log(user)
    if(user) {
     setUserDomain(getDomain({email: user.email}))
     setUserDetails({displayName: user.displayName, email: user.email, photoUrl: user.photoURL, userID: user.uid})
    }
    if (!user && userDomain !== channelName) navigate("/");
  }, [user, loading]);

  return (
    <CommandBar openPopup={setOpenPopup}>
      <Wrapper>
        <Sidebar user={userDetails} loading={loading} openPopup={setOpenPopup} />
        {<CreateForumPopup open={openPopup.type === 'createForum' && openPopup.state} domain={channelName} user={userDetails} close={() => setOpenPopup({state: false, type: '', data: {}})} />}
        {<CreatePostPopup open={openPopup.type === 'createPost' && openPopup.state} domain={channelName} user={userDetails}  popupData={openPopup.data} forumID={forumID} close={() => setOpenPopup({state: false, type: '', data: {}})} />}
        <Outlet context={{user: userDetails, userLoading: loading, openPopup: setOpenPopup, popupState: openPopup.state}}/>
      </Wrapper>
    </CommandBar>
  )
}

export default Layout;
