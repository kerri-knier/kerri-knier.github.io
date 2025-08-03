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
    <div className="App tech-blog-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100vw' }}>
      <nav className="navbar tech-blog-navbar" style={{ width: '100vw' }}>
        <div className="navbar-content tech-blog-navbar-content">
            <span className="brand tech-blog-brand">kerri.dev</span>
          {auth.isAuthenticated ? (
            <div className="user-info tech-blog-user-info">
              <span className="username tech-blog-username">Hello, {username}!</span>
              <button className="modern-btn signout tech-blog-signout" onClick={signOutRedirect}>
                Sign out
              </button>
            </div>
          ) : (
            <button className="modern-btn signin tech-blog-signin" onClick={() => auth.signinRedirect()}>
              Sign In
            </button>
          )}
        </div>
      </nav>
      <main className="main-content tech-blog-main-content" style={{ flex: 1, width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Posts isAuthenticated={auth.isAuthenticated} />
      </main>
    </div>
  );
}

export default App;
