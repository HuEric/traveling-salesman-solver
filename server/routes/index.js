'use strict';

const routeOptimizer = require('./routeOptimizer/route-optimizer.index');

class Route {
    init(server) {
        // Routes
        server.use('/routeOptimizer', routeOptimizer);
    }
}

module.exports = Route;