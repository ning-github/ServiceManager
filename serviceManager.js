var http    = require("http");
var https   = require("https");
var url     = require("url");
var express = require("express");

// module export for use in app.server.js
module.exports = ServiceManager;

// declare names for helper function classes
var GeneralUtil, RequestUtil, DatabaseUtil;

function ServiceManager(configFile){

    // load configuration
    var ConfigManager = require("./configManager.js");
    var configurer = new ConfigManager();
    this.settings = configurer.loadConfigFileSync(configFile);
}
