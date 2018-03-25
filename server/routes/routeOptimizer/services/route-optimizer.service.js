'use strict';

const Optimizer = require('./optimizer.service');

class Service {
    postRouteOptimizer(req, res) {
        const routeOptimizer = new Optimizer();

        routeOptimizer
            .prepare(req.body)
            .computeItinerary()
            .then((result) => {
                let schedule = routeOptimizer.generateSchedule(result.json);
                res.json(schedule);
                // res.json(result.json);
                // res.json(routeOptimizer.format(result));
            })
            .catch((error) => {
                res.status(400).json(error.json);
            })
        ;

        // res.json({ res: req.body });
    }
}

module.exports = Service;