import {useState} from 'react';
import './App.css';
import './Post.css';
import {Posts} from "./Post";
import { useAuth } from "react-oidc-context";
import { Buffer } from 'buffer';

function App() {
  const auth = useAuth();
  const [username, setUsername] = useState("");

  const signOutRedirect = () => {
    auth.removeUser();
    const clientId = "6sjrkpl6krlmq6365hke6uq8sm";
    const logoutUri = "https://kerri.dev";
    const cognitoDomain = "https://eu-west-2xorcgl7n7.auth.eu-west-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isAuthenticated) {
    if (auth.user?.id_token) {
        const tokenPayload = JSON.parse(Buffer.from(auth.user.id_token.split('.')[1], 'base64').toString());
        console.log("payload:", tokenPayload)

        // Check if cognito:username is available
        let cognitoUser = tokenPayload['cognito:username'].toString();
        console.log("returned:", cognitoUser, "current:", username, cognitoUser === username)

        if (username !== cognitoUser) {
            setUsername(cognitoUser)
        }
    }
  }

  return (
      <div className="App">
        <div className={auth.isAuthenticated? 'visible':'hidden'}> 
            <pre> Hello: {username} </pre>
            <button onClick={() => signOutRedirect() }>Sign out</button> 
        </div>
        <div className={!auth.isAuthenticated? 'visible':'hidden'}> 
            <button onClick={() => auth.signinRedirect() }>Sign In</button> 
        </div>
        
        <header className="App-header">
            <Posts isAuthenticated={auth.isAuthenticated}></Posts>
        </header>
      </div>
    );
}

export default App;
