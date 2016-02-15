// the service module itself
module.exports = SearchService;
var Promise = require("bluebird");

// constructor
/* the actual instance of the service manager (that initialzes
    this service ) also passes itself into the service itsel's constructor.
        - confusing, and honestly not an ideal pattern
*/
function SearchService(options, serviceManager) {
    try {
        // declare names for datastore modules that connect the service to db layer
        var SearchStore;

        // gets its own library file so it can access datastore modules and constants
        var Search = require('./search.js');

        /* basically constructor's purpose is setting up the connections to
        the datastore modules mentioned above, like so:

        !!!!
        SearchStore = Search.datastore.SearchStore;
        this.searchStore = new SearchStore(*databuckets or tables or other params*);
        !!!!

        */
    }
    catch(err) {
        // if something goes wrong during the hooking up of the service's data modules
        console.trace("Error setting up datamodule connections to Search service -- ", err);
    }
}

// this start function is what in turn CALLS THE STARTS OF THE DATAMODULES
/* it likely does so by promisification to make sure everything is ready
    before proceeding with further service manager setup or server listening commmencment*/
SearchService.prototype.start = function(){
    return new Promise(function(resolve, reject){
        // start the datamodule (which itself is often promisified as well);
        /*

        this.searchStore.start()
            .then(function(){
                // resolves succcess
                console.log('searchStore started just fine');
                resolve():
            })
            .catch(function(err){
                console.error('searchStore start failed ', err);
                throw(err);
            })
            .then(resolve, reject);

        */
        resolve():
    }).bind(this);
}
