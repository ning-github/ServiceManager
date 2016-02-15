// entry point file into a service and its controllers
module.exports = {
	name: "search",
    // the actual service file itself
	Service:    require("./search.service.js"),
    // constants
	const:      require("./search.const.js"),
    // controllers
    controller: {
        search: require("./controller/search.controller.js")
    }
	/* when hooking up db layer, would do so through datastore modules like
	datastore: {
		SearchStore = require("./search.datastore.js") or something like that
	}

	*/
};
