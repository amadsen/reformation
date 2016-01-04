"use strict";

var Reformation = require("../index.js"),
    pkgInfo = require("../package.json"),
    nopt = require("nopt"),
    usage = require("nopt-usage"),
    Stream = require("stream").Stream,
    path = require("path"),
    knownOpts = {
        hostnames: [String, Array],
        ipaddress: String,
        port: Number,
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
      hostnames: [/^.*$/],
      ipaddress: "0.0.0.0",
      port: 8080,
      log: "info"
    },
    description = {
      hostnames: "The set of hostname regular expression patterns the server will accept requests for, checked in order.",
      ipaddress: "The ip address you would like the server to listen on.",
      port: "The port you would like the server to listen on.",
      help: "Display CLI usage information.",
      version: "Display Reformation version information.",
      log: "Set log level for the CLI invoked server.",
      "service-dir": "Directory or directories where service modules can be found.",
      //"parser-dir": "Directory or directories where parser modules can be found.",
      "helper-dir": "Directory or directories where helper modules can be found.",
      authorization: "Path to the global authorization module that should be used by the CLI invoked http server.",
    },
    parsed = nopt(knownOpts, shortHands, process.argv, 2);

//console.log(parsed);

if(parsed.help || parsed.version){
  console.log(
    pkgInfo.name, "\n",
    "Version: ", pkgInfo.version, "\n",
    pkgInfo.description, "\n\n"
  );

  if(parsed.help){
    console.log(
      usage(knownOpts, shortHands, description, defaults)
    );
  }
  // --version and --help should only show he requested information
  return;
}





var reformer = Reformation( parsed );
