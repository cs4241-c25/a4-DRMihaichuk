import { useState } from 'react'
import './App.css'
import Title from "./Title.jsx";
import AddForm  from "./AddForm.jsx";
import Results from "./Table.jsx";

function App() {
    const [count, setCount] = useState(0)
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('trainer', 'Super Nerd Devin');
    console.log(localStorage.getItem('trainer'));

    return (
        <>
            <Title/>
            <AddForm/>
            <Results/>
          {/*<h1>Pokemon Day Care</h1>*/}
          {/*<div className="card">*/}
          {/*  <button onClick={() => setCount((count) => count + 1)}>*/}
          {/*    count is {count}*/}
          {/*  </button>*/}
          {/*  <p>*/}
          {/*    Edit <code>src/App.jsx</code> and save to test HMR*/}
          {/*  </p>*/}
          {/*</div>*/}
          {/*<p className="read-the-docs">*/}
          {/*  Click on the Vite and React logos to learn more*/}
          {/*</p>*/}
        </>
    )
}

export default App
