    
const { MongoClient } = require("mongodb");

const state = {
    db:null
}

module.exports.get = function(){
    const uri ="mongodb://127.0.0.1:27017";
    const dbname = 'new_Shopping_Cart'
    
    state.db = new MongoClient(uri).db(dbname);
    return state.db
}



