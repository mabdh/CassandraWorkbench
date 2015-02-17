'use strict';

var express = require('express');
var controller = require('./contactPoint.controller');

var router = express.Router();

router.get('/', controller.getKeyspaces);

router.get('/keyspaces', controller.getColumnfamilies);

router.get('/keyspaces/columnfamilies', controller.getColumns);

router.post('/keyspaces/queries', controller.postQueries);

module.exports = router;