import {useEffect, useState} from 'react';
import './App.css';
import Title from './Title.jsx';
import AddForm from './AddForm.jsx';
import Results from './Table.jsx';
import axios from 'axios';

function App() {
    // State for storing the logged-in status and user info
    const [user, setUser] = useState(null);

    // Check if user is authenticated when the component mounts
    useEffect(() => {
        axios.get('http://localhost:3000/api/user', { withCredentials: true })
            .then((response) => {
                if (response.data.user) {
                    console.log("User Authenticated:", response.data.user);
                    setUser(response.data.user);  // User is authenticated
                } else {
                    setUser(null);  // Handle non-authenticated state
                }
            })
    }, []);

    const handleLogout = () => {
        window.location.href = 'http://localhost:3000/logout';  // Redirect to logout route on server
    };

    // If the user is not authenticated, show the login button or redirect
    if (!user) {
        return (
            <div>
                <p>Please log in to continue</p>
                <a href="http://localhost:3000/auth/github"><button id="loginButton">Login with GitHub</button></a>
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