'use strict';

class Service {
    postRouteOptimizer(req, res) {
        res.json({ res: 'Hello world' });
    }
}

module.exports = Service;