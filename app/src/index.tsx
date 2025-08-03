import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { WebStorageStateStore } from 'oidc-client-ts';

const cognitoAuthConfig: AuthProviderProps = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_xORCGl7n7",
  client_id: "6sjrkpl6krlmq6365hke6uq8sm",
  redirect_uri: "https://kerri.dev",
  response_type: "code",
  scope: "email openid phone",
  userStore: new WebStorageStateStore({store: window.localStorage})
};

const el = document.getElementById("root")
if (el) {
    const root = ReactDOM.createRoot(el);
    // wrap the application with AuthProvider
    root.render(
    <React.StrictMode>
        <AuthProvider {...cognitoAuthConfig}>
            <App />
        </AuthProvider>
    </React.StrictMode>
    );
}    



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
