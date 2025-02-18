import {useEffect, useState} from 'react';
import './App.css';
import Title from './Title.jsx';
import AddForm from './AddForm.jsx';
import axios from 'axios';

function App() {
    const [user, setUser] = useState(null);

    // Check if user is authenticated
    useEffect(() => {
        axios.get('https://a4-drmihaichuk-backend.onrender.com/api/user', { withCredentials: true })
            .then((response) => {
                if (response.data.user) {
                    console.log("User Authenticated:", response.data.user);
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            })
    }, []);

    const handleLogout = () => {
        window.location.href = 'https://a4-drmihaichuk-backend.onrender.com/logout';
    };

    // If the user is not authenticated, show the login button
    if (!user) {
        return (
            <div>
                <p>Please log in to continue</p>
                <a href="https://a4-drmihaichuk-backend.onrender.com/auth/github"><button id="loginButton">Login with GitHub</button></a>
            </div>
        );
    }

    // If the user is authenticated, show the rest of the app
    return (
        <>
            <button id="logoutButton" onClick={handleLogout}>Log out</button> <br/>
            <Title />
            <AddForm />
        </>
    );
}

export default App;