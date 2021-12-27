const express = require('express');
const https = require('http');
const fs = require('fs');
const path = require('path');
const { timeLog } = require('console');
const ip = require('ip');

const PORT = 3000;
const initial_path = path.join(__dirname, "/");
const app = express();

app.use(express.static(initial_path + "/client"));

app.get("/", (req, res) => {
    res.sendFile(initial_path + "/client/index.html");
})

app.get("/seasons", (req, res) => {
    res.sendFile(path.join(initial_path, '/client/series.html'));
})

app.get("/watch", (req, res) => {
    res.sendFile(initial_path + "/client/player.html");
})

app.get("/films/:name", (req, res) => {
    // TODO 
    res.status(200).sendFile(path.join(initial_path, `/static/films/${req.params.name}`));
})

app.get("/series/:name/:season/:ep", (req, res) => {

    const extensions = ["mp4", "mkv"];

    function fileExist (req) { 
        for (let i = 0; i < extensions.length; i++) {
            let staticPath = path.join(initial_path, `/static/${req.params.name}/${req.params.season}/${req.params.ep}.${extensions[i]}`);
            if (fs.existsSync(staticPath)) return extensions[i];
        }
        throw new Error("File does not exist.");
    }

    try {
        const extension = fileExist(req);
        res.status(200).sendFile(path.join(initial_path, `/static/${req.params.name}/${req.params.season}/${req.params.ep}.${extension}`));
    } catch (err) {
        const date = new Date();
        console.log(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " Error: File not found: " + `${req.params.name}/${req.params.season}/${req.params.ep}`);
        res.status(404).send("File not found.");
    }
});

app.get("/api/:folder/:ressource", (req, res) => {
    res.sendFile(path.join(initial_path, `/static/${req.params.folder}/${req.params.ressource}`));
})

app.listen(PORT, () => {
    console.log("\x1b[35m" ,`Serveur lancé:\n`);
    console.log("\x1b[32m", `   - http://localhost:3000/\n    - http://${ip.address()}:3000/`);
});