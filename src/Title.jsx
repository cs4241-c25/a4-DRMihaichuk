import './Title.css'


const Title = () => {
    return (
        <>
            <h1>Pokemon Day Care</h1>
            <ul>
                <li>To add a new Pokemon, enter a Pokemon's name that is not already registered and their stats and
                    finish by clicking Add/Edit
                </li>
                <li>To modify a Pokemon's data, enter a Pokemon's name and the new stats you want entered and finish by
                    clicking Add/Edit
                </li>
                <li>To delete a Pokemon's data, enter at least a Pokemon's name and finish by clicking Remove</li>
            </ul>
        </>
    );
}

export default Title;