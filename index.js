const fs = require('fs');
const path = require('path');

const words = fs.readFileSync('./data/words.txt', { encoding: 'utf-8' }).split('\n');

const express = require('express');
const app = express();
app.use(express.json());

const static = express.static('./static');
app.use(static);

app.get('/word', (req, resp) => {
    const choice = Math.floor(Math.random() * words.length);
    resp.send(words[choice]);
});

app.get('/words', (req, resp) => {
    resp.sendFile(path.join(__dirname, './static/words.html'));
});

app.get('/play/:duration', (req, resp) => {
    resp.sendFile(path.join(__dirname, './static/index.html'));
});

app.get('/word-list/:list', (req, resp) => {
    const listName = req.params['list'] || 'custom-words';
    const listFile = path.join(__dirname, `db/${listName}.json`);
    resp.sendFile(listFile);
});

app.post('/add-word/:list', (req, resp) => {
    const listName = req.params['list'] || 'custom-words';
    const listFile = path.join(__dirname, `db/${listName}.json`);
    const newWord = req.body;

    fs.promises.readFile(listFile, { encoding: 'utf-8' })
        .then(data => JSON.parse(data))
        .then(json => {
            json['words'].push(newWord)
            const jsonText = JSON.stringify(json, null, 2);
            return fs.promises.writeFile(listFile, jsonText, { encoding: 'utf-8' })
        })
        .then(() => resp.send('ok'));
});

app.listen(8080, () => console.log("Server started!"));
