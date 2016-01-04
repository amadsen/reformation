# Reformation
Reformation is a node module that allows you to specify a set of services to call, values to retrieve from the responses, and transformations to apply before returning the result according to a template you provide. It can be used either directly as a node module or as a data aggregation http server.

Another way to think of Reformation is as a single service that implements a flexible interface for "Back-ends for Front-ends" patterned architecture, without requiring a proliferation of service endpoints for each front end. In principle, Reformation should allow a client to receive *only the data they requested, that they are authorized to receive, in the format they want it.*

## Installation
Reformation can be installed using the standard node process:

~~~bash
$ npm install --save reformation
~~~

It provides an http server command line interface that can be run by calling:

~~~bash
$ ./node_modules/bin/reformation
~~~

You can also install it globally and run the command line interface:

~~~bash
$ npm install -g reformation
$ reformation
~~~

It can also be required as a standard node module.

## Configuration
Reformation can be configured in three ways:

1. using `.reformationrc` files, as understood by the `rc` module
2. using command line arguments, as parsed by the `nopt` module
3. passing a configuration object in to the constructor returned by the reformation node module itself

Configuration passed via command line or constructor will override configuration via `.reformationrc` files.

### Possible configuration values


	NOTE: We have straightened out how 
	services, data, and parsers work
	together. We will keep the services
	key and use it to map names to data
	sources similar to the way data was
	defined as part of the request options
	previously. The parsers key only stays
	around to support default parsing of
	responses for services specified only
	as a url and simple parsing
	instructions (a "data source
	descriptor").

	Parsers and data source descriptors
	will not be implemented initially.

	This change reflects a desire that the
	client not know anything about the
	back-end service or data source used
	by the Reformation instance, instead
	concerning itself only with the data
	provided.


+ **services** - a hash of data source names to named data literals, service descriptors, and service calls from which each request's response template will be populated. Services may be defined as
	+ a data literal, which is an object or reference to a json file to be parsed and returned
	+ a function that take an optional options object that supports passing in the active request using the request key and a `done(err, data)` callback as their only arguments
	+ module references that exports a single function with options and  `done(err, data)` callback arguments as described above
	+ a data source descriptor *(Not implemented)*, in either string or object form. Data source descriptors contain
		+ parser arguments
		+ a url in string or object form (urls without a host will assume 'localhost'.)
		+ (maybe) a request template to describe how the internal service request should be constructed...
+ **parsers** *(Not implemented)* - a hash of mime-types to parser modules. This may have defaults that use `trumpet` for html, a streaming xml parser for xml, and a simple `JSON.parse` for json. We might use `canvas` for getting image data. Parsers are only used by services defined as a data source descriptor. Each parser may define its own parser arguments.
+ **authorization** - if defined, a function or module exporting such a function, that takes the request as an argument and returns an object describing the services (or portions of services) that request is allowed to receive. As such, the response template will be populated by the intersection of the requested data (derived from the request template), the authorized data described by this object, and the available data returned from the services.

	~~~
		Keep in mind that services are also
		provided the incoming request and
		may make their own authorization
		decisions. The `authorization` key
		is only intended to provide a
		global authorization mechanism.
	~~~

	*Denial of authorization should be applied as early as possible* to avoid unnecessary service calls.
+ **helpers** - a hash of named [Dust helpers](http://www.dustjs.com/guides/dust-helpers/), in addition to the defaults, that should be available in the template to manipulate the data. Alternatively, it may be a path or set of paths containing modules to be required that return a function or an object with named function references to be added as dust helpers.
	+ Note that LinkedIn's dust-helpers module and the common-dust-helpers module are already included.

#### Command line only

+ port - the port you would like the server to listen on. Defaults to `8080`.
+ ipaddress - the ipaddress you would like the server to listen on. Defaults to `0.0.0.0`.
+ hostnames - the set of hostname regular expression patterns the server will accept requests for, checked in order. The default list is `[/^.*$/]`, which means any hostname.

## Possible Request Options

Request options may be passed by directly using the load method of the object returned by the Reformation constructor (or, when run from the cli, by making an http call to the reformation service, passing the options object as the request body OR as request headers, prefixed by `reformation-response-`.)

+ **type** - the mime-type to send as the content type of the response. Defaults to the first value in the accepts header for http requests.
+ **template** - a template describing how to construct a response from the data. Templates are Dust.js templates, either referenced by name (if precompiled and loaded in the Reformation instance under that name), sha1 hash, or passed in as a literal. If no template is provided, the default behavior is to return the resolved data object, running JSON.stringify on it if it is to be written to an http response. 
	+ **This template should make sense for the specified response type.**
	+ **A template referenced by name or hash that cannot be resolved will be ignored and an error passed to the callback.**
+ error - a template describing how to construct an error response. 
	+ **This template should make sense for the specified response type.**
