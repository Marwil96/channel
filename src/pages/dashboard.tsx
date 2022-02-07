import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDomain } from "../helperFunctions";
import { auth, addChannel } from "../actions/database";
import { styled } from "../stitches.config";
import Button from "src/components/Button";


function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  // const [domain, setDomain] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    
    if(user) {
    //  setDomain(getDomain({email: user.email}))
     createChannelHelper(getDomain({email: user.email}))
     
    }
    if (!user) navigate("/");
  }, [user, loading]);

  const createChannelHelper = async (domain: any) => {
    
    await addChannel({domain: domain})
    navigate(`/channels/${domain}`);
    
  }

  return (
    <div >
      <div >
       {/* {domain} */}
       <Button>
         Create Channel or Go to Channel
       </Button>
      </div>
    </div>
  );
}
export default Dashboard;