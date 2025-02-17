import { useState } from 'react'
import './App.css'
import Title from "./Title.jsx";
import AddForm  from "./AddForm.jsx";
import Results from "./Table.jsx";

function App() {
    // localStorage.setItem('loggedIn', 'true');
    // localStorage.setItem('trainer', 'Super Nerd Devin');
    // console.log(localStorage.getItem('trainer'));

    return (
        <>
            <a href="/logout"><button id="logoutButton">Logout</button></a> <br/>
            <Title/>
            <AddForm/>
            <Results/>
        </>
    )
}

export default App
