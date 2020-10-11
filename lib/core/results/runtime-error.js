const { TraceableResult } = require("./traceable-result");

class RuntimeError extends TraceableResult{}

module.exports = {
    RuntimeError
}