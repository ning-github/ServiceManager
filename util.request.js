var http       = require('http');
var https      = require('https');
var urlParser  = require('url');
var path       = require('path');

var _          = require('lodash');
var Promise    = require('bluebird');

module.exports = RequestUtil;

function RequestUtil(options){

}

// success res
RequestUtil.prototype.jsonRes = function(res, obj, code){
    // make sure its stringified JSON
	var json = _.isObject(obj) ? JSON.stringify(obj) : obj;

    // status code
	if(!code) {
        code = 200;
    }

    // successfully respond
	res.writeHead(code, {"Content-Type": "application/json"});
	res.end(json);
};

// error res
RequestUtil.prototype.errorRes = function(res, errorObj, code){
    /*
        expects obj to come in a format:
        {
            key: "general.get.invalid",
            statusCode: 400,
            message: "this is why we can't have nice things." [optional]
        }
    */
    console.error(errorObj.key);
    return this.jsonRes(res, errorObj, errorObj.statusCode);
};
