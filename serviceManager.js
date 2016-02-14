var http    = require("http");
var https   = require("https");
var url     = require("url");
var express = require("express");

// module export for use in app.server.js
module.exports = ServiceManager;

// declare names for helper function classes
var GeneralUtil, RequestUtil, DatabaseUtil;


//////////////
//// Constructor
/////////////
function ServiceManager(configFile){
    // import utils
    RequestUtil = require("./util.request.js")

    // load configuration
    var ConfigManager = require("./configManager.js");
    var configurer = new ConfigManager();
    this.options = configurer.loadConfigFileSync(configFile);
    // ensure that services and session settings are initialized
    this.options.services = this.options.services || {};
    this.options.services.session = this.options.services.session || {};

    // set env
    global.ENV = this.options.env || "dev";

    /* set up and attach request request-handling utilities
        (this way can extend to each service this instance will manage) */
    this.requestUtil = new RequestUtil();

    // initialize empty objects where the managed services and routes will be populated
    this.services = {};
    this.routes = {};
}

//////////////
//// Create Express Server
/////////////
ServiceManager.prototype.createServer = function(server) {
    // expects an express invokation to be passed in, but if not, it will do it
    this.app = server || express();
}

//////////////
//// Set port, routes
/////////////
ServiceManager.prototype.setPort = function(port) {
    this.options.services.port = port;
}

ServiceManager.prototype.setRoutes = function(routes) {
    this.routes = routes;
}

//////////////
//// Add service method that will be used to grow more services to the back end
/////////////
ServiceManager.prototype.addService = function(library) {
    /*
        "Email" : {
            lib: *{library of email service}*
        }
    }
    */
    this.services[library.serviceName] = {
        lib: library
    }
}
