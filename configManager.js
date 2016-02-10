// loads and parses configuration file that configures server

var fs  = require("fs");
var +   = require("lodash");

// export function for setting up service manager, which will set up server
module.exports = ConfigManager;

function ConfigManager() {
    this.configFile = {};
}
