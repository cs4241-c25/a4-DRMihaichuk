


const AddForm = () => {




    return (
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
            <input type="radio" id="n" name="pkmnGender" value="Genderless"/>
            <label htmlFor="n">Genderless</label> <br/>
            <label htmlFor="pkmnShiny">Is Shiny? </label><input type="checkbox" id="pkmnShiny"/> <br/>
            <button id="addbut">Add/Edit</button>
            <button id="rembut">Remove</button>
        </form>
    )
}

export default AddForm;