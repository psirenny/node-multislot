var multislot = require('../lib');
var should = require('chai').should();
var url = process.env.MULTISLOT_URL;
var username = process.env.MULTISLOT_USERNAME;
var password = process.env.MULTISLOT_PASSWORD;

describe('multislot', function () {
  it('should be an object', function () {
    multislot.should.be.an('object');
  });

  describe('login', function () {
    it('should be a function', function () {
      multislot.login.should.be.a('function');
    });

    it('should fail on an invalid user', function (done) {
      var opts = {username: '', password: '', url: url};
      multislot.login(opts, function (err) {
        (err === null).should.not.be.true;
        done();
      });
    });

    it('should succeed', function (done) {
      var opts = {username: username, password: password, url: url};
      multislot.login(opts, function (err, data) {
        data.should.be.an('object');
        data.token.should.be.a('string');
        done(err);
      });
    });
  });

  describe('tournaments', function () {
    var token;

    before(function (done) {
      var opts = {username: username, password: password, url: url};
      multislot.login(opts, function (err, data) {
        token = data.token;
        done(err);
      });
    });

    it('should be an object', function () {
      multislot.tournaments.should.be.an('object');
    });

    describe('list', function () {
      it('should be a function', function () {
        multislot.tournaments.list.should.be.a('function');
      });

      it('should fail on an invalid url', function (done) {
        var opts = {token: token, url: 'https://www.google.com'};
        multislot.tournaments.list(opts, function (err, data) {
          (err === null).should.not.be.true;
          done();
        });
      });

      it('should fail on an invalid token', function (done) {
        var opts = {token: 'invalid', url: url};
        multislot.tournaments.list(opts, function (err, data) {
          (err === null).should.not.be.true;
          done();
        });
      });

      it('should succeed', function (done) {
        var opts = {token: token, url: url};
        multislot.tournaments.list(opts, function (err, data) {
          data.should.be.an('object');
          data.tournaments.should.be.an('array');
          done(err);
        });
      });
    });

    describe('get', function () {
      var tournamentId;

      before(function (done) {
        var opts = {token: token, url: url};
        multislot.tournaments.list(opts, function (err, data) {
          if (err) done(err);
          var tournaments = data.tournaments[0];
          if (!tournaments) return done('no tournaments');
          tournamentId = tournaments.trnyevent[0].TrnyEventId[0];
          console.log('tournamentId:', tournamentId);
          done(err);
        });
      });

      it('should be a function', function () {
        multislot.tournaments.get.should.be.a('function');
      });

      it('should fail on an invalid url', function (done) {
        var opts = {token: token, tournamentId: tournamentId, url: 'https://www.google.com'};
        multislot.tournaments.get(opts, function (err, data) {
          (err === null).should.not.be.true;
          done();
        });
      });

      it('should fail on an invalid token', function (done) {
        var opts = {token: '', tournamentId: tournamentId, url: url};
        multislot.tournaments.get(opts, function (err, data) {
          (err === null).should.not.be.true;
          done();
        });
      });

      it('succeed', function (done) {
        var opts = {token: token, tournamentId: tournamentId, url: url};
        multislot.tournaments.get(opts, function (err, data) {
          data.should.be.an('object');
          data.trnyevent.should.be.an('array');
          done(err);
        });
      });
    });
  });
});
