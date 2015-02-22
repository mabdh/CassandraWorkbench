'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/contactPoints', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/contactPoints?contactPoint=127.0.0.1')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/contactPoints/keyspaces?contactPoint=127.0.0.1&keyspace=system_traces')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/contactPoints/keyspaces/columnfamilies?contactPoint=127.0.0.1&keyspace=system_traces&columnfamily=sessions')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  
  it('should respond with JSON array', function(done) {
    request(app)
      .post('/api/contactPoints/keyspaces/queries', {
          query: 'SELECT * FROM sessions',
          contactPoint: '127.0.0.1',
          keyspace: 'system_traces'
          })
      .expect(200)
      //.expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
  });
  //*/
});