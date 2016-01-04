"use strict";

var rc = require("rc"),
    async = require("async"),
    dust = require("dustjs-linkedin"),
    deepExtend = require("deep-extend"),
    pkgInfo = require("./package.json");

var defaults = {

};

// Parse .reformationrc files here, but
// don't parse command line args (by passing
// an empty object for the argv parameter.)
// This avoids reparsing the same .reformationrc
// files on every instantiation of Reformation.
rc( pkgInfo.name.toLowerCase(), defaults, {});

var reformationPrototype = {
    constructor: Reformation
};

function reform(settings, opts, callback){
    // This is where the per request / invocation fun happens

    // verify that we have a proper callback (if this is an http
    // request, the http server should have generated the callback.)
    opts = opts || {};
    callback = callback || opts.callback;
    if ('function' !== typeof callback) {
        return console.error("No proper callback provided for load(opts, callback)! Ignoring invocation.");
    }

    // verify that we have an acceptable opts.data object

    // verify that we have an acceptable opts.response object

    //...
}

function Reformation( config ){

    // now deep extend our defaults and rc file provided configuration with
    // provided config (which may or may not have come from
    // nopt-parsed process.argv.)
    var settings = deepExtend({}, defaults, config);

    // if you didn't use it as a constructor, we'll pretend you did anyway
    if ( this.prototype.constructor !== Reformation ) {
        return new Reformation( config );
    }

    // bind our common load function to the Reformation instance and
    // inject the settings object as it's first parameter. The outside
    // world will see this as (new Reformation(cfg)).load(options, callback);
    // and is unaware of and unable to access settings.
    this.reform = reform.bind(this, settings);

    return this;
}

Reformation.prototype = reformationPrototype;
module.exports = Reformation;

if (module === process.main) {
    // TODO: consider spinning up reformation.js instead to get arg parsing
    Reformation();
}
