module.exports = {
    getHelloWorld: getHelloWorld
};

function getHelloWorld(req, res) {
    return this.requestUtil.jsonRes(res, {status: "ok", data: "hello world"});
};
