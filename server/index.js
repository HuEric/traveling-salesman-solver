'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const grab = require('ps-grab');

const Routes = require('./routes');

class Server {
    constructor() {
        this.server = express();
        this.routes = new Routes();
    }

    start() {
        const port = grab('--port') || 3000;
        const hostname = grab('--hostname') || 'localhost';

        // Server settings
        this.server.set('port', port);
        this.server.set('hostname', hostname);

        // Returns middleware that parses json
        this.server.use(bodyParser.json());

        // Set up routes
        this.routes.init(this.server);

        this.server.listen(port, function () {
            process.stdout.write(`Express server listening on - http://${hostname}:${port}\n`);
        });
    }
}

module.exports = Server;