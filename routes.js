var routes = [
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
];


module.exports = routes;
