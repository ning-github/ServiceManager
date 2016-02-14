// entry point file into a service and its controllers
module.exports = {
	name: "search",
    // the actual service file itself
	service:    require("./search.service.js"),
    // constants
	const:      require("./search.const.js"),
    // controllers
    controller: {
        search: require("./controller/search.controller.js")
    }
};
