import { Word } from "./common";
import { Database } from "./database";

export class GameController {
    private database: Database
    private activeCollections: { [key: string]: Word[] };

    public constructor(database: Database) {
        this.database = database;
        this.activeCollections = {};
    }

    public nextWord(collection: string): Word {
        if (!this.activeCollections[collection] || this.activeCollections[collection].length == 0) {
            this.activeCollections[collection] = this.database.collection(collection);
        }

        const words = this.activeCollections[collection];
        const index = Math.floor(Math.random() * words.length);
        const result = words[index];
        this.activeCollections[collection].splice(index, 1);

        return result;
    }

    public getPointsValue(wordValue: number) {
        if (wordValue <= 1)
            return 2000;

        if (wordValue <= 2)
            return 3000;

        return 5000;
    }
};
