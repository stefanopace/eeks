class TraceableResult {
    constructor(){
        this.trace = [];
    }

    addTrace(trace){
        this.trace.push(trace);
        return this;
    }

    getTrace(){
        return this.trace.map(t => '> ' + t).reverse().join('\n');
    }
}

module.exports = {
    TraceableResult
}