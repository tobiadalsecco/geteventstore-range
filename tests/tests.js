var should = require('should');
var eventstore = require('geteventstore-promise');

var streamToken = 'TestStream-' + new Date().getTime();
var client = eventstore.tcp({
    hostname: process.env.EVENTSTORE_HOST || 'localhost',
    port: process.env.EVENTSTORE_PORT || 1113,
    credentials: {
        username: process.env.EVENTSTORE_PORT || 'admin',
        password: process.env.EVENTSTORE_PORT || 'changeit'
    }
});

var EventStoreRange = require('../index.js');

before(function(done){
  this.timeout(10000);
  console.log('Preparing the tests data...');
  var k = 0;
  var addEvent = function(){
    client.writeEvent(streamToken, 'TestEventType', { something: k }).then(function() {
      k++;
      if(k < 50){
        addEvent();
      } else {
        done();
      }
    });
  }
  addEvent();
});

describe('GetStreamRange (default chunkSize)', function() {

  var esRange = new EventStoreRange(client);

  it("returns all the stream's events", function (done) {
    esRange.getStreamRange(streamToken, 'start', 'end', function(err, res){
      res.should.have.length(50);
      done();
    });
  });

  it("returns stream's events from start to a given number", function (done) {
    esRange.getStreamRange(streamToken, 'start', 9, function(err, res){
      res.should.have.length(10);
      done();
    });
  });

  it("returns error if range is between 2 numbers", function (done) {
    esRange.getStreamRange(streamToken, 12, 20, function(err, res){
      err.should.equal('no such range option at the moment');
      done();
    });
  });

  it("returns stream's events from a given number to the end", function (done) {
    esRange.getStreamRange(streamToken, 12, 'end', function(err, res){
      res.should.have.length(38);
      done();
    });
  });

  it("returns 'Target Event out of range' error if the choosen initial event is bigger than the last event", function (done) {
    esRange.getStreamRange(streamToken, 99, 'end', function(err, res){
      err.should.equal('Target Event out of range');
      done();
    });
  });

});

describe('GetStreamRange (chunkSize = 1)', function() {

  var esRange = new EventStoreRange(client, {chunkSize: 1});

  it("returns all the stream's events", function (done) {
    esRange.getStreamRange(streamToken, 'start', 'end', function(err, res){
      res.should.have.length(50);
      done();
    });
  });

  it("returns stream's events from start to a given number", function (done) {
    esRange.getStreamRange(streamToken, 'start', 9, function(err, res){
      res.should.have.length(10);
      done();
    });
  });

  it("returns error if range is between 2 numbers", function (done) {
    esRange.getStreamRange(streamToken, 12, 20, function(err, res){
      err.should.equal('no such range option at the moment');
      done();
    });
  });

  it("returns stream's events from a given number to the end", function (done) {
    esRange.getStreamRange(streamToken, 12, 'end', function(err, res){
      res.should.have.length(38);
      done();
    });
  });

  it("returns 'Target Event out of range' error if the choosen initial event is bigger than the last event", function (done) {
    esRange.getStreamRange(streamToken, 99, 'end', function(err, res){
      err.should.equal('Target Event out of range');
      done();
    });
  });

});

describe('GetStreamRange (chunkSize = 1000)', function() {

  var esRange = new EventStoreRange(client, {chunkSize: 1000});

  it("returns all the stream's events", function (done) {
    esRange.getStreamRange(streamToken, 'start', 'end', function(err, res){
      res.should.have.length(50);
      done();
    });
  });

  it("returns stream's events from start to a given number", function (done) {
    esRange.getStreamRange(streamToken, 'start', 9, function(err, res){
      res.should.have.length(10);
      done();
    });
  });

  it("returns error if range is between 2 numbers", function (done) {
    esRange.getStreamRange(streamToken, 12, 20, function(err, res){
      err.should.equal('no such range option at the moment');
      done();
    });
  });

  it("returns stream's events from a given number to the end", function (done) {
    esRange.getStreamRange(streamToken, 12, 'end', function(err, res){
      res.should.have.length(38);
      done();
    });
  });

  it("returns 'Target Event out of range' error if the choosen initial event is bigger than the last event", function (done) {
    esRange.getStreamRange(streamToken, 99, 'end', function(err, res){
      err.should.equal('Target Event out of range');
      done();
    });
  });

});

describe('GetStreamRange (chunkSize = 10)', function() {

  var esRange = new EventStoreRange(client, {chunkSize: 10});

  it("returns all the stream's events", function (done) {
    esRange.getStreamRange(streamToken, 'start', 'end', function(err, res){
      res.should.have.length(50);
      done();
    });
  });

  it("returns stream's events from start to a given number", function (done) {
    esRange.getStreamRange(streamToken, 'start', 9, function(err, res){
      res.should.have.length(10);
      done();
    });
  });

  it("returns error if range is between 2 numbers", function (done) {
    esRange.getStreamRange(streamToken, 12, 20, function(err, res){
      err.should.equal('no such range option at the moment');
      done();
    });
  });

  it("returns stream's events from a given number to the end", function (done) {
    esRange.getStreamRange(streamToken, 12, 'end', function(err, res){
      res.should.have.length(38);
      done();
    });
  });

  it("returns 'Target Event out of range' error if the choosen initial event is bigger than the last event", function (done) {
    esRange.getStreamRange(streamToken, 99, 'end', function(err, res){
      err.should.equal('Target Event out of range');
      done();
    });
  });

});