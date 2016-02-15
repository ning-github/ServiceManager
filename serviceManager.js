var http    = require("http");
var https   = require("https");
var url     = require("url");
var express = require("express");
var Promise = require("bluebird");

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
    this.routesMap = routes;
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

//////////////
//// Methods to get the service property, or that property's actual service object
/////////////
ServiceManager.prototype.getService = function(serviceName) {
    return this.services[serviceName].service;
}

ServiceManager.prototype.get = function(serviceName) {
    return this.services[serviceName];
}

//////////////
//// Initialize services
/////////////
ServiceManager.prototype.initializeServices = function() {
    return new Promise(function(resolve, reject){
        for(var serviceName in this.services) {
            // call service constructor to initialize that service
                // note how Service is captilized since is constructor
                // note that the servive manager is passing itself in as the second arg
            var service = this.services[serviceName].lib.Service(this.options, this);
            // save itself as the service property of the existing servive object
            this.services[serviceName].service = service;
            /*
                this.services of service manager instance now looks like this:

                {
                    "Search": {
                        lib: *{library of email service}*,
                        service: *{newly instantiated instance of the service itself}*
                    }
                }
            */
        }
        // once initialization is complete, resolve promise so rest of setup can continue
        resolve();
    }.bind(this));
};

//////////////
//// Set up the routes, using the added services
/////////////
