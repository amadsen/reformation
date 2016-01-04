"use strict";

var Reformation = require("../index.js"),
    nopt = require("nopt"),
    Stream = require("stream").Stream,
    path = require("path"),
    knownOpts = {
        host: String,
        port: Number,
        help: Boolean
    },
    shortHands = {
        "?": [--help]
    },
    parsed = nopt(knownOpts, shortHands, process.argv, 2);

console.log(parsed);


var reformer = Reformation( parsed );