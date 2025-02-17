import axios from "axios";
import {useEffect} from "react";


const AddForm = () => {

        const add = async function(event ) {

                console.log("Adding...");

                event.preventDefault()

                const body = definebody();

                // const response = await fetch( "http://localhost:3000/add", {
                //         method:'POST',
                //         body
                // })
                // const text = await response.text()
                // console.log( "text:", text )

                // useEffect(() => {
                axios.post(`http://localhost:3000/add`, body)
                    .then(response => {console.log(response.data)})
                    .catch(error => console.error('Error fetching data:', error));
                // }, []);

                // let pokemonList = JSON.parse(text)
                //
                // generateTable(pokemonList);
        }

        const remove = async function(event ) {
                console.log("Removed...");

                event.preventDefault();

                const body = definebody();

                // const response = await fetch("http://localhost:3000/remove", {
                //         method: 'POST',
                //         body
                // });
                // const text = await response.text()
                // console.log( "text:", text )

            axios.post(`http://localhost:3000/remove`, body)
                .then(response => {console.log(response.data)})
                .catch(error => console.error('Error fetching data:', error));

                // let pokemonList = JSON.parse(text);
                // console.log(pokemonList);

                // generateTable(pokemonList);
        }

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
                    json = { Name: name.value, Pokemon: species.value, Trainer: localStorage.getItem('trainer'),
                            HP: parseInt(hp.value), Attack: parseInt(atk.value), Defense: parseInt(def.value),
                            "Special Attack": parseInt(spatk.value), "Special Defense": parseInt(spdef.value),
                            Speed: parseInt(spd.value), Gender: gender.value, Shiny: shiny.checked };
                return JSON.stringify(json)
        }

    return (
        <>
                <form className="grid-form">
                        <label htmlFor="pkmnName">Pokemon's Name: </label><input type="text" id="pkmnName" maxLength="20"/> <br/>
                        <label htmlFor="pkmnSpecies"> Pokemon's Species:</label><input type="text" id="pkmnSpecies"/><br/>
                        <label htmlFor="pkmnHP">Pokemon's HP Stat: </label><input type="text" id="pkmnHP"/> <br/>
                        <label htmlFor="pkmnAttack">Pokemon's Attack Stat: </label><input type="text" id="pkmnAttack"/> <br/>
                        <label htmlFor="pkmnDefense">Pokemon's Defense Stat: </label><input type="text" id="pkmnDefense"/> <br/>
                        <label htmlFor="pkmnSpAttack">Pokemon's Special Attack Stat: </label><input type="text" id="pkmnSpAttack"/>
                        <br/>
                        <label htmlFor="pkmnSpDefense">Pokemon's Special Defense Stat: </label><input type="text" id="pkmnSpDefense"/> <br/>
                        <label htmlFor="pkmnSpeed">Pokemon's Speed Stat: </label><input type="text" id="pkmnSpeed"/> <br/>
                        <input type="radio" id="m" name="pkmnGender" value="Male"/>
                        <label htmlFor="m">Male</label>
                        <input type="radio" id="f" name="pkmnGender" value="Female"/>
                        <label htmlFor="f">Female</label>
                        <input type="radio" id="n" name="pkmnGender" value="Genderless" defaultChecked={true}/>
                        <label htmlFor="n">Genderless</label> <br/>
                        <label htmlFor="pkmnShiny">Is Shiny? </label><input type="checkbox" id="pkmnShiny"/> <br/>
                        <button id="addbut" onClick={add}>Add/Edit</button>
                        <button id="rembut" onClick={remove}>Remove</button>
                </form>
        </>

    )
}

export default AddForm;