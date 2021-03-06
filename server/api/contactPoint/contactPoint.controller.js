'use strict';

var _ = require('lodash');
var cassandra = require('cassandra-driver');

// Get list of keyspaces
exports.getKeyspaces = function (req, res) {
    //from url
    var contactPoint = req.query.contactPoint;
    //object to be sent to cassandra
    var clientOptions = {};
    //system -> to get metadata of the system
    clientOptions.keyspace = 'system';
    clientOptions.contactPoints = [contactPoint];

    var client = new cassandra.Client(clientOptions);

    var query = 'SELECT * FROM schema_keyspaces';
    //err & result are input parameters from the result of the query executed
    client.execute(query, function (err, result) {
        var data = [];

        if (!err) {
            for (var i in result.rows) {
                var row = result.rows[i];
                data.push({
                    title: row.keyspace_name,
                    type: 'keyspace',
                    contactPoint: contactPoint,
                    keyspace: row.keyspace_name,
                    lazy: true // fancytree -> has children but have not been loaded yet from DB
                });
            }
            //can also be sent with "res.send(data);"
            res.send(data);
        } else {
            res.status(400).send(err);
        }
        
    });
};

// Get list of columnfamilies
exports.getColumnfamilies = function (req, res) { 
    var contactPoint = req.query.contactPoint;
    var keyspace = req.query.keyspace;

    var clientOptions = {};
    clientOptions.keyspace = 'system';
    clientOptions.contactPoints = [contactPoint];
    var client = new cassandra.Client(clientOptions);

    var query = 'SELECT columnfamily_name FROM schema_columnfamilies WHERE keyspace_name = ?';
    var queryParams = [keyspace];

    client.execute(query, queryParams, function (err, result) {
        var data = [];

        for (var i in result.rows) {
            var row = result.rows[i];
            data.push({
                title: row.columnfamily_name,
                type: 'columnfamily',
                contactPoint: contactPoint,
                keyspace: keyspace,
                columnfamily: row.columnfamily_name,
                lazy: true
            });
        }

        res.json(data);
    });
};

// Get list of columns
exports.getColumns = function (req, res) {
    var contactPoint = req.query.contactPoint;
    var keyspace = req.query.keyspace;
    var columnfamily = req.query.columnfamily;

    var clientOptions = {};
    clientOptions.keyspace = 'system';
    clientOptions.contactPoints = [contactPoint];
    var client = new cassandra.Client(clientOptions);

    var query = 'SELECT column_name FROM schema_columns WHERE keyspace_name = ? AND columnfamily_name = ?';
    var queryParams = [keyspace, columnfamily];

    client.execute(query, queryParams, function (err, result) {
        var data = [];

        for (var i in result.rows) {
            var row = result.rows[i];
            data.push({
                title: row.column_name,
                type: 'column',
                contactPoint: contactPoint,
                keyspace: keyspace,
                columnfamily: columnfamily,
                column: row.column_name,
                lazy: false
            });
        }

        res.json(data);
    });
};

// Post CQL queries
exports.postQueries = function (req, res, next) { 
    var contactPoint = req.body.contactPoint;
    var keyspace = req.body.keyspace;
    var query = req.body.query;
    console.log(query);
    var clientOptions = {};
    clientOptions.keyspace = keyspace;
    clientOptions.contactPoints = [contactPoint];
    var client = new cassandra.Client(clientOptions);

    client.execute(query, function (err, result) {

        if (result) {
            res.json(result);
        } else {
            console.log(err);
            res.json(err);
        }
    });
};