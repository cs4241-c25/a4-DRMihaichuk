import axios from 'axios';
axios.defaults.baseURL = 'https://a4-drmihaichuk.onrender.com';

// vvv was mad at me, so I did this vvv
// eslint-disable-next-line react/prop-types
const Results = ({data}) => {
    // Generates the table for the Pokémon information
    const generateTable = (pokemonList) => {
        if (!pokemonList || pokemonList.length === 0 || pokemonList.length === undefined) {
            console.log("No pokemon found");
            return <p>No Pokémon found.</p>;
        }
        else {
            console.log(pokemonList.length)
            return (
                <table>
                    <thead>
                    <tr>
                        {Object.keys(pokemonList[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {pokemonList.map((rowData, index) => (
                        <tr key={index}>
                            {Object.values(rowData).map((value, i) => (
                                <td key={i}>
                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        }
    };


    return (
        <>
            <h2 className="grid-results">My Pokemon</h2>
            <b id="info" className="grid-table">{generateTable(data)}</b>
        </>
    )
}

export default Results;