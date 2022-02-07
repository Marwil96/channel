import React, { Children } from 'react';
import { styled } from '../stitches.config';
import Sidebar from './Sidebar';

const Wrapper = styled('main', {
  display: 'flex',
});

const Layout = ({ children } : {children: any}) => {
  return (
    <Wrapper>
      <Sidebar />
      {children}
    </Wrapper>
  )
}

export default Layout;
