import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "../actions/database";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div >
      <div >
        <button onClick={signInWithGoogle}>
          Login with Google
        </button>
      </div>
    </div>
  );
}
export default Login;