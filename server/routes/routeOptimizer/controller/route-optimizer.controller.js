'use strict';

const express = require('express');
const ServiceClass = require('../services/route-optimizer.service');

const router = express.Router();
const service = new ServiceClass();


router.post('/', service.postRouteOptimizer);

module.exports = router;