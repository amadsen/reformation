# Reformation
Reformation is a node module that allows you to specify a set of services to call, values to retrieve from the responses, and transformations to apply before returning the result according to a template you provide. It can be used either directly as a node module or as a data aggregation http server.

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

## Configuration
Reformation can be configured in three ways:

1. using .reformationrc files, as understood by the rc module
2. using command line arguments, as parsed by the nopt module
3. passing a configuration object in to the constructor returned by the reformation node module itself

Configuration passed via command line or constructor will override configuration via .reformationrc files.

### Possible configuration values

+ services - the set of patterns describing service urls that this reformation instance is explicitly allowed to make calls to. It is advisable to use this set to restrict parameterized calls to just the web services you would like to call through this instance.
+ parsers - a hash of mime-types to parser modules. (will have a defualt values that uses trumpet for html, a streaming xml parser for xml, and a simple JSON.parse for json. Might use canvas for getting image data.)
+ helpers - a hash of named [Dust helpers](http://www.dustjs.com/guides/dust-helpers/), in addition to the defaults, that should be available in the template to manipulate the data. Alternatively, it may be a path or set of paths containing modules to be required that return a function or an object with named function references to be added as dust helpers.
	+ Note that LinkedIn's dust-helpers module and the common-dust-helpers module are already included.

#### Command line only

+ port - the port you would like the server to listen on. Defaults to `8080`.
+ ipaddress - the ipaddress you would like the server to listen on. Defaults to `0.0.0.0`.
+ hostnames - the set of hostname regular expression patterns the server will accept requests for, checked in order. The default list is `[/^.*$/]`, which means any hostname.

## Possible Request Options

Request options may be passed by directly using the load method of the object returned by the Reformation constructor or by making and http call to the reformation service, passing the options object as the request body.

+ data - a hash of data source names to named data literals and service calls from which the responseTemplate will be populated. Service calls may be
	+ functions that take a done(err, data) callback as their only argument
	+ module references that export the same
	+ or a url in string or object form (urls without a host will assume 'localhost'.)
	+ **If any url, url object, or module reference is invalid the request will be ignored and an error passed to the callback.**
+ response - an object with three keys
	+ type - the mime-type to send as the content type of the response. Defaults to the first value in the accepts header for http requests.
	+ template - a template describing how to construct a response from the data. Templates are Dust.js templates, either referenced by name or passed in as a literal. If no template is provided, the default behavior is to return the resolved data object, running JSON.stringify on it if it is to be written to an http response. **This template should make sense for the specified response type.**
	+ error - a template describing how to construct an error response. **This template should make sense for the specified response type.**
