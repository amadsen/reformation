"use strict";

var rc = require("rc"),
    async = require("async"),
    dust = require("dustjs-linkedin"),
    deepExtend = require("deep-extend"),
    pkgInfo = require("./package.json");

var defaults = {
  defaultOptions: {
    template: "json"
  }
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

/*
This appears as Reformation().reform(opts, callback) - settings is
provided by the Reformation instance the function is bound
to (using .bind())
*/
function reform(settings, opts, callback){
    // This is where the per request / invocation fun happens

    // verify that we have a proper callback (if this is an http
    // request, the http server should have generated the callback.)
    opts = deepExtend({}, settings.defaultOptions, opts);
    callback = callback || opts.callback;
    if (callback && 'function' !== typeof callback) {
        return console.error("Improper callback provided for reform(opts, callback)! Ignoring invocation.");
    }

    // create a render context that provides all of the services
    // from settings.services
    // TODO: consider preparing the renderContext when settings are provided
    // and passing it in as a bound parameter, like settings.
    var renderContext = {},
        // the default template which we should compile when the module is
        // initially required. Used when a template name is not specified.
        templateName = opts.templateName,
        // output is used to collect data from dust stream for non-streaming calls
        output = "",
        stream;
    Object.keys(settings.services).forEach( function(key){
      renderContext[key] = function(chunk, context, bodies, params) {
        return chunk.map( function(chunk) {
          // all services execute as asynchronus dustjs handlers

          // make sure to check the authorization module before
          // calling the service
        });
      };
    });

    // check for a render template based on the templateName

    // temple should also be available by it's md5 hash

    // Use the dust streaming interface to render the template
    stream = dust.stream(templateName, renderContext);
    if('function' === typeof callback){
      // See http://www.dustjs.com/docs/api/ for info on Dustjs streaming API
      stream.on('data', function(segment) {
              output += segment;
            })
            .on('end', function() {
              if('function' === typeof callback){
                callback(null, output);
                callback = null;
              }
            })
            .on('error', function(error) {
              if('function' === typeof callback){
                callback(error);
                callback = null;
              }
            });
    }
    // Make sure we return the stream for users of the streaming interface
    // TODO: determine if we need to wrap the dustjs stream in a more
    // generic Node stream so we can .pipe() it directly to an http
    // response stream.
    return stream;

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

if (module === process.mainModule) {
    // TODO: consider spinning up reformation.js instead to get arg parsing
    console.log(
      "ERROR: The reformation module's index.js is not intended to be run as the main process module."
    );
}
