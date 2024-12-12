import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {GoogleOAuthProvider} from "@react-oauth/google";

const CLIENT_ID = "410765906017-jtfb9v6182t5kd6bg0sjbhpluvinqq2b.apps.googleusercontent.com"

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
);
