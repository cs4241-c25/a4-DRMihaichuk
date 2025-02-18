import express from 'express';
import { MongoClient } from 'mongodb';
const app = express();
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from "node:path";
import MongoStore from 'connect-mongo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {
    MONGO_USER,
    MONGO_PASS,
    MONGO_HOST,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    EXPRESS_SESSION_SECRET
} = process.env;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(process.env.EXPRESS_SESSION_SECRET);

app.use(session({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`,
        ttl: 14 * 24 * 60 * 60, // Session TTL (time-to-live) in seconds (14 days here)
    }),
    cookie: {
        httpOnly: false,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static('src'));
app.use(express.static(path.join(__dirname, 'src')));
app.use(cors({
    origin: 'https://a4-drmihaichuk.onrender.com',
    credentials: true
}));

const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`;
const dbconnect = new MongoClient(url);

async function run() {
    await dbconnect.connect().then(() => console.log("Connected!"));
    let pokemon_collection = await dbconnect.db("PokemonCollection").collection("Pokemon");
    // let user_collection = await dbconnect.db("PokemonCollection").collection("Users");

    passport.serializeUser(function (user, done) {
        // I use user._id || user.id to allow for more flexibility of this with MongoDB.
        // If using Passport Local, you might want to use the MongoDB id object as the primary key.
        // However, we are using GitHub, so what we want is user.id
        // Feel free to remove the user._id || part of it, but the `user.id` part is necessary.
        done(null, { username: user.username, id: user._id || user.id });
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "https://a4-drmihaichuk-backend.onrender.com/auth/github/callback"
        },
        async function (accessToken, refreshToken, profile, done) {
            // This code will run when the user is successfully logged in with GitHub.
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    ));

    app.get('/auth/github/callback',
        passport.authenticate('github', { session: true, failureRedirect: 'https://a4-drmihaichuk.onrender.com/' }),
        function (req, res) {
            res.redirect('https://a4-drmihaichuk.onrender.com/');
            console.log(req.user.username);
            console.log(req.isAuthenticated())
        });

    app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

    function ensureAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("https://a4-drmihaichuk-backend.onrender.com/login");
        }
    }

    app.get('/', ensureAuth, (req, res) => {
        console.log("test:req");
        console.log(__dirname);
        // User is logged in
        res.sendFile(__dirname + "/index.html");
    });

    app.get('/api/user', (req, res) => {
        console.log(req.isAuthenticated())
        if (req.isAuthenticated()) {
            res.json({ user: req.user });
        } else {
            res.status(204).json({ message: 'Not authenticated, please log in.' });
        }
    });

    app.post("/gen-table", async (req, res) => {
        // try {
            const user = req.body;

            if (!user.Trainer) {
                return res.status(400).json({ error: 'Trainer field is required' });
            }

            const content = await pokemon_collection.find(
                { "Trainer": user.Trainer },
                { projection: { "_id": 0, "Trainer": 0 } }
            ).toArray();

            if (content.length === 0) {
                return res.status(200).json({ message: 'No data found for this trainer', data: [] });
            }

            res.send(JSON.stringify(content));

        // } catch (err) {
        //     console.error("Error during request handling:", err);
        //     res.status(500).json({ error: 'Internal Server Error' });
        // }
    });

    app.get("/login", (req, res) => {
        // User is logged in
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            res.redirect("https://a4-drmihaichuk-backend.onrender.com/");
        } else {
            console.log("Sending to index");
            // User is not logged in
            // res.sendFile(__dirname + "/index.html");
            res.redirect('https://a4-drmihaichuk.onrender.com/');
        }
    });

    app.get("/logout", (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).send("Failed to log out");
            }
            console.log("Should be logged out");
            console.log(req.isAuthenticated());
            res.redirect("https://a4-drmihaichuk-backend.onrender.com/login");  // Redirect to login page after logging out.
        });
    });

    app.post("/add", async (req, res) => {

            const newPokemon = req.body;

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
            res.sendStatus(204);
    });

    app.post("/remove", async (req, res) => {
        const remPokemon = req.body;

            if (remPokemon.Name !== "" && remPokemon.Trainer !== "") {
                await pokemon_collection.deleteOne({
                    "Name": remPokemon.Name, "Trainer": remPokemon.Trainer});
            }

            res.sendStatus(204);
    })

    // app.use((req, res) => {
    //     res.status(404).sendFile(__dirname + '/404.html');
    // });

    app.get("/load", ensureAuth, async (req, res) => {
        // Note that here I am using the username as the key.
        const userdata = await pokemon_collection.find({ trainer: req.user.username }).toArray();
        // What I am doing here is attaching the username to the front of the array
        // and then putting the rest of the data after the username
        res.json([{ username: req.user.username }, ...userdata]);
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