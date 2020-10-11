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

    getLastTrace(){
        return this.trace[0];
    }
}

module.exports = {
    TraceableResult
}