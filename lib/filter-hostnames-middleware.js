"use strict";

module.exports = function filterHostnames(conf){
  if(!Array.isArray(conf.hostnames)) {
    return function noopMiddleware (req, res, next) {
      next();
    };
  }

  return function filterHostnamesMiddleware(req, res, next) {
    var i, l, hostRegExp;
    for (var i = 0, l = conf.hostnames.length; i < l; i++) {
        hostRegExp = conf.hostnames[i];
        if(hostRegExp.test(req.hostname)){
          next();
          return;
        }
    }
    next('route');
    return;
  };
};
