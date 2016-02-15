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
serviceManager.createExpressServer();
// set port and routes
serviceManager.setPort(7002);
serviceManager.setRoutes(Routes);

// add services
serviceManager.addService(Search);
// START the server
