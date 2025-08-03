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
    const clientId = "6sjrkpl6krlmq6365hke6uq8sm";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://eu-west-2xorcgl7n7.auth.eu-west-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

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
    return (
      <div className="App">
        <pre> Hello: {username} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
        <header className="App-header">
                <Posts/>
            </header>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}

export default App;
