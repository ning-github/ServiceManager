var http    = require("http");
var https   = require("https");
var url     = require("url");
var express = require("express");
var Promise = require("bluebird");
var _       = require("lodash");

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
ServiceManager.prototype.createExpressServer = function(server) {
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
    // put them in routes map to later configure into this.routes property
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
//// Configure the routes, using the added services
/////////////

ServiceManager.prototype.configureRoutes = function () {
    // the purpose of this method is:
    //       POPULATE this.routes USING this.routesMap AND INITIALIZED SERVICES

    // loop through routes map
    _.forEach(this.routesMap, function(route){
        /*
            recall that each route looks like:

            {
                api: "/api/helloWorld",         // endpoint
                service: "search",              // service it belongs to
                controller: "search",           // the controller in that service
                method: {
                    get: {                      // type of request
                        func: "getHelloWorld"   // name of controller function
                    }
                }
            }

            that each this.services.lib looks like:

            {
                name: "search",
                // the actual service file itself
                Service:    require("./search.service.js"),
                // constants
                const:      require("./search.const.js"),
                // controllers
                controller: {
                    search: require("./controller/search.controller.js")
                }
            }

        */
        var service = this.services[route.service].service;
        var controllers = this.services[route.service].lib.controller;

        var controller = controllers[route.controller];

        // SAVE the whole route in the routes object with unique key as its endpoint
        this.routes[route.api] = {
            source = route
        };

        // then have to address each method in that route (get, post, etc)
        _.forEach(route.method, function(method, verb){
            // get the actual function using the string name as a key
            var func = controller[method.func];

            // save that function to this.routes using the REST verb as a key
            this.routes[route.api][verb] = {
                service: service,
                func: func
            }
        }.bind(this));
    }.bind(this));
};

//////////////
//// Set up routes from this.routes
/////////////
ServiceManager.prototype.setupRoutes = function () {
    // set a health-check route
    this.app.use("/health-check", function(req, res, next){
        res.status(200).send("I am healthy");
    });

    
};

//////////////
//// actually create the http server and listen on the previosuly provided port
/////////////
