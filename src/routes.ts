import fs from 'fs';
import path from 'path';
import express from 'express';

import { Database } from './database';
import { GameController } from './control';

export default function load(contentRoot: string, database: Database): express.Express {
    const app = express();
    const controller = new GameController(database);

    const staticDir = path.join(contentRoot, './static');
    const staticMiddleware = express.static(staticDir);

    app.use(express.json());
    app.use(staticMiddleware);

    app.get('/word', (req, resp) => {
        const word = controller.nextWord('default');
        resp.send({
            points: controller.getPointsValue(word.value),
            ...word
        });
    });

    app.get('/words', (req, resp) => {
        resp.sendFile(path.join(staticDir, './words.html'));
    });

    app.get('/play/:duration', (req, resp) => {
        resp.sendFile(path.join(staticDir, './index.html'));
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

    return app;
};

//  app.listen(8080, () => console.log("Server started!"));
