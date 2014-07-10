var qs = require('qs');
var request = require('request');
var soap = require('soap');
var xml2js = require('xml2js').Parser({
  mergeAttrs: true,
  normalizeTags: true
});

exports.login = function (opts, callback) {
  var data = {Login: opts.username, Password: opts.password};
  var url = opts.url + '/games/aspnet/casinolobby/services.asmx?wsdl';

  soap.createClient(url, function (err, client) {
    if (err) return callback(err);
    client.Login(data, function (err, result) {
      callback(err || result.Error, {token: result.Token});
    });
  });
};

exports.tournaments = {};

exports.tournaments.get = function (opts, callback) {
  var url = opts.url + '/games/aspnet/dataxml/dataxml.aspx?' + qs.stringify({
    Action: 'LobbyTrnyScores',
    Language: opts.language || 'en',
    Token: opts.token,
    TrnyEventId: opts.tournamentId
  });

  request(url, function (err, res, body) {
    if (err) return callback(err);
    xml2js.parseString(body, function (err, result) {
      if (err) return callback(err);
      result = result.websqlresult;
      err = result.errors[0];
      if (err) return callback(err);
      callback(null, result.xmldata[0]);
    });
  });
};

exports.tournaments.list = function (opts, callback) {
  var url = opts.url + '/games/aspnet/dataxml/dataxml.aspx?' + qs.stringify({
    Action: 'LobbyTrny',
    Language: opts.language || 'en',
    Token: opts.token
  });

  request(url, function (err, res, body) {
    if (err) return callback(err);
    xml2js.parseString(body, function (err, result) {
      if (err) return callback(err);
      result = result.websqlresult;
      err = result.errors[0];
      if (err) return callback(err);
      callback(null, result.xmldata[0]);
    });
  });
};
