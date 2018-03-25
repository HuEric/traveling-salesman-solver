'use strict';

const Optimizer = require('./optimizer.service');

class Service {
    postRouteOptimizer(req, res) {
        const routeOptimizer = new Optimizer();

        routeOptimizer
            .prepare(req.body, true)
            .computeItinerary()
            .then((result) => {
                let schedule = routeOptimizer.generateSchedule(result.json);
                res.json(schedule);
            })
            .catch((error) => {
                res.status(400).json(error);
            })
        ;
    }
}

module.exports = Service;