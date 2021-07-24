import path from 'path';

import app from './src/routes';
import { loadDatabase } from './src/database';

loadDatabase(__dirname)
    .then(database => {
        app(__dirname, database).listen(8080, () => console.log("Server started!"));
    });
