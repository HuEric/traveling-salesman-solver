'use strict';

const express = require('express');
const controller = require('./controller/route-optimizer.controller');

const router = express.Router();

router.use('/', controller);


module.exports = router;