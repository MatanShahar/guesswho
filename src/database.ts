import fs from 'fs';
import path from 'path';

import { Word } from './common';

interface Collection {
    name: string;
    words: Word[];
}

export class Database {
    private _collections: { [key: string]: Collection };

    constructor(collections: { [key: string]: Collection }) {
        this._collections = collections;
    }

    public get collections(): string[] {
        return Object.keys(this._collections);
    }

    public collection(name: string): Word[] {
        return this._collections[name].words;
    }
};

export async function loadDatabase(root: string = __dirname): Promise<Database> {
    const dbDirectory = path.join(root, 'db');
    const collectionsFilePath = path.join(dbDirectory, 'collections.json');

    const collectionsInfoText = await fs.promises.readFile(collectionsFilePath, { encoding: 'utf-8' });
    const collectionsInfo = <any[]>JSON.parse(collectionsInfoText);

    const collections = collectionsInfo.map(({name, file}): Collection => {
        const collectionPath = path.join(dbDirectory, file);
        const collectionDataText = fs.readFileSync(collectionPath, { encoding: 'utf-8' });
        const collectionData = JSON.parse(collectionDataText);
        return { name, words: collectionData.words };
    });

    const collectionsMap: { [key: string]: Collection } = {};
    collections.forEach(c => {
        collectionsMap[c.name] = c;
    });

    return new Database(collectionsMap);
};
