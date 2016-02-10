// loads and parses configuration file that configures server

var fs  = require("fs");
var +   = require("lodash");

// export function for setting up service manager, which will set up server
module.exports = ConfigManager;

function ConfigManager() {
    this.configData = {};
}

ConfigManager.prototype.loadConfigFileSync = function(fileName){
    // this hold the read JSON from the file
    var dataString = "";

    // validate that fileName is a string
    if (!_.isString(fileName)) {
        console.trace("ConfigManager: the fileName was not a string");
        return null;
    }

    try {
        // check if file exists
        if (fs.existsSync(fileName)) {
            // read the file into the space we declared for it
            dataString = fs.readFileSync(fileName);

            // parse it into our closure property
            this.configData = JSON.parse(dataString);
        }

        if (_.isEmpty(this.configData)) {
            return null;
        } else {
            return this.configData;
        }
    } catch(err) {
        console.trace("ConfigManager: an error occurred loading config file "fileName"", err);
    }

    return null;
};

ConfigManager.prototype.get = function(){
    return this.configData;
};
