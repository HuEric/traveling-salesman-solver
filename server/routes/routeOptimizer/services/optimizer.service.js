'use strict';

const GMap = require('@google/maps');
const Promise = require('bluebird');
const _ = require('lodash');

class Optimizer {
    constructor() {
        this.gmapClient = GMap.createClient({
            Promise: Promise,
            key: 'AIzaSyDKJImw2MrpLEDvuHwy67Puk19dMRZzYRM'
        });
    }

    prepare(plan, traffic) {
        const optimizer = this;
        optimizer.plan = plan;

        let homeCoordinate = [
            plan.home.lat,
            plan.home.lng
        ];

        // Convert into array of coordinates
        let waypointsCoordinate = plan.tasks.map((waypoint) => {
            return [
                waypoint.lat,
                waypoint.lng
            ];
        });

        // Building GMap query object
        optimizer.directionQuery = {
            origin: homeCoordinate,
            destination: homeCoordinate,
            mode: 'driving',
            waypoints: waypointsCoordinate,
            language: 'en',
            units: 'metric',
            optimize: true
        };

        // Check if traffic is taken into account
        // And date is in the future
        if (traffic === true &&
            ((new Date() / 1000) < plan.departureTime)
        ) {
            optimizer.directionQuery.departure_time = plan.departureTime;
            optimizer.directionQuery.traffic_model = 'pessimistic';
        }
        return optimizer;
    }

    computeItinerary() {
        const optimizer = this;
        // GMap call
        return optimizer.gmapClient.directions(optimizer.directionQuery).asPromise();
    }

    generateSchedule(gmapItinerary) {
        const optimizer = this;
        const itinerary = {};

        let startTime = Number(optimizer.plan.departureTime);
        let totalTime = 0;

        const schedule = gmapItinerary.routes[0].waypoint_order.map((waypointId, waypointIndex) => {
            const task = {
                id: waypointId + 1
            };

            // Find corresponding task from itinerary 
            const taskIndex = _.findIndex(optimizer.plan.tasks, (o) => {
                return o.id === (waypointId + 1);
            });

            // Task object
            const plannedTask = optimizer.plan.tasks[taskIndex];
            // Waypoint object
            const waypoint = gmapItinerary.routes[0].legs[waypointIndex];

            // Add travel time
            totalTime += waypoint.duration.value;
            task.startAt = startTime + totalTime;
            
            // Add task duration
            totalTime += plannedTask.duration;
            task.endAt = startTime + totalTime;

            // Coordinate
            task.lat = plannedTask.lat;
            task.lng = plannedTask.lng;

            return task;
        });

        itinerary.totalTime = totalTime;
        itinerary.schedule = schedule;

        return itinerary;
    }
}

module.exports = Optimizer;