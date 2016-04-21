"use strict";

var filterHostnames = require("./filter-hostnames-middleware.js"),
    reformationRequestHandler = require("./reformation-request-handler.js"),
    os = require('os'),
    cluster = require("cluster"),
    http = require('http'),
    express = require("express"),
    templates = {};

module.exports = function startServerOrCluster( conf ) {

  // cluster.isMaster indicates (to us) that this is a candidate
  // to be a master process
  if(cluster.isMaster){
    // Are we clustering?
    var shouldCluster = (conf.cluster === true || conf.cluster <= 0 || conf.cluster > 0),
        numWorkers = 1;

    if(shouldCluster){
        // master process
        numWorkers = os.cpus().length;
        if(conf.cluster <= 0){
          // adding the zero or negative value subtracts it from the number of
          // available CPU cores previously recorded.
          numWorkers += parsed.cluster;
        } else if(conf.cluster > 0){
          numWorkers = conf.cluster;
        }

        // Create the specified number of workers
        for (var i = 0; i < numWorkers; i += 1) {
          cluster.fork();
        }

        // when child processes die, restart them - we should only try
        // to kill the service via the master process
        cluster.on('exit', function (worker) {
          if (worker.suicide !== true) {
            cluster.fork();
          }
        });

        // when a child process is coming on line, make sure it gets a
        // copy of the configuration and template cache
        cluster.on('online', function(worker) {
          worker.send({
            conf: conf,
            templates: templates
          })
        });
    } else {
      // single process mode
      startServer(conf);
    }
  } else {
    // We must be a child process, so we're already clustering

    // load the configuration and template cache
    process.on('message', function(msg) {
      msg = msg || {};
      if(!conf && msg.conf){
        conf = msg.conf;

        if(msg.templates){
          // this is where we load the templates in each process
        }

        // and now that we have configuration and templates, we
        // can start listening
        startServer(conf);
      }
    });
  }
}


function startServer (conf) {
  var app = express(),
      rootRoute = app.route("/");

  // only accept requests that match the host name filters
  // then pass them to the Reformation request handler.
  rootRoute.all(filterHostnames(conf), reformationRequestHandler(conf));

  http.createServer(app).listen(conf.port, conf.ipaddress);
}
