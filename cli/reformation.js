"use strict";

var pkgInfo = require("../package.json"),
    nopt = require("nopt"),
    usage = require("nopt-usage"),
    Stream = require("stream").Stream,
    path = require("path"),
    rc = require("rc"),
    startServer = require("../lib/start-server.js"),
    knownOpts = {
        hostnames: [String, Array],
        ipaddress: String,
        port: Number,
        cluster: [Number, Boolean],
        help: Boolean,
        version: Boolean,
        log: [String, Array],
        "service-dir": [String, Array],
        //"parser-dir": [String, Array],
        "helper-dir": [String, Array],
        authorization: String
    },
    shortHands = {
        "usage": ["--help"],
        "?": ["--help"],
        "host": ["--hostnames"],
        "ip": ["--ipaddress"]
    },
    defaults = {
      ipaddress: "0.0.0.0",
      port: 8080,
      log: "info"
    },
    description = {
      hostnames: "The set of hostname regular expression patterns the server will accept requests for, checked in order.",
      ipaddress: "The ip address you would like the server to listen on.",
      port: "The port you would like the server to listen on.",
      cluster: "CLI invoked server should set up a cluster with n processes. A negative value means n less than the number of available CPU cores.",
      help: "Display CLI usage information.",
      version: "Display Reformation version information.",
      log: "Set log level for the CLI invoked server.",
      "service-dir": "Directory or directories where service modules can be found.",
      //"parser-dir": "Directory or directories where parser modules can be found.",
      "helper-dir": "Directory or directories where helper modules can be found.",
      authorization: "Path to the global authorization module that should be used by the CLI invoked http server."
    },
    parsed,
    conf;

if(module === process.mainModule){
  parsed = nopt(knownOpts, shortHands, process.argv, 2);
  //console.log(parsed);
  if(parsed.help || parsed.version){
    console.log(
      pkgInfo.name, "\n",
      "Version: ", pkgInfo.version, "\n",
      pkgInfo.description, "\n"
    );

    if(parsed.help){
      console.log(
        usage(knownOpts, shortHands, description, defaults)
      );
    }
    // --version and --help should only show the requested
    // information, then quit.
    return;
  }

  conf = rc( pkgInfo.name.toLowerCase()+"-httpd-", defaults, parsed);

  // normalize our hostname filters
  if('string' === typeof conf.hostnames) {
    conf.hostnames = [conf.hostnames];
  }
  if(Array.isArray(conf.hostnames)) {
    conf.hostnames = conf.hostnames.map(function makeRegExp(item){
      return (item instanceOf RegExp)? item : new RegExp(item);
    })
  }
}

// Whether single process, cluster master or cluster worker, we
// start the server (perhaps without intializing the conf variable in the
// case of a worker.)
console.log("Starting server with configuration: ", conf);
startServer(conf);
