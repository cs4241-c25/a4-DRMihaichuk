import axios from 'axios';
import {useEffect, useState} from "react";
import './Table.css'

axios.defaults.baseURL = 'http://localhost:5173';


const Results = ({data}) => {
    const generateTable = (pokemonList) => {
        if (!pokemonList || pokemonList.length === 0) {
            console.log("No pokemon found");
            return <p>No Pokémon found.</p>; // Return a fallback message when no data is available
        }

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
    };


    return (
        <>
            <h2 className="grid-results">My Pokemon</h2>
            <b id="info" className="grid-table">{generateTable(data)}</b>
        </>
    )
}

export default Results;