import React from 'react';
import logo from './logo.svg';
import './App.css';
// Import the functions you need from the SDKs you need
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ChannelOverview from './pages/channelOverview';
import PostOverview from './pages/postOverview';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries




const App = (): JSX.Element => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="channels/:channelName" element={<ChannelOverview />} />
           <Route path="channels/:channelName/:postID" element={<PostOverview />} />
        </Routes>
      </Router>
  )
};

export default App;
