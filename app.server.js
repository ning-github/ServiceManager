// the entry point from which we begin our server

// import service manager
var ServiceManager = require("./serviceManager.js");
// import services
var Search = require("./services/search/search.js");
// import API routes
var Routes = require("./routes.js");

//// begin ////

// instantiate service manager, passing in config file
var serviceManager = new ServiceManager("./config.json");
// create the actual express server
// set port and routes

// add services

// START the server
