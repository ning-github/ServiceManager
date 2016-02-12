var http    = require("http");
var https   = require("https");
var url     = require("url");
var express = require("express");

// module export for use in app.server.js
module.exports = ServiceManager;

// declare names for helper function classes
var GeneralUtil, RequestUtil, DatabaseUtil;

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

    // set up and attach request request-handling utilities
    this.requestUtil = new RequestUtil();
}
