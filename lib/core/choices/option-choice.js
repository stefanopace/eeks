class OptionChoice {
    constructor(name){
        this.name = name
    }

    exit(){
        return false
    }

    goBack(){
        return false
    }
}

module.exports = {
    OptionChoice
}