'use strict';

const GMap = require('@google/maps');
const Promise = require('bluebird');

class Optimizer {
    constructor() {
        this.gmapClient = GMap.createClient({
            Promise: Promise,
            key: 'AIzaSyDKJImw2MrpLEDvuHwy67Puk19dMRZzYRM'
        });
    }

    prepare(plan) {
        const optimizer = this;
        optimizer.plan = plan;

        let homeCoordinate = [
            plan.home.lat,
            plan.home.lng
        ];

        let waypointsCoordinate = plan.tasks.map((waypoint) => {
            return [
                waypoint.lat,
                waypoint.lng
            ];
        });

        optimizer.directionQuery = {
            origin: homeCoordinate,
            destination: homeCoordinate,
            mode: 'driving',
            waypoints: waypointsCoordinate,
            language: 'en',
            units: 'metric',
            departure_time: plan.depatureTime,
            optimize: true
        };

        return optimizer;
    }

    computeItinerary() {
        const optimizer = this;
        return optimizer.gmapClient.directions(optimizer.directionQuery).asPromise();
    }

    generateSchedule(gmapItinerary) {
        const itinerary = {};


        itinerary.totalTime = gmapItinerary.routes[0].legs.reduce((acc, current) => {
            return acc += current.duration.value;
        }, 0);

        return itinerary;
    }
}

module.exports = Optimizer;