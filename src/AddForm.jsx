import axios from "axios";
import {useEffect, useState} from "react";
import Results from './Table';


const AddForm = () => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);

    // Check if user is authenticated when the component mounts
    useEffect(() => {
        axios.get('https://a4-drmihaichuk-backend.onrender.com/api/user', { withCredentials: true })
            .then((response) => {
                if (response.data.user) {
                    console.log(response.data.user);
                    setUser(response.data.user);
                    fetchPokemonData(response.data.user.username);
                } else {
                    setUser(null);
                }
            })
    }, []);

    // Fetch Pokémon data for the trainer
    const fetchPokemonData = (trainer) => {
        axios.post("https://a4-drmihaichuk-backend.onrender.com/gen-table", { Trainer: trainer })
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => console.error("Error fetching table data:", error));
    };

    // Adding data to table
    const add = (body) => {
        axios.post("https://a4-drmihaichuk-backend.onrender.com/add", body)
            .then(response => {
                console.log(response.data);
                fetchPokemonData(user.username);  // Re-fetch the data after adding
            })
            .catch(error => console.error('Error adding Pokémon:', error));
    };

    // Removing data from table
    const remove = (body) => {
        axios.post("https://a4-drmihaichuk-backend.onrender.com/remove", body)
            .then(response => {
                console.log(response.data);
                fetchPokemonData(user.username);  // Re-fetch the data after removing
            })
            .catch(error => console.error('Error removing Pokémon:', error));
    };

    // Launcher for add
    const handleAdd = (event) => {
        event.preventDefault();
        const body = definebody();
        add(body);
    };

    // Launcher for remove
    const handleRemove = (event) => {
        event.preventDefault();
        const body = definebody();
        remove(body);
    };

    // Generates the body given the information
    const definebody = () => {
            const species = document.querySelector("#pkmnSpecies"),
                name = document.querySelector( "#pkmnName" ),
                hp = document.querySelector( "#pkmnHP" ),
                atk = document.querySelector( "#pkmnAttack" ),
                def = document.querySelector( "#pkmnDefense" ),
                spatk = document.querySelector( "#pkmnSpAttack" ),
                spdef = document.querySelector( "#pkmnSpDefense" ),
                spd = document.querySelector( "#pkmnSpeed" ),
                gender = document.querySelector( 'input[name="pkmnGender"]:checked' ),
                shiny = document.querySelector( '#pkmnShiny' ),
                json = { Name: name.value, Pokemon: species.value, Trainer: user.username,
                        HP: parseInt(hp.value), Attack: parseInt(atk.value), Defense: parseInt(def.value),
                        "Special Attack": parseInt(spatk.value), "Special Defense": parseInt(spdef.value),
                        Speed: parseInt(spd.value), Gender: gender.value, Shiny: shiny.checked };
            console.log(json);
            return json
    }

    return (
        <>
            <form className="grid-form">
                <label htmlFor="pkmnName">Pokemon&#39;s Name: </label><input type="text" id="pkmnName" maxLength="20"/> <br/>
                <label htmlFor="pkmnSpecies"> Pokemon&#39;s Species:</label><input type="text" id="pkmnSpecies"/><br/>
                <label htmlFor="pkmnHP">Pokemon&#39;s HP Stat: </label><input type="text" id="pkmnHP"/> <br/>
                <label htmlFor="pkmnAttack">Pokemon&#39;s Attack Stat: </label><input type="text" id="pkmnAttack"/> <br/>
                <label htmlFor="pkmnDefense">Pokemon&#39;s Defense Stat: </label><input type="text" id="pkmnDefense"/> <br/>
                <label htmlFor="pkmnSpAttack">Pokemon&#39;s Special Attack Stat: </label><input type="text" id="pkmnSpAttack"/>
                <br/>
                <label htmlFor="pkmnSpDefense">Pokemon&#39;s Special Defense Stat: </label><input type="text" id="pkmnSpDefense"/> <br/>
                <label htmlFor="pkmnSpeed">Pokemon&#39;s Speed Stat: </label><input type="text" id="pkmnSpeed"/> <br/>
                <div className="radio-container">
                    <input type="radio" id="m" name="pkmnGender" value="Male"/>
                    <label htmlFor="m">Male</label>
                    <input type="radio" id="f" name="pkmnGender" value="Female"/>
                    <label htmlFor="f">Female</label>
                    <input type="radio" id="n" name="pkmnGender" value="Genderless" defaultChecked={true}/>
                    <label htmlFor="n">Genderless</label> <br/>
                </div>
                <label htmlFor="pkmnShiny">Is Shiny? </label><input type="checkbox" id="pkmnShiny"/> <br/>
                <button id="addbut" onClick={handleAdd}>Add/Edit</button>
                <button id="rembut" onClick={handleRemove}>Remove</button>
            </form>
            <br/>
            <Results data={data}/>
        </>

    )
}

export default AddForm;