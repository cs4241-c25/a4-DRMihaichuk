import express from 'express';
import { MongoClient } from 'mongodb';
const app = express();
import cors from 'cors';

app.use(express.static('src'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
}));

const url = "mongodb+srv://drmihaichuk:Bls294652!@cluster0.prazh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbconnect = new MongoClient(url);

async function run() {
    await dbconnect.connect().then(() => console.log("Connected!"));
    let pokemon_collection = await dbconnect.db("PokemonCollection").collection("Pokemon");
    let user_collection = await dbconnect.db("PokemonCollection").collection("Users");

    app.get('/', (req, res) => {
        res.send("src/index.html")
    })

    // app.post("/load", async (req, res) => {
    //     console.log("hello");
    //
    //     let dataString = "";
    //
    //     req.on( "data", function( data ) {
    //         dataString += data;
    //     });
    //
    //     console.log("Hello There");
    //
    //     req.on( "end", async () => {
    //         let user = JSON.parse( dataString );
    //         const content = await pokemon_collection.find(
    //             {"Trainer": user.Trainer}, {projection: {"_id":0, "Trainer":0}}).toArray()
    //         res.send( JSON.stringify(content))
    //     });
    // })

    app.post("/load", async (req, res) => {
        try {
            console.log("Received request to /load");

            // Use req.body instead of manually parsing the incoming data
            const user = req.body;

            console.log("User data received:", user);

            // Ensure the user has a Trainer property before querying
            if (!user.Trainer) {
                return res.status(400).json({ error: 'Trainer field is required' });
            }

            // Database query using the Trainer field
            const content = await pokemon_collection.find(
                { "Trainer": user.Trainer },
                { projection: { "_id": 0, "Trainer": 0 } }
            ).toArray();

            // Check if data was found and send a response
            if (content.length === 0) {
                return res.status(404).json({ message: 'No data found for this trainer' });
            }

            console.log("Data found:", content);

            res.send(JSON.stringify(content));

        } catch (err) {
            console.error("Error during request handling:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.post("/login",  async (req, res) => {
        let dataString = "";

        req.on( "data", function( data ) {
            dataString += data;
        });

        req.on( "end", async () => {
            let userauth = JSON.parse( dataString );
            const user = await user_collection.findOne({"Trainer": userauth.Trainer,
                "Password": userauth.Password}, {projection: {"_id": 0, "Trainer":1}});
            res.send( JSON.stringify(user));
        });
    })

    app.post("/add", (req, res) => {
        let dataString = "";

        req.on( "data", function( data ) {
            dataString += data;
        });

        req.on( "end", async () => {
            console.log( JSON.parse( dataString ) );
            let newPokemon = JSON.parse( dataString );

            if (newPokemon.Pokemon !== "" && newPokemon.Name !== "") {
                for (const index in newPokemon) {
                    console.log(index);
                    console.log(newPokemon[index])
                    console.log(newPokemon[index] === null);
                    if (newPokemon[index] === null) {newPokemon[index] = 1;}
                }

                const spec = calculateSpecialty(newPokemon);

                let content = {"Name": newPokemon.Name, "Pokemon": newPokemon.Pokemon,
                    "Trainer": newPokemon.Trainer, "HP": newPokemon.HP, "Attack": newPokemon.Attack, "Defense": newPokemon.Defense,
                    "Special Attack": newPokemon["Special Attack"], "Special Defense": newPokemon["Special Defense"],
                    "Speed": newPokemon.Speed, "Gender": newPokemon.Gender, "Shiny": newPokemon.Shiny, "Specialty": spec};

                const found = await pokemon_collection.findOne({
                    "Trainer": newPokemon.Trainer, "Name": newPokemon.Name});
                if (found !== null) {
                    await pokemon_collection.updateOne({
                        "Name": newPokemon.Name, "Trainer": newPokemon.Trainer},{$set: content})
                }
                else {
                    await pokemon_collection.insertOne(content);
                }
            }
            const content = await pokemon_collection.find(
                {"Trainer": newPokemon.Trainer},{projection: {"_id":0, "Trainer":0}}).toArray()
            res.send( JSON.stringify(content))
        })
    });

    app.post("/remove", (req, res) => {
        let dataString = "";

        req.on( "data", function( data ) {
            dataString += data;
        });

        req.on("end", async function () {
            console.log(JSON.parse(dataString));
            const remPokemon = JSON.parse(dataString);

            if (remPokemon.Name !== "" && remPokemon.Trainer !== "") {
                await pokemon_collection.deleteOne({
                    "Name": remPokemon.Name, "Trainer": remPokemon.Trainer});
            }

            const content = await pokemon_collection.find(
                {"Trainer": remPokemon.Trainer},{projection: {"_id":0, "Trainer":0}}).toArray()
            res.send( JSON.stringify(content))
        });
    })

    app.use((req, res) => {
        res.status(404).sendFile(__dirname + '/public/404.html');
    });
}
const appRun = run();

const calculateSpecialty = (pokemon) => {
    // Determining Pokemon's Damage type
    let atkrate
    let spec
    if (pokemon.Attack - 15 > pokemon["Special Attack"]) {
        spec = "Physical"
        atkrate = pokemon.Attack * pokemon.Attack * pokemon.Speed;
    }
    else if (pokemon["Special Attack"] - 15 > pokemon.Attack) {
        spec = "Special"
        atkrate = pokemon["Special Attack"] * pokemon["Special Attack"] * pokemon.Speed;
    }
    else {
        spec = "Mixed"
        atkrate = pokemon.Attack * pokemon["Special Attack"] * pokemon.Speed;
    }
    // Determining Pokemon's battle style
    const defrate = pokemon.HP * pokemon.Defense * pokemon["Special Defense"];
    if (atkrate / 1.5 > defrate) {spec += " Sweeper"}
    else if (defrate / 1.5 > atkrate) {spec += " Staller"}
    else {spec += " Generalist"}
    return spec;
}

app.listen(3000);