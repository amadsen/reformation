"use strict";

var Reformation = require("../index.js"),
    pkgInfo = require("../package.json"),
    glob = require("glob");

module.exports = function reformationRequestHandler(conf) {
  var reformer = Reformation( prepareReformationOptions(conf) );

  return function aReformationRequestHandler(req, res, next) {
    var opts = prepareReformationRequestSpecificOptions(res, res);
    // do something with the incoming request...
    var reformStream = reformer.reform(opts);

    // if a streaming mode is requested, pipe the stream to the response
    if(opts.stream){
      reformStream.pipe(res);
    }

    return reformStream;
  };
};

// prepare Reformation options
function prepareReformationOptions (conf) {
  var reformationOpts = {
        log: conf.log
      };

  // require services modules
  reformationOpts["services"] = getModules(conf["service-dir"]);
  // require parser modules
  //reformationOpts["parsers"] = getModules(conf["parser-dir"]);
  // require helper modules
  reformationOpts["helpers"] = getModules(conf["helper-dir"]);
  // require authorization module
  reformationOpts["authorization"] = getModules(conf["authorization"])[0];

  return reformationOpts;
}

function getModules (globList) {
  return [];
}

function prepareReformationRequestSpecificOptions (req, res) {
  function reformedCallback(err, data){
    if(err){
      return next(err);
    }

    // if a non-streaming mode is requested...
    res.end(data);
  }

  return {
    stream: true,
    callback: function noop (){}
  };
}
