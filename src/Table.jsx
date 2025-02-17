import axios from 'axios';
import {useEffect, useState} from "react";
import './Table.css'

axios.defaults.baseURL = 'http://localhost:5173';


const Results = () => {
    const [data, setData] = useState(null)
    
    const body = {Trainer: localStorage.getItem('trainer')};
    const inp = JSON.stringify(body);

    useEffect(() => {
        axios.post(`http://localhost:3000/load`, body)
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));

        // fetch('/load', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(body), // Convert the body object to a JSON string
        // })
        //     .then(response => response.json())  // Parse the JSON response
        //     .then(data => setData(data))        // Handle the parsed data
        //     .catch(error => console.error('Error fetching data:', error));
    }, []);

    // const generateTable = function(pokemonList) {
    //     let table = document.createElement("table");
    //     let thead = document.createElement("thead");
    //     let tbody = document.createElement("tbody");
    //     if (pokemonList == null) {
    //         console.log("No pokemon found");
    //         return;
    //     }
    //
    //     const headerRow = document.createElement("tr");
    //     for (const key in pokemonList[0]) {
    //         const header = document.createElement('th');
    //         header.textContent = key;
    //         headerRow.appendChild(header);
    //     }
    //     thead.appendChild(headerRow);
    //
    //     for (const rowData of pokemonList) {
    //         const row = document.createElement('tr');
    //         for (const key in rowData) {
    //             const td = document.createElement('td');
    //             td.textContent = rowData[key];
    //             row.appendChild(td);
    //         }
    //         tbody.appendChild(row);
    //     }
    //
    //     table.appendChild(thead);
    //     table.appendChild(tbody);
    //
    //     return table;
    // }

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
            <h2 className="grid-results">Results</h2>
            <b id="info" className="grid-table">{generateTable(data)}</b>
        </>
    )
}

export default Results;